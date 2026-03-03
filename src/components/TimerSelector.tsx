import { ChevronDown } from "lucide-react";
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

interface TimerSelectorProp {
    isRunning: boolean | undefined;
    handlePresetSelect: (arg0: string) => void;
}

function TimerSelector(props: TimerSelectorProp) {

    const presets = [
        { label: '10 min', value: '00:10:00' },
        { label: '30 min', value: '00:30:00' },
        { label: '45 min', value: '00:45:00' },
        { label: '1 hour', value: '01:00:00' },
        { label: '1.5 hours', value: '01:30:00' },
        { label: '2 hours', value: '02:00:00' },
    ];

    return (
        <MenuTrigger>
            <Button aria-label="Abrir presets" isDisabled={props.isRunning} className="w-9 h-9 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100 flex items-center justify-center disabled:opacity-50">
                <ChevronDown className="w-5 h-5" />
            </Button>
            <Popover className="bg-zinc-900 border border-zinc-700 rounded-md shadow-lg p-1">
                <Menu className="outline-none">
                    {presets.map(preset => <MenuItem key={preset.value} id={preset.value} textValue={preset.label} onAction={() => props.handlePresetSelect(preset.value)} className="px-2 py-1  text-zinc-100 rounded cursor-pointer hover:bg-zinc-800">
                        {preset.label}
                    </MenuItem>)}
                </Menu>
            </Popover>
        </MenuTrigger>
    );
}

export default TimerSelector;