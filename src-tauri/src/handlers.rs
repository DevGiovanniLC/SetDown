pub mod actions;
pub mod timer;

#[macro_export]
macro_rules! generate_handlers {
    () => {{
        use $crate::handlers::{actions, timer};
        tauri::generate_handler![
            timer::start_timer_command,
            timer::pause_timer_command,
            timer::resume_timer_command,
            timer::stop_timer_command,
            timer::set_timer_value_command,
            actions::notify_timer_finished_command,
            actions::power_off_command,
            actions::hibernate_command,
            actions::lock_screen_command
        ]
    }};
}
