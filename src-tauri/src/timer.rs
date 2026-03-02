use std::{
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex,
    },
    thread,
    time::Duration,
};
use tauri::AppHandle;
use tauri::Emitter as TauriEmitter;

// Estado global del temporizador
lazy_static::lazy_static! {
    static ref TIMER_STATE: Arc<Mutex<Option<TimerHandle>>> = Arc::new(Mutex::new(None));
}

struct TimerHandle {
    pause: Arc<AtomicBool>,
    stop: Arc<AtomicBool>,
}

/// Convierte una string 'hh:mm:ss' a segundos
fn parse_hms_to_seconds(hms: &str) -> Option<u64> {
    let parts: Vec<&str> = hms.split(':').collect();
    if parts.len() != 3 {
        return None;
    }
    let h = parts[0].parse::<u64>().ok()?;
    let m = parts[1].parse::<u64>().ok()?;
    let s = parts[2].parse::<u64>().ok()?;
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
    {
        let mut state = TIMER_STATE.lock().unwrap();
        if let Some(prev_handle) = state.take() {
            prev_handle.stop.store(true, Ordering::SeqCst);
            prev_handle.pause.store(false, Ordering::SeqCst);
        }
    }

    let pause = Arc::new(AtomicBool::new(false));
    let stop = Arc::new(AtomicBool::new(false));
    let handle = TimerHandle {
        pause: pause.clone(),
        stop: stop.clone(),
    };
    {
        let mut state = TIMER_STATE.lock().unwrap();
        *state = Some(handle);
    }
    thread::spawn(move || {
        if let Some(mut secs) = parse_hms_to_seconds(&hms) {
            while secs > 0 {
                // Chequear si se debe parar
                if stop.load(Ordering::SeqCst) {
                    break;
                }
                // Chequear si se debe pausar
                while pause.load(Ordering::SeqCst) {
                    thread::sleep(Duration::from_millis(200));
                    if stop.load(Ordering::SeqCst) {
                        break;
                    }
                }
                if stop.load(Ordering::SeqCst) {
                    break;
                }
                let hms_str = seconds_to_hms(secs);
                let _ = TauriEmitter::emit(&app, "timer_tick", hms_str.clone());
                thread::sleep(Duration::from_secs(1));
                secs -= 1;
            }
            // Solo enviar finalización si terminó naturalmente.
            if secs == 0 && !stop.load(Ordering::SeqCst) {
                let _ = app.emit("timer_tick", "00:00:00");
            }
        }
    });
}

pub fn pause_timer() {
    let state = TIMER_STATE.lock().unwrap();
    if let Some(handle) = &*state {
        handle.pause.store(true, Ordering::SeqCst);
    }
}

pub fn stop_timer() {
    let state = TIMER_STATE.lock().unwrap();
    if let Some(handle) = &*state {
        handle.stop.store(true, Ordering::SeqCst);
    }
}
