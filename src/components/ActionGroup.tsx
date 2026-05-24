import { Bell, Lock, Moon, Power } from "lucide-react";
import { Radio, RadioGroup } from "react-aria-components";

import {
	type FinishAction,
	useFinishAction,
} from "../context/FinishActionContext";

function ActionGroup() {
	const { finishAction, setFinishAction } = useFinishAction();
	const baseChipClass =
		"h-8 w-8 cursor-pointer rounded-md border transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
	const idleChipClass =
		"border-blue-300/70 bg-purple-500/20 hover:bg-zinc-700";

	return (
		<RadioGroup
			aria-label="Acción al finalizar"
			value={finishAction}
			onChange={(value) => setFinishAction(value as FinishAction)}
			className="flex flex-col items-center gap-3 rounded-lg border border-blue-300/70 bg-purple-500/20 py-4 px-3 w-fit"
		>
			<Radio
				value="notify"
				className={({ isSelected }) =>
					`${baseChipClass} ${isSelected ? "border-amber-200 text-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.35)]" : idleChipClass}`
				}
				aria-label="Notificación"
			>
				<Bell className="w-4 h-4" />
			</Radio>

			<Radio
				value="lockscreen"
				className={({ isSelected }) =>
					`${baseChipClass} ${isSelected ? "border-sky-300 text-sky-500 shadow-[0_0_20px_rgba(2,132,199,0.35)]" : idleChipClass}`
				}
				aria-label="Bloquear pantalla"
			>
				<Lock className="w-4 h-4" />
			</Radio>

			<Radio
				value="hibernate"
				className={({ isSelected }) =>
					`${baseChipClass} ${isSelected ? "border-indigo-300 text-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.35)]" : idleChipClass}`
				}
				aria-label="Hibernar"
			>
				<Moon className="w-4 h-4" />
			</Radio>

			<Radio
				value="poweroff"
				className={({ isSelected }) =>
					`${baseChipClass} ${isSelected ? "border-rose-300 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.35)]" : idleChipClass}`
				}
				aria-label="Apagar"
			>
				<Power className="w-4 h-4" />
			</Radio>
		</RadioGroup>
	);
}

export default ActionGroup;
