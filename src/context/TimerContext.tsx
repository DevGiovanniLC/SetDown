import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

export type TimerStatus = "idle" | "running" | "paused";

interface TimerState {
    timerValue: string;
    timerStatus: TimerStatus;
    isRunning: boolean;
    isPaused: boolean;
    canPlay: boolean;
}

interface TimerActions {
    handleTimerChange: (value: string) => Promise<void>;
    handlePlay: () => Promise<void>;
    handlePause: () => Promise<void>;
    handleStop: () => Promise<void>;
}

const TimerStateContext = createContext<TimerState | undefined>(undefined);
const TimerActionsContext = createContext<TimerActions | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
    const [timerValue, setTimerValue] = useState("00:00:00");
    const [timerStatus, setTimerStatus] = useState<TimerStatus>("idle");

    const isRunning = timerStatus === "running";
    const isPaused = timerStatus === "paused";
    const canPlay = timerValue !== "00:00:00";

    const handleTimerChange = useCallback(
        async (value: string) => {
            if (isPaused) {
                await invoke("stop_timer_command");
            }
            setTimerValue(value);
            await invoke("set_timer_value_command", { hms: value });
        },
        [isPaused],
    );

    const handlePlay = useCallback(async () => {
        if (isPaused) {
            await invoke("resume_timer_command");
            return;
        }

        await invoke("start_timer_command", { hms: timerValue });
    }, [isPaused, timerValue]);

    const handleStop = useCallback(async () => {
        await invoke("stop_timer_command");
    }, []);

    const handlePause = useCallback(async () => {
        await invoke("pause_timer_command");
    }, []);

    useEffect(() => {
        void invoke("set_timer_value_command", { hms: "00:00:00" });

        const unlistenTick = listen("timer_tick", (event) => {
            setTimerValue(event.payload as string);
        });

        const unlistenFinished = listen("timer_finished", () => {
            setTimerStatus("idle");
        });

        const unlistenStatus = listen("timer_status", (event) => {
            setTimerStatus(event.payload as TimerStatus);
        });

        return () => {
            void unlistenTick.then((f) => f());
            void unlistenFinished.then((f) => f());
            void unlistenStatus.then((f) => f());
        };
    }, []);

    const stateValue = useMemo(
        () => ({
            timerValue,
            timerStatus,
            isRunning,
            isPaused,
            canPlay,
        }),
        [timerValue, timerStatus, isRunning, isPaused, canPlay],
    );

    const actionsValue = useMemo(
        () => ({
            handleTimerChange,
            handlePlay,
            handlePause,
            handleStop,
        }),
        [handleTimerChange, handlePlay, handlePause, handleStop],
    );

    return (
        <TimerStateContext.Provider value={stateValue}>
            <TimerActionsContext.Provider value={actionsValue}>{children}</TimerActionsContext.Provider>
        </TimerStateContext.Provider>
    );
}

export function useTimerState() {
    const context = useContext(TimerStateContext);
    if (!context) {
        throw new Error("useTimerState must be used within TimerProvider");
    }
    return context;
}

export function useTimerActions() {
    const context = useContext(TimerActionsContext);
    if (!context) {
        throw new Error("useTimerActions must be used within TimerProvider");
    }
    return context;
}
