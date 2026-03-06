import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { createContext, useContext, useEffect, useState } from "react";

export type FinishAction = "poweroff" | "hibernate" | "lockscreen" | "notify";

interface FinishActionContextValue {
	finishAction: FinishAction;
	setFinishAction: (action: FinishAction) => void;
}

const FinishActionContext = createContext<FinishActionContextValue | undefined>(
	undefined,
);

export function FinishActionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// Leer la última acción guardada en localStorage
	const getInitialAction = (): FinishAction => {
		const stored = localStorage.getItem("finishAction");
		if (
			stored === "poweroff" ||
			stored === "hibernate" ||
			stored === "lockscreen" ||
			stored === "notify"
		) {
			return stored as FinishAction;
		}
		return "notify";
	};
	const [finishAction, setFinishActionState] =
		useState<FinishAction>(getInitialAction);

	// Guardar en localStorage cada vez que se cambie
	const setFinishAction = (action: FinishAction) => {
		setFinishActionState(action);
		localStorage.setItem("finishAction", action);
	};

	useEffect(() => {
		const unlistenFinished = listen("timer_finished", () => {
			switch (finishAction) {
				case "poweroff":
					void invoke("power_off_command");
					break;
				case "hibernate":
					void invoke("hibernate_command");
					break;
				case "lockscreen":
					void invoke("lock_screen_command");
					break;
				case "notify":
					void invoke("notify_timer_finished_command");
					break;
				default:
					break;
			}
		});

		return () => {
			void unlistenFinished.then((f) => f());
		};
	}, [finishAction]);

	const value = {
		finishAction,
		setFinishAction,
	};

	return (
		<FinishActionContext.Provider value={value}>
			{children}
		</FinishActionContext.Provider>
	);
}

export function useFinishAction() {
	const context = useContext(FinishActionContext);
	if (!context) {
		throw new Error(
			"useFinishAction must be used within FinishActionProvider",
		);
	}

	return context;
}
