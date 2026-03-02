mod timer;

#[tauri::command]
fn pause_timer_command() {
    crate::timer::pause_timer();
}

#[tauri::command]
fn stop_timer_command() {
    crate::timer::stop_timer();
}

#[tauri::command]
fn resume_timer_command() {
    crate::timer::resume_timer();
}

#[tauri::command]
fn start_timer_command(app: tauri::AppHandle, hms: String) {
    crate::timer::start_timer(app, hms);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            start_timer_command,
            pause_timer_command,
            resume_timer_command,
            stop_timer_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
