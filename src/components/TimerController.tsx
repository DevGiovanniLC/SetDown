import { Button } from "react-aria-components";
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
        <div className="flex gap-8 justify-center items-center mt-4">
            <Button
                onPress={handlePlayPause}
                isDisabled={!isRunning && !canPlay}
                className={isRunning ? "rounded-full w-14 h-14 flex items-center justify-center bg-linear-to-br from-yellow-400 to-yellow-500 shadow-lg hover:scale-115 transition-transform duration-300 " :
                    "rounded-full w-14 h-14 flex items-center justify-center bg-linear-to-br from-green-400 to-green-500 shadow-lg hover:scale-115 transition-transform duration-300 disabled:opacity-50 disabled:hover:scale-100"}
                aria-label={isRunning ? "Pause" : "Start"}
            >
                {isRunning ? <Pause className="w-7 h-7 text-zinc-100" /> : <Play className="w-7 h-7 text-zinc-100" />}
            </Button>
            <Button
                onPress={handleStop}
                className="rounded-full w-14 h-14 flex items-center justify-center bg-linear-to-br from-red-400 to-red-500 shadow-lg hover:scale-115 transition-transform duration-300 disabled:opacity-50 disabled:hover:scale-100"
                aria-label="Stop"
                isDisabled={!isRunning && !canPlay}
            >
                <Square className="w-7 h-7 text-zinc-100" />
            </Button>
        </div>
    );
}

export default TimerController;