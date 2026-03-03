use crate::services::timer;

#[tauri::command]
pub fn pause_timer_command() {
    timer::pause_timer();
}

#[tauri::command]
pub fn stop_timer_command() {
    timer::stop_timer();
}

#[tauri::command]
pub fn resume_timer_command() {
    timer::resume_timer();
}

#[tauri::command]
pub fn start_timer_command(app: tauri::AppHandle, hms: String) {
    timer::start_timer(app, hms);
}
