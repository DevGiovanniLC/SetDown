import { useTimerState } from "../context/TimerContext";

function StatusPill() {
    const { isRunning, isPaused } = useTimerState();
    const baseClass = "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300";
    const statusClass = isRunning
        ? "border-emerald-300/60 bg-emerald-500/20 text-emerald-200"
        : isPaused
            ? "border-amber-300/60 bg-amber-500/20 text-amber-200"
            : "border-zinc-500/70 bg-zinc-700/40 text-zinc-200";

    const statusLabel = isRunning ? "Running" : isPaused ? "Paused" : "Idle";
    return (
        <span className={`${baseClass} ${statusClass}`}>{statusLabel}</span>
    );
}

export default StatusPill;