import { useEffect, useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import TimerController from "./components/TimerController";
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Radio, RadioGroup } from "react-aria-components";
import { Bell, Moon, Power } from "lucide-react";

type FinishAction = "poweroff" | "hibernate" | "notify";

function App() {
  const [timerValue, setTimerValue] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [finishAction, setFinishAction] = useState<FinishAction>("notify");
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

      <RadioGroup
        aria-label="Acción al finalizar"
        value={finishAction}
        onChange={(value) => setFinishAction(value as FinishAction)}
        className="flex items-center gap-3"
      >
        <Radio
          value="poweroff"
          className={({ isSelected }) =>
            `w-10 h-10 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
              isSelected
                ? "bg-red-600 border-red-300 text-white"
                : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
            }`
          }
          aria-label="Apagar"
        >
          <Power className="w-5 h-5" />
        </Radio>

        <Radio
          value="hibernate"
          className={({ isSelected }) =>
            `w-10 h-10 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
              isSelected
                ? "bg-indigo-600 border-indigo-300 text-white"
                : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
            }`
          }
          aria-label="Hibernar"
        >
          <Moon className="w-5 h-5" />
        </Radio>

        <Radio
          value="notify"
          className={({ isSelected }) =>
            `w-10 h-10 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
              isSelected
                ? "bg-amber-600 border-amber-300 text-white"
                : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
            }`
          }
          aria-label="Notificación"
        >
          <Bell className="w-5 h-5" />
        </Radio>
      </RadioGroup>

      <TimerController
        onPlay={handlePlay} onPause={handlePause} onStop={handleStop}
        canPlay={canPlay}
        onRunning={(value) => setIsRunning(value)}
      />
    </div>
  );
}

export default App;
