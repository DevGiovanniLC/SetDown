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
            <Button
                aria-label="Open timer presets"
                isDisabled={props.isRunning}
                className="h-8 w-8 rounded-xl border border-zinc-500/40 bg-zinc-800/80 hover:bg-zinc-700/90 text-zinc-100 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-45 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:ring-zinc-200"
            >
                <ChevronDown className="w-4 h-4" />
            </Button>
            <Popover className="rounded-xl border border-zinc-700/80 bg-zinc-900/95 shadow-2xl p-1.5 backdrop-blur-md animate-[card-in_200ms_ease-out]">
                <Menu className="outline-none">
                    {presets.map(preset => <MenuItem key={preset.value} id={preset.value} textValue={preset.label} onAction={() => props.handlePresetSelect(preset.value)} className={({ isFocused }) => `px-3 py-2 text-sm text-zinc-100 rounded-lg cursor-pointer transition-colors duration-150 ${isFocused ? 'bg-zinc-800' : 'hover:bg-zinc-800'}`}>
                        {preset.label}
                    </MenuItem>)}
                </Menu>
            </Popover>
        </MenuTrigger>
    );
}

export default TimerSelector;