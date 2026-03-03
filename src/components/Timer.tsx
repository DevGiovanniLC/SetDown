import {
    TimeField,
    Label,
    DateInput,
    DateSegment,
    Text,
    FieldError,
} from 'react-aria-components';
import { parseTime } from '@internationalized/date';
import { useEffect, useState } from 'react';

export type TimerStatus = "idle" | "running" | "paused";

interface TimerProps {
    value: string;
    onChange: (value: string) => void;
    timerStatus?: TimerStatus;
}



const Timer = ({ value, onChange, timerStatus = "idle" }: TimerProps) => {
    const [internalValue, setInternalValue] = useState(parseTime('00:00:00'));
    const isRunning = timerStatus === "running";

    const handleChange = (newValue: any) => {
        setInternalValue(fillEmptySegments(newValue));
        onChange(fillEmptySegments(newValue).toString());
    };

    const handleSegmentBlur = () => {
        setInternalValue((prev) => fillEmptySegments(prev));
    };

    useEffect(() => {
        setInternalValue(parseTime(value));
    }, [value]);

    return (
        <TimeField
            aria-label='input-time'
            granularity="second"
            shouldForceLeadingZeros
            value={internalValue}
            onChange={handleChange}
            className={`timer-display`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
            isReadOnly={isRunning}
        >
            <Label />
            <DateInput className="timer-input-shell">
                {segment => (
                    <span
                        onBlur={handleSegmentBlur}
                        onKeyDown={e => {
                            if (e.key === 'Backspace' || e.key === 'Delete') {
                                e.preventDefault();
                            }
                        }}
                    >
                        <DateSegment
                            segment={segment}
                            className={({ isFocused, isPlaceholder }) =>
                                `timer-segment ${isFocused ? 'timer-segment--focused' : ''} ${isPlaceholder ? 'timer-segment--placeholder' : ''}`
                            }
                        />
                    </span>
                )}
            </DateInput>
            <Text slot="description" />
            <FieldError />
        </TimeField>
    );
}


function fillEmptySegments(time: any) {
    const hour = time.hour == null ? '00' : String(time.hour).padStart(2, '0');
    const minute = time.minute == null ? '00' : String(time.minute).padStart(2, '0');
    const second = time.second == null ? '00' : String(time.second).padStart(2, '0');
    return parseTime(`${hour}:${minute}:${second}`);
}

export default Timer;



