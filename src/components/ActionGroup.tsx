import { Bell, Moon, Power } from "lucide-react";
import { Radio, RadioGroup } from "react-aria-components";

export type FinishAction = "poweroff" | "hibernate" | "notify";


interface ActionGroupProps {
    finishAction: FinishAction | null | undefined;
    setFinishAction: (arg0: FinishAction) => void;
}

function ActionGroup(props: ActionGroupProps) {
    return (
        <RadioGroup
            aria-label="Acción al finalizar"
            value={props.finishAction}
            onChange={value => props.setFinishAction((value as FinishAction))}
            className="flex flex-col items-center gap-2 rounded-xl border border-zinc-700/55 bg-zinc-900/55 py-2 px-2 w-fit"
        >
            <Radio
                value="poweroff"
                className={({ isSelected }) =>
                    `action-chip ${isSelected ? "action-chip--power" : "action-chip--idle"}`
                }
                aria-label="Apagar"
            >
                <Power className="w-5 h-5" />
            </Radio>

            <Radio
                value="hibernate"
                className={({ isSelected }) =>
                    `action-chip ${isSelected ? "action-chip--hibernate" : "action-chip--idle"}`
                }
                aria-label="Hibernar"
            >
                <Moon className="w-5 h-5" />
            </Radio>

            <Radio
                value="notify"
                className={({ isSelected }) =>
                    `action-chip ${isSelected ? "action-chip--notify" : "action-chip--idle"}`
                }
                aria-label="Notificación"
            >
                <Bell className="w-5 h-5" />
            </Radio>
        </RadioGroup>
    );
}

export default ActionGroup;
