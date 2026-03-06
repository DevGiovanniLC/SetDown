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
		// biome-ignore lint/a11y/noStaticElementInteractions: <Tiene que ser clicable para poder arrastrar la ventana, pero no es un botón ni nada interactivo>
		<header
			className="flex items-center justify-between bg-zinc-950 w-full px-3 py-2 z-20"
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

			<div className="flex items-center justify-center gap-3">
				<button
					type="button"
					className="border border-zinc-600 rounded-md py-1 px-2 hover:bg-zinc-700/50 transition-colors duration-300 text-sm"
					onClick={handleMinimize}
					aria-label="Minimizar ventana"
				>
					—
				</button>

				<button
					type="button"
					className="border border-zinc-600 rounded-md py-0.5 px-2.5 hover:bg-red-900/80 transition-colors duration-300"
					onClick={handleClose}
					aria-label="Cerrar ventana"
				>
					×
				</button>
			</div>
		</header>
	);
}

export default Titlebar;
