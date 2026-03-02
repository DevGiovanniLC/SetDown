import { useEffect, useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import TimerController from "./components/TimerController";
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';


function App() {
  const [timerValue, setTimerValue] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const canPlay = timerValue !== "00:00:00";

  const handleTimerChange = async (value: string) => {
    if (isPaused) {
      await invoke('stop_timer_command');
      setIsPaused(false);
    }
    setTimerValue(value);
  }

  const handlePlay = async () => {
    if (isPaused) {
      await invoke('resume_timer_command');
      setIsPaused(false);
      return;
    }

    await invoke('start_timer_command', { hms: timerValue });
    setIsPaused(false);
  }

  const handleStop = async () => {
    await invoke('stop_timer_command');
    setTimerValue("00:00:00");
    setIsPaused(false);
  }

  const handlePause = async () => {
    await invoke('pause_timer_command');
    setIsPaused(true);
  }

  useEffect(() => {
    const unlistenTick = listen('timer_tick', (event) => {
      return setTimerValue(event.payload as string);
    });

    const unlistenFinished = listen('timer_finished', () => {
      setIsPaused(false);
      setIsRunning(false);
    });

    return () => {
      unlistenTick.then((f) => f());
      unlistenFinished.then((f) => f());
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">

      <Timer value={timerValue} onChange={handleTimerChange} isRunning={isRunning} />
      <TimerController
        onPlay={handlePlay} onPause={handlePause} onStop={handleStop}
        canPlay={canPlay}
        onRunning={(value) => setIsRunning(value)}
      />
    </div>
  );
}

export default App;
