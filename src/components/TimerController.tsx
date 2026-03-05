import { Button, Toolbar } from "react-aria-components";
import { Pause, Play, Square } from "lucide-react"
import { useTimerActions, useTimerState } from "../context/TimerContext";

function TimerController() {
    const { isRunning, canPlay } = useTimerState();
    const { handlePlay: play, handlePause: pause, handleStop: stop } = useTimerActions();

    const handlePlayPause = () => {
        if (isRunning) {
            pause();
        } else {
            play();
        }
    }

    const handleStop = () => {
        stop();
    }

    return (
        <Toolbar aria-label="Controles del temporizador" className="flex gap-8 justify-center items-center">
            <Button
                onPress={handlePlayPause}
                isDisabled={!isRunning && !canPlay}
                className={
                    isRunning
                        ? "controller-btn controller-btn--pause"
                        : "controller-btn controller-btn--play"
                }
                aria-label={isRunning ? "Pause" : "Start"}
            >
                {isRunning ? <Pause className="w-7 h-7 text-zinc-100" /> : <Play className="w-7 h-7 text-zinc-100" />}
            </Button>
            <Button
                onPress={handleStop}
                className="controller-btn controller-btn--stop"
                aria-label="Stop"
                isDisabled={!isRunning && !canPlay}
            >
                <Square className="w-7 h-7 text-zinc-100" />
            </Button>
        </Toolbar>
    );
}

export default TimerController;