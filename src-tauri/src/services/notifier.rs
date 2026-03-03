use std::sync::atomic::{AtomicBool, Ordering};
use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

static FIVE_MIN_NOTIFIED: AtomicBool = AtomicBool::new(false);

pub fn reset_five_minute_notification() {
    FIVE_MIN_NOTIFIED.store(false, Ordering::Relaxed);
}

pub fn check_and_notify_five_minutes(app: &AppHandle, secs: u64) {
    if secs <= 300 && !FIVE_MIN_NOTIFIED.swap(true, Ordering::Relaxed) {
        let _ = app
            .notification()
            .builder()
            .title("SetDown")
            .body("5 minutes remaining!")
            .show();
    }
}
