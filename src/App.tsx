import "./App.css";
import Timer from "./components/Timer";
import TimerController from "./components/TimerController";

function App() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Timer />
      <TimerController />
    </div>
  );
}

export default App;
