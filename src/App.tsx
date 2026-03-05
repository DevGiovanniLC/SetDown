import { useState } from "react";
import "./App.css";
import Timer from "./components/Timer";
import TimerController from "./components/TimerController";
import ActionGroup, { FinishAction } from "./components/ActionGroup";
import TimerSelector from "./components/TimerSelector";
import Titlebar from "./components/Titlebar";
import { useTimerState } from "./context/TimerContext";


function App() {
  const { timerStatus } = useTimerState();
  const [finishAction, setFinishAction] = useState<FinishAction>("notify");

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
              <Timer />
              <TimerSelector />
            </div>
            <TimerController />
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

