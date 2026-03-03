import { Button, Toolbar } from "react-aria-components";
import { Pause, Play, Square } from "lucide-react"
import { useEffect, useState } from "react";

interface TimerControllerProps {
    onPlay: () => void;
    onPause: () => void;
    onStop: () => void;
    canPlay?: boolean;
    onRunning?: (value: boolean) => void;
}

function TimerController({ onPlay, onPause, onStop, canPlay = true, onRunning: isRunningProp }: TimerControllerProps) {
    const [isRunning, setIsRunning] = useState(false);

    const handlePlayPause = () => {
        if (!isRunning && !canPlay) {
            return;
        }
        setIsRunning((prev) => !prev);
        if (isRunning) {
            onPause();
        } else {
            onPlay();
        }
    }

    const handleStop = () => {
        setIsRunning(false);
        onStop();
    }

    useEffect(() => {
        if (isRunningProp) {
            isRunningProp(isRunning);
        }
    }, [isRunningProp, isRunning]);

    useEffect(() => {
        if (!canPlay && isRunning) {
            setIsRunning(false);
        }
    }, [canPlay, isRunning]);

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