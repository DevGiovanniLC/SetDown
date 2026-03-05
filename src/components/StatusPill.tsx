import { useTimerState } from "../context/TimerContext";

function StatusPill() {
    const { isRunning, isPaused } = useTimerState();
    const statusClass = isRunning
        ? "status-pill--running"
        : isPaused
            ? "status-pill--paused"
            : "status-pill--idle";

    const statusLabel = isRunning ? "Running" : isPaused ? "Paused" : "Idle";
    return (
        <span className={`status-pill ${statusClass}`}>{statusLabel}</span>
    );
}

export default StatusPill;