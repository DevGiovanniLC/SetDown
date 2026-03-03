use crate::services::notifier::{check_and_notify_five_minutes, reset_five_minute_notification};
use std::{
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc, Condvar, Mutex,
    },
    thread,
    time::{Duration, Instant},
};
use tauri::AppHandle;
use tauri::Emitter as TauriEmitter;

// Estado global del temporizador
lazy_static::lazy_static! {
    static ref TIMER_STATE: Arc<Mutex<Option<TimerHandle>>> = Arc::new(Mutex::new(None));
}

static NEXT_TIMER_ID: AtomicU64 = AtomicU64::new(1);

#[derive(Clone)]
struct TimerHandle {
    id: u64,
    control: Arc<(Mutex<TimerStatus>, Condvar)>,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum TimerStatus {
    Running,
    Paused,
    Stopped,
}

impl TimerHandle {
    fn set_status(&self, status: TimerStatus) {
        let (lock, cvar) = &*self.control;
        let mut current = lock.lock().unwrap();
        *current = status;
        cvar.notify_all();
    }

    fn get_status(&self) -> TimerStatus {
        let (lock, _) = &*self.control;
        *lock.lock().unwrap()
    }
}

/// Convierte una string 'hh:mm:ss' a segundos
fn parse_hms_to_seconds(hms: &str) -> Option<u64> {
    let (h_str, rest) = hms.split_once(':')?;
    let (m_str, s_str) = rest.split_once(':')?;

    let h = h_str.parse::<u64>().ok()?;
    let m = m_str.parse::<u64>().ok()?;
    let s = s_str.parse::<u64>().ok()?;
    Some(h * 3600 + m * 60 + s)
}

/// Convierte segundos a string 'hh:mm:ss'
fn seconds_to_hms(secs: u64) -> String {
    let h = secs / 3600;
    let m = (secs % 3600) / 60;
    let s = secs % 60;
    format!("{:02}:{:02}:{:02}", h, m, s)
}

/// Inicia un timer en background y envía la cuenta atrás al frontend por eventos
pub fn start_timer(app: AppHandle, hms: String) {
    // Detener el timer previo para evitar hilos duplicados y estados inconsistentes.
    let thread_handle = {
        let mut state = TIMER_STATE.lock().unwrap();
        if let Some(prev_handle) = state.take() {
            prev_handle.set_status(TimerStatus::Stopped);
        }

        let handle = TimerHandle {
            id: NEXT_TIMER_ID.fetch_add(1, Ordering::Relaxed),
            control: Arc::new((Mutex::new(TimerStatus::Running), Condvar::new())),
        };
        let thread_handle = handle.clone();
        *state = Some(handle);
        thread_handle
    };

    reset_five_minute_notification();

    thread::spawn(move || {
        if let Some(mut secs) = parse_hms_to_seconds(&hms) {
            let mut next_tick = Instant::now();

            while secs > 0 {
                let (lock, cvar) = &*thread_handle.control;
                let mut status = lock.lock().unwrap();

                while *status == TimerStatus::Paused {
                    status = cvar.wait(status).unwrap();
                    next_tick = Instant::now();
                }

                if *status == TimerStatus::Stopped {
                    break;
                }
                drop(status);

                check_and_notify_five_minutes(&app, secs);

                let hms_str = seconds_to_hms(secs);
                let _ = TauriEmitter::emit(&app, "timer_tick", hms_str);

                next_tick += Duration::from_secs(1);
                let now = Instant::now();
                if next_tick > now {
                    let wait_duration = next_tick - now;
                    let (lock, cvar) = &*thread_handle.control;
                    let status = lock.lock().unwrap();
                    let (status, _) = cvar
                        .wait_timeout_while(status, wait_duration, |s| *s == TimerStatus::Running)
                        .unwrap();

                    if *status == TimerStatus::Stopped {
                        break;
                    }

                    if *status == TimerStatus::Paused {
                        continue;
                    }
                } else {
                    next_tick = now;
                }

                secs -= 1;
            }

            // Solo enviar finalización si terminó naturalmente.
            if secs == 0 && thread_handle.get_status() != TimerStatus::Stopped {
                let _ = app.emit("timer_tick", "00:00:00");
                let _ = app.emit("timer_finished", ());
            }
        }

        let mut state = TIMER_STATE.lock().unwrap();
        if state.as_ref().map(|handle| handle.id) == Some(thread_handle.id) {
            *state = None;
        }
    });
}

pub fn pause_timer() {
    let state = TIMER_STATE.lock().unwrap();
    if let Some(handle) = &*state {
        if handle.get_status() == TimerStatus::Running {
            handle.set_status(TimerStatus::Paused);
        }
    }
}

pub fn resume_timer() {
    let state = TIMER_STATE.lock().unwrap();
    if let Some(handle) = &*state {
        if handle.get_status() == TimerStatus::Paused {
            handle.set_status(TimerStatus::Running);
        }
    }
}

pub fn stop_timer() {
    let state = TIMER_STATE.lock().unwrap();
    if let Some(handle) = &*state {
        handle.set_status(TimerStatus::Stopped);
    }
}
