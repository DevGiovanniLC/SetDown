import { Button } from "react-aria-components";
import { Pause, Play, Square } from "lucide-react"
import { useState } from "react";

function TimerController() {
    const [isRunning, setIsRunning] = useState(false);

    const handlePlayPause = () => {
        setIsRunning((prev) => !prev);
    }

    const handleStop = () => {
        setIsRunning(false);
    }

    return (
        <div className="flex gap-8 justify-center items-center mt-4">
            <Button
                onPress={handlePlayPause}
                className={isRunning ? "rounded-full w-14 h-14 flex items-center justify-center bg-linear-to-br from-yellow-400 to-yellow-500 shadow-lg hover:scale-115 transition-transform duration-300 " :
                    "rounded-full w-14 h-14 flex items-center justify-center bg-linear-to-br from-green-400 to-green-500 shadow-lg hover:scale-115 transition-transform duration-300 "}
                aria-label={isRunning ? "Pause" : "Start"}
            >
                {isRunning ? <Pause className="w-7 h-7 text-zinc-100" /> : <Play className="w-7 h-7 text-zinc-100" />}
            </Button>
            <Button
                onPress={handleStop}
                className="rounded-full w-14 h-14 flex items-center justify-center bg-linear-to-br from-red-400 to-red-500 shadow-lg hover:scale-115 transition-transform duration-300"
                aria-label="Stop"
            >
                <Square className="w-7 h-7 text-zinc-100" />
            </Button>
        </div>
    );
}

export default TimerController;