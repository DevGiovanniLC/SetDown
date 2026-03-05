use crate::services::timer;

#[tauri::command]
pub fn pause_timer_command(app: tauri::AppHandle) {
    timer::pause_timer(app);
}

#[tauri::command]
pub fn stop_timer_command(app: tauri::AppHandle) {
    timer::stop_timer(app);
}

#[tauri::command]
pub fn resume_timer_command(app: tauri::AppHandle) {
    timer::resume_timer(app);
}

#[tauri::command]
pub fn start_timer_command(app: tauri::AppHandle, hms: String) {
    timer::start_timer(app, hms);
}

#[tauri::command]
pub fn set_timer_value_command(app: tauri::AppHandle, hms: String) {
    timer::sync_timer_value(app, hms);
}
