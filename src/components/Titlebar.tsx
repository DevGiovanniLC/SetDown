import { getCurrentWindow } from "@tauri-apps/api/window";

function Titlebar() {
    const appWindow = getCurrentWindow();

    const handleDragStart = async (event: React.MouseEvent<HTMLElement>) => {
        if (event.button !== 0) {
            return;
        }

        const target = event.target as HTMLElement;
        if (target.closest("button")) {
            return;
        }

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
            className="flex items-center justify-between bg-zinc-950 w-full px-3 pt-10 pb-2"
            data-tauri-drag-region
            onMouseDown={handleDragStart}
        >
            <h1 className="h-full flex items-center justify-center text-center select-none" data-tauri-drag-region>
                SetDown
            </h1>

            <div className="flex items-center justify-center gap-2">
                <button
                    type="button"
                    className="border border-zinc-600 rounded-sm py-1 px-2 hover:bg-zinc-700/50 transition-colors duration-300 text-sm"
                    onClick={handleMinimize}
                    aria-label="Minimizar ventana"
                >
                    —
                </button>

                <button
                    type="button"
                    className="border border-zinc-600 rounded-sm py-0.5 px-2.5 hover:bg-red-900/80 transition-colors duration-300"
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
