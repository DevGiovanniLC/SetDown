import { useEffect, useState } from "react";
import "./App.css";
import Timer, { TimerStatus } from "./components/Timer";
import TimerController from "./components/TimerController";
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import ActionGroup, { FinishAction } from "./components/ActionGroup";
import TimerSelector from "./components/TimerSelector";


function App() {
  const [timerValue, setTimerValue] = useState("00:00:00");
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("idle");
  const [finishAction, setFinishAction] = useState<FinishAction>("notify");

  const isRunning = timerStatus === "running";
  const isPaused = timerStatus === "paused";
  const canPlay = timerValue !== "00:00:00";

  const handleTimerChange = async (value: string) => {
    if (isPaused) {
      await invoke('stop_timer_command');
      setTimerStatus("idle");
    }
    setTimerValue(value);
  }

  const handlePlay = async () => {
    if (isPaused) {
      await invoke('resume_timer_command');
      setTimerStatus("running");
      return;
    }

    await invoke('start_timer_command', { hms: timerValue });
    setTimerStatus("running");
  }

  const handleStop = async () => {
    await invoke('stop_timer_command');
    setTimerValue("00:00:00");
    setTimerStatus("idle");
  }

  const handlePause = async () => {
    await invoke('pause_timer_command');
    setTimerStatus("paused");
  }

  useEffect(() => {
    const unlistenTick = listen('timer_tick', (event) => {
      return setTimerValue(event.payload as string);
    });

    const unlistenFinished = listen('timer_finished', () => {
      setTimerStatus("idle");
    });

    return () => {
      unlistenTick.then((f) => f());
      unlistenFinished.then((f) => f());
    };
  }, []);

  return (
    <div className="app-shell">
      <div className="aurora aurora--one" />
      <div className="aurora aurora--two" />
      <div className="app-card">
        <div className="p-0 m-0 ">
          <span
            className={`status-pill ${
              timerStatus === "running"
                ? "status-pill--running"
                : timerStatus === "paused"
                  ? "status-pill--paused"
                  : "status-pill--idle"
            }`}
          >
            {timerStatus === "running" ? "Running" : timerStatus === "paused" ? "Paused" : "Idle"}
          </span>
        </div>

        <div className="space-y-2">
          <p className="section-caption">Timer</p>
          <div className="flex items-center justify-center ml-10">
            <Timer
              value={timerValue}
              onChange={handleTimerChange}
              timerStatus={timerStatus}
            />

            <TimerSelector
              isRunning={isRunning}
              handlePresetSelect={handleTimerChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="section-caption">When timer ends</p>
          <ActionGroup
            finishAction={finishAction}
            setFinishAction={setFinishAction}
          />
        </div>

        <TimerController
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          canPlay={canPlay}
        />
      </div>
    </div>
  );
}

export default App;

