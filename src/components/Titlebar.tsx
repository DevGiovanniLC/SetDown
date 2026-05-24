import { getCurrentWindow } from "@tauri-apps/api/window";

function Titlebar() {
	const appWindow = getCurrentWindow();

	const handleDragStart = async (event: React.MouseEvent<HTMLElement>) => {
		if (
			event.button !== 0 ||
			(event.target as HTMLElement).closest("button")
		)
			return;
		await appWindow.startDragging();
	};

	const handleMinimize = async () => {
		await appWindow.minimize();
	};

	const handleClose = async () => {
		await appWindow.close();
	};

	return (
		<header
			role="toolbar"
			className="flex items-center justify-between w-full z-20 bg-zinc-950/10"
			data-tauri-drag-region
			onMouseDown={handleDragStart}
		>
			<img
				src="/icon.png"
				alt="SetDown Logo"
				className="h-8 w-8 rounded-xl"
				data-tauri-drag-region
			/>
			<h1
				className="h-full flex items-center justify-center text-center select-none ml-10 text-sm font-sans font-semibold"
				data-tauri-drag-region
			>
				SetDown
			</h1>

			<div className="flex items-end">
				<button
					type="button"
					className="w-10 h-10 flex items-center justify-center  hover:text-zinc-100 transition-colors duration-300 text-lg text-zinc-400"
					onClick={handleMinimize}
					aria-label="Minimizar ventana"
				>
					<span style={{ fontSize: "0.5em", lineHeight: 1 }}>—</span>
				</button>

				<button
					type="button"
					className="w-9 h-9 mb-0.5 flex items-center justify-center  hover:text-red-500/80 transition-colors duration-300 text-lg text-zinc-400"
					onClick={handleClose}
					aria-label="Cerrar ventana"
				>
					<span style={{ fontSize: "1.1em", lineHeight: 1 }}>×</span>
				</button>
			</div>
		</header>
	);
}

export default Titlebar;
