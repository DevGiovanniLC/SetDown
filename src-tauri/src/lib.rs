mod timer;

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, WindowEvent,
};

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
        .setup(|app| {
            let quit_item = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
            let tray_menu = MenuBuilder::new(app).items(&[&quit_item]).build()?;

            let icon = app
                .default_window_icon()
                .ok_or("No se encontró icono por defecto")?
                .clone();

            let _tray = TrayIconBuilder::with_id("main-tray")
                .tooltip("SetDown")
                .menu(&tray_menu)
                .icon(icon)
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.unminimize();
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

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
        .invoke_handler(tauri::generate_handler![
            start_timer_command,
            pause_timer_command,
            resume_timer_command,
            stop_timer_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
