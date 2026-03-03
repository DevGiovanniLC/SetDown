import { Bell, Moon, Power } from "lucide-react";
import { Radio, RadioGroup } from "react-aria-components";

export type FinishAction = "poweroff" | "hibernate" | "notify";


interface ActionGroupProps {
    finishAction: FinishAction | null | undefined;
    setFinishAction: (arg0: FinishAction) => void;
}

function ActionGroup(props: ActionGroupProps) {
    return (<RadioGroup aria-label="Acción al finalizar" value={props.finishAction} onChange={value => props.setFinishAction((value as FinishAction))} className="flex items-center gap-3">
        <Radio value="poweroff" className={({
            isSelected
        }) => `w-12 h-12 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${isSelected ? "bg-red-600 border-red-300 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"}`} aria-label="Apagar">
            <Power className="w-8 h-8" />
        </Radio>

        <Radio value="hibernate" className={({
            isSelected
        }) => `w-12 h-12 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${isSelected ? "bg-indigo-600 border-indigo-300 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"}`} aria-label="Hibernar">
            <Moon className="w-8 h-8" />
        </Radio>

        <Radio value="notify" className={({
            isSelected
        }) => `w-12 h-12 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${isSelected ? "bg-amber-600 border-amber-300 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"}`} aria-label="Notificación">
            <Bell className="w-8 h-8" />
        </Radio>
    </RadioGroup>);
}

export default ActionGroup;
