import { Pause, Play, Square } from "lucide-react";
import { Button, Toolbar } from "react-aria-components";
import { useTimerActions, useTimerState } from "../context/TimerContext";

function TimerController() {
	const { isRunning, canPlay } = useTimerState();
	const {
		handlePlay: play,
		handlePause: pause,
		handleStop: stop,
	} = useTimerActions();
	const baseButtonClass =
		"bg-purple-500/20 border-blue-300/70 border flex h-15 w-15 items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

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
						? `${baseButtonClass} hover:shadow-[0_0_20px_rgba(255,195,94,0.40)]`
						: `${baseButtonClass} hover:shadow-[0_0_20px_rgba(0,255,43,0.40)]`
				}
				aria-label={isRunning ? "Pause" : "Start"}
			>
				{isRunning ? (
					<Pause className="w-7 h-7 text-amber-500" />
				) : (
					<Play className="w-7 h-7 text-green-500" />
				)}
			</Button>
			<Button
				onPress={handleStop}
				className={`${baseButtonClass} hover:shadow-[0_0_20px_rgba(244,63,94,0.40)]`}
				aria-label="Stop"
				isDisabled={!isRunning && !canPlay}
			>
				<Square className="w-7 h-7 text-rose-500" />
			</Button>
		</Toolbar>
	);
}

export default TimerController;
