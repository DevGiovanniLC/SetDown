import { useEffect, useState } from "react";
import "./App.css";
import Timer, { TimerStatus } from "./components/Timer";
import TimerController from "./components/TimerController";
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import ActionGroup, { FinishAction } from "./components/ActionGroup";
import TimerSelector from "./components/TimerSelector";
import Titlebar from "./components/Titlebar";


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
    <div className="app-shell flex flex-col">
        <Titlebar />
      <div className="aurora aurora--one" />
      <div className="aurora aurora--two" />
      <div className="app-card">
        <div className="content-layout">
          <aside className="flex items-center h-full" aria-label="Acciones al finalizar">
            <ActionGroup
              finishAction={finishAction}
              setFinishAction={setFinishAction}
            />
          </aside>

          <main className="flex gap-6 items-center justify-center flex-col py-8 px-6">
            <div className="flex items-center justify-center ml-8">
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

            <TimerController
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
              canPlay={canPlay}
            />
          </main>


          <div className="p-0 ml-4 flex justify-end w-full ">
            <span
              className={`status-pill ${timerStatus === "running"
                ? "status-pill--running"
                : timerStatus === "paused"
                  ? "status-pill--paused"
                  : "status-pill--idle"
                }`}
            >
              {timerStatus === "running" ? "Running" : timerStatus === "paused" ? "Paused" : "Idle"}
            </span>
          </div>

          <div className="layout-spacer" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default App;

