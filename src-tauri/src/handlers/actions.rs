
use crate::services::actions;

#[tauri::command]
pub fn notify_timer_finished_command(app: tauri::AppHandle) {
    actions::notify_finished(&app);
}

#[tauri::command]
pub fn power_off_command() -> Result<(), String> {
    actions::power_off().map_err(|err| err.to_string())
}

#[tauri::command]
pub fn hibernate_command() -> Result<(), String> {
    actions::hibernate().map_err(|err| err.to_string())
}

