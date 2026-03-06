use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

pub fn notify_timer_finished(app: &AppHandle) {
    let _ = app
        .notification()
        .builder()
        .title("SetDown")
        .body("Time's up!")
        .show();
}
