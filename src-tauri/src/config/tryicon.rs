use std::sync::OnceLock;
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

use crate::services::timer;

const QUIT_MENU_ID: &str = "quit";
const PLAY_PAUSE_MENU_ID: &str = "play-pause";
const STOP_MENU_ID: &str = "stop";
const MAIN_TRAY_ID: &str = "main-tray";
const MAIN_WINDOW_ID: &str = "main";
const DEFAULT_APP_NAME: &str = "SetDown";
const PLAY_LABEL: &str = "Play";
const PAUSE_LABEL: &str = "Pause";

static BASE_TOOLTIP: OnceLock<String> = OnceLock::new();
static PLAY_PAUSE_MENU_ITEM: OnceLock<tauri::menu::MenuItem<tauri::Wry>> = OnceLock::new();
static STOP_MENU_ITEM: OnceLock<tauri::menu::MenuItem<tauri::Wry>> = OnceLock::new();

fn build_app_tooltip() -> String {
    DEFAULT_APP_NAME.to_string()
}

fn get_base_tooltip() -> String {
    BASE_TOOLTIP
        .get()
        .cloned()
        .unwrap_or_else(|| DEFAULT_APP_NAME.to_string())
}

pub fn set_tray_tooltip(app: &tauri::AppHandle, suffix: Option<String>) {
    let tooltip = match suffix {
        Some(text) => format!("{}\n{}", get_base_tooltip(), text),
        None => get_base_tooltip(),
    };

    if let Some(tray) = app.tray_by_id(MAIN_TRAY_ID) {
        if let Err(err) = tray.set_tooltip(Some(tooltip)) {
            eprintln!("[tray] failed to update tooltip: {err}");
        }
    }
}

pub fn set_play_pause_menu_label(is_running: bool) {
    let label = if is_running { PAUSE_LABEL } else { PLAY_LABEL };

    if let Some(item) = PLAY_PAUSE_MENU_ITEM.get() {
        if let Err(err) = item.set_text(label) {
            eprintln!("[tray] failed to update play/pause label: {err}");
        }
    }
}

pub fn set_timer_actions_enabled(enabled: bool) {
    if let Some(item) = PLAY_PAUSE_MENU_ITEM.get() {
        if let Err(err) = item.set_enabled(enabled) {
            eprintln!("[tray] failed to update play/pause enabled state: {err}");
        }
    }

    if let Some(item) = STOP_MENU_ITEM.get() {
        if let Err(err) = item.set_enabled(enabled) {
            eprintln!("[tray] failed to update stop enabled state: {err}");
        }
    }
}

fn restore_main_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window(MAIN_WINDOW_ID) {
        if let Err(err) = window.unminimize() {
            eprintln!("[tray] failed to unminimize main window: {err}");
        }
        if let Err(err) = window.show() {
            eprintln!("[tray] failed to show main window: {err}");
        }
        if let Err(err) = window.set_focus() {
            eprintln!("[tray] failed to focus main window: {err}");
        }
    }
}

pub fn build_tray_icon(app: &mut tauri::App) -> tauri::Result<()> {
    let play_pause_item = MenuItemBuilder::with_id(PLAY_PAUSE_MENU_ID, PLAY_LABEL).build(app)?;
    let stop_item = MenuItemBuilder::with_id(STOP_MENU_ID, "Stop").build(app)?;
    let quit_item = MenuItemBuilder::with_id(QUIT_MENU_ID, "Quit").build(app)?;
    let tray_menu = MenuBuilder::new(app)
        .items(&[&play_pause_item, &stop_item, &quit_item])
        .build()?;
    let tooltip = build_app_tooltip();
    let _ = BASE_TOOLTIP.set(tooltip.clone());
    let _ = PLAY_PAUSE_MENU_ITEM.set(play_pause_item.clone());
    let _ = STOP_MENU_ITEM.set(stop_item.clone());
    set_timer_actions_enabled(false);

    let Some(icon) = app.default_window_icon().cloned() else {
        eprintln!("[tray] default window icon not found; skipping tray icon setup");
        return Ok(());
    };

    let _tray = TrayIconBuilder::with_id(MAIN_TRAY_ID)
        .tooltip(tooltip)
        .menu(&tray_menu)
        .icon(icon)
        .on_menu_event(|app, event| match event.id().as_ref() {
            PLAY_PAUSE_MENU_ID => timer::toggle_play_pause(app.clone()),
            STOP_MENU_ID => timer::stop_timer(app.clone()),
            QUIT_MENU_ID => app.exit(0),
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
                restore_main_window(&app);
            }
        })
        .build(app)?;

    Ok(())
}
