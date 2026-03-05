mod config;
mod handlers;
mod services;

use tauri::WindowEvent;

use crate::config::tryicon::build_tray_icon;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            build_tray_icon(app)?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if window.label() == "main" {
                if let WindowEvent::Resized(_) = event {
                    if window.is_minimized().unwrap_or(false) {
                        let _ = window.hide();
                    }
                }
            }
        })
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(generate_handlers!())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
