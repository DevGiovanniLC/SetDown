import { Button, Toolbar } from "react-aria-components";
import { Pause, Play, Square } from "lucide-react";
import { useTimerActions, useTimerState } from "../context/TimerContext";

function TimerController() {
	const { isRunning, canPlay } = useTimerState();
	const {
		handlePlay: play,
		handlePause: pause,
		handleStop: stop,
	} = useTimerActions();
	const baseButtonClass =
		"flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

	const handlePlayPause = () => {
		if (isRunning) {
			pause();
		} else {
			play();
		}
	};

	const handleStop = () => {
		stop();
	};

	return (
		<Toolbar
			aria-label="Controles del temporizador"
			className="flex gap-8 justify-center items-center"
		>
			<Button
				onPress={handlePlayPause}
				isDisabled={!isRunning && !canPlay}
				className={
					isRunning
						? `${baseButtonClass} bg-linear-to-br from-amber-400 to-amber-500`
						: `${baseButtonClass} bg-linear-to-br from-emerald-400 to-emerald-500`
				}
				aria-label={isRunning ? "Pause" : "Start"}
			>
				{isRunning ? (
					<Pause className="w-7 h-7 text-zinc-100" />
				) : (
					<Play className="w-7 h-7 text-zinc-100" />
				)}
			</Button>
			<Button
				onPress={handleStop}
				className={`${baseButtonClass} bg-linear-to-br from-rose-400 to-red-500`}
				aria-label="Stop"
				isDisabled={!isRunning && !canPlay}
			>
				<Square className="w-7 h-7 text-zinc-100" />
			</Button>
		</Toolbar>
	);
}

export default TimerController;
