#![allow(dead_code)]

use std::io;
use std::process::Command;

use crate::services::notifier::notify_timer_finished;


pub fn notify_finished( app: &tauri::AppHandle) {
    notify_timer_finished(app);
}

/// Apaga el equipo inmediatamente (Windows).
#[cfg(target_os = "windows")]
pub fn power_off() -> io::Result<()> {
	Command::new("shutdown").args(["/s", "/t", "0"]).spawn()?;
	Ok(())
}

/// Pone el equipo en hibernacion (Windows).
#[cfg(target_os = "windows")]
pub fn hibernate() -> io::Result<()> {
	Command::new("shutdown").arg("/h").spawn()?;
	Ok(())
}

/// Bloquea la sesion actual en Windows.
#[cfg(target_os = "windows")]
pub fn lock_screen() -> io::Result<()> {
	Command::new("rundll32.exe")
		.args(["user32.dll,LockWorkStation"])
		.spawn()?;
	Ok(())
}



/// Fallback para plataformas no soportadas.
#[cfg(target_os = "linux")]
pub fn power_off() -> io::Result<()> {
	Command::new("systemctl").arg("poweroff").spawn()?;
	Ok(())
}

/// Hiberna el equipo en Linux.
#[cfg(target_os = "linux")]
pub fn hibernate() -> io::Result<()> {
    Command::new("systemctl").arg("hibernate").spawn()?;
    Ok(())
}

/// Bloquea la sesion actual en Linux.
#[cfg(target_os = "linux")]
pub fn lock_screen() -> io::Result<()> {
	Command::new("loginctl").arg("lock-session").spawn()?;
	Ok(())
}

/// Apaga el equipo en macOS.
#[cfg(target_os = "macos")]
pub fn power_off() -> io::Result<()> {
	Command::new("osascript")
		
		.args(["-e", "tell application \"System Events\" to shut down"])
		
		.spawn()?;
	Ok(())
}

/// En macOS se usa modo reposo como equivalente practico.
#[cfg(target_os = "macos")]
pub fn hibernate() -> io::Result<()> {
	Command::new("pmset").arg("sleepnow").spawn()?;
	Ok(())
}

/// Bloquea la sesion actual en macOS.
#[cfg(target_os = "macos")]
pub fn lock_screen() -> io::Result<()> {
	Command::new("/System/Library/CoreServices/Menu Extras/User.menu/Contents/Resources/CGSession")
		.arg("-suspend")
		.spawn()?;
	Ok(())
}

/// Fallback para plataformas no soportadas.
#[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
pub fn power_off() -> io::Result<()> {
	Err(io::Error::new(
		io::ErrorKind::Unsupported,
		"power_off is not supported on this platform",
	))
}

/// Fallback para plataformas no soportadas.
#[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
pub fn hibernate() -> io::Result<()> {
	Err(io::Error::new(
		io::ErrorKind::Unsupported,
		"hibernate is not supported on this platform",
	))
}

/// Fallback para plataformas no soportadas.
#[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
pub fn lock_screen() -> io::Result<()> {
	Err(io::Error::new(
		io::ErrorKind::Unsupported,
		"lock_screen is not supported on this platform",
	))
}
