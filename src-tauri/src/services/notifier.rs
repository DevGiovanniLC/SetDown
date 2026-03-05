use std::sync::atomic::{AtomicBool, Ordering};
use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

static FIVE_MIN_NOTIFIED: AtomicBool = AtomicBool::new(false);

pub fn reset_five_minute_notification() {
    FIVE_MIN_NOTIFIED.store(false, Ordering::Relaxed);
}

pub fn check_and_notify(app: &AppHandle, secs: u64) {
    const FIVE_MINUTES: u64 = 5 * 60;
    
    if secs <= FIVE_MINUTES && !FIVE_MIN_NOTIFIED.swap(true, Ordering::Relaxed) {
        let _ = app
            .notification()
            .builder()
            .title("SetDown")
            .body("5 minutes remaining!")
            .show();
    }
}

pub fn notify_timer_finished(app: &AppHandle) {
    let _ = app
        .notification()
        .builder()
        .title("SetDown")
        .body("Time's up!")
        .show();
}
