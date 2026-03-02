import { useEffect, useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import TimerController from "./components/TimerController";
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';


function App() {
  const [timerValue, setTimerValue] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(false);
  const canPlay = timerValue !== "00:00:00";

  const handlePlay = async () => {
    await invoke('start_timer_command', { hms: timerValue });
  }

  const handleStop = async () => {
    await invoke('stop_timer_command');
    setTimerValue("00:00:00");
  }

  const handlePause = async () => {
    await invoke('pause_timer_command');
  }

  useEffect(() => {
    const unlisten = listen('timer_tick', (event) => {
      return setTimerValue(event.payload as string);
    });

    return () => { unlisten.then(f => f()); };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">

      <Timer value={timerValue} onChange={setTimerValue} isRunning={isRunning} />

      <TimerController
        onPlay={handlePlay} onPause={handlePause} onStop={handleStop}
        canPlay={canPlay}
        onRunning={(value) => setIsRunning(value)}
      />
    </div>
  );
}

export default App;
