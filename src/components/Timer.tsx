
import {
    TimeField,
    Label,
    DateInput,
    DateSegment,
    Text,
    FieldError,
    Button,
    MenuTrigger,
    Popover,
    Menu,
    MenuItem,
} from 'react-aria-components';
import { parseTime } from '@internationalized/date';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface TimerProps {
    value: string;
    onChange: (value: string) => void;
    isRunning?: boolean;
}

const Timer = ({ value, onChange, isRunning }: TimerProps) => {
    const [internalValue, setInternalValue] = useState(parseTime('00:00:00'));
    const presets = [
        { label: '10 min', value: '00:10:00' },
        { label: '30 min', value: '00:30:00' },
        { label: '45 min', value: '00:45:00' },
        { label: '1 hour', value: '01:00:00' },
        { label: '1.5 hours', value: '01:30:00' },
        { label: '2 hours', value: '02:00:00' },
    ];

    const handleChange = (newValue: any) => {
        setInternalValue(fillEmptySegments(newValue));
        onChange(fillEmptySegments(newValue).toString());
    };

    const handlePresetSelect = (presetValue: string) => {
        const parsed = parseTime(presetValue);
        setInternalValue(parsed);
        onChange(parsed.toString());
    };

    const handleSegmentBlur = () => {
        setInternalValue((prev) => fillEmptySegments(prev));
    };

    useEffect(() => {
        setInternalValue(parseTime(value));
    }, [value]);

    return (
        <div className="flex items-center gap-2 ml-10">
            <TimeField
                aria-label='input-time'
                granularity="second"
                shouldForceLeadingZeros
                value={internalValue}
                onChange={handleChange}
                className={'font-semibold text-6xl text-zinc-100 font-mono bg-transparent border-none focus:ring-0'}
                style={{ fontVariantNumeric: 'tabular-nums' }}
                isReadOnly={isRunning}
            >
                <Label />
                <DateInput>
                    {segment => (
                        <span
                            onBlur={handleSegmentBlur}
                            onKeyDown={e => {
                                if (e.key === 'Backspace' || e.key === 'Delete') {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <DateSegment segment={segment} />
                        </span>
                    )}
                </DateInput>
                <Text slot="description" />
                <FieldError />
            </TimeField>

            <MenuTrigger>
                <Button
                    aria-label="Abrir presets"
                    isDisabled={isRunning}
                    className="w-9 h-9 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-100 flex items-center justify-center disabled:opacity-50"
                >
                    <ChevronDown className="w-5 h-5" />
                </Button>
                <Popover className="bg-zinc-900 border border-zinc-700 rounded-md shadow-lg p-1">
                    <Menu className="outline-none">
                        {presets.map((preset) => (
                            <MenuItem
                                key={preset.value}
                                id={preset.value}
                                textValue={preset.label}
                                onAction={() => handlePresetSelect(preset.value)}
                                className="px-2 py-1  text-zinc-100 rounded cursor-pointer hover:bg-zinc-800"
                            >
                                {preset.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Popover>
            </MenuTrigger>
        </div>
    );
}


function fillEmptySegments(time: any) {
    const hour = time.hour == null ? '00' : String(time.hour).padStart(2, '0');
    const minute = time.minute == null ? '00' : String(time.minute).padStart(2, '0');
    const second = time.second == null ? '00' : String(time.second).padStart(2, '0');
    return parseTime(`${hour}:${minute}:${second}`);
}

export default Timer;



