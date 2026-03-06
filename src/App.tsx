import "./App.css";
import Timer from "./components/Timer";
import TimerController from "./components/TimerController";
import ActionGroup from "./components/ActionGroup";
import TimerSelector from "./components/TimerSelector";
import Titlebar from "./components/Titlebar";
import StatusPill from "./components/StatusPill";

function App() {
	return (
		<div className="relative flex h-full w-full flex-col items-center justify-center">
			<Titlebar />
			<div
				className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full opacity-[0.35] blur-[80px] animate-drift"
				style={{
					background:
						"radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.82) 0%, rgba(59, 130, 246, 0.55) 40%, rgba(30, 64, 175, 0.25) 72%, transparent 100%)",
					backdropFilter: "blur(80px) saturate(250%)",
				}}
			/>
			<div
				className="pointer-events-none absolute -right-20 -bottom-36 h-96 w-96 rounded-full opacity-[0.35] blur-[80px] animate-drift [animation-delay:-6s]"
				style={{
					background:
						"radial-gradient(circle at 70% 35%, rgba(232, 121, 249, 0.84) 0%, rgba(168, 85, 247, 0.56) 44%, rgba(91, 33, 182, 0.28) 74%, transparent 100%)",
				}}
			/>
			<div
				className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 bg-zinc-900/55 px-8 py-5 animate-card-in"
				style={{
					backgroundImage:
						"linear-gradient(125deg, rgba(24, 29, 48, 0.38) 0%, rgba(20, 23, 36, 0.247) 58%, rgba(17, 19, 30, 0.5) 100%), radial-gradient(circle at 85% 8%, rgba(59, 130, 246, 0.18) 0%, transparent 38%), radial-gradient(circle at 10% 90%, rgba(168, 85, 247, 0.18) 0%, transparent 40%)",
					backdropFilter: "blur(28px) saturate(130%)",
					WebkitBackdropFilter: "blur(28px) saturate(130%)",
					boxShadow:
						"0 22px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
				}}
			>
				<div className="grid grid-cols-[74px_minmax(0,1fr)_74px] items-start gap-x-3">
					<aside
						className="flex h-full items-center"
						aria-label="Acciones al finalizar"
					>
						<ActionGroup />
					</aside>

					<main className="flex flex-col items-center justify-center gap-6 px-6 py-8">
						<div className="ml-8 flex items-center justify-center">
							<Timer />
							<TimerSelector />
						</div>
						<TimerController />
					</main>

					<div className="ml-4 flex w-full justify-end p-0">
						<StatusPill />
					</div>

					<div className="w-18.5" aria-hidden="true" />
				</div>
			</div>
		</div>
	);
}

export default App;
