
import { TimeField, Label, DateInput, DateSegment, Text, FieldError } from 'react-aria-components';
import { parseTime } from '@internationalized/date';
import { useEffect, useState } from 'react';

interface TimerProps {
    value: string;
    onChange: (value: string) => void;
    isRunning?: boolean;
}

const Timer = ({ value, onChange, isRunning }: TimerProps) => {
    const [internalValue, setInternalValue] = useState(parseTime('00:00:00'));

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
            value={internalValue}
            onChange={handleChange}
            className={'font-semibold text-5xl text-zinc-100'}
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
    );
}


function fillEmptySegments(time: any) {
    const hour = time.hour == null ? '00' : String(time.hour).padStart(2, '0');
    const minute = time.minute == null ? '00' : String(time.minute).padStart(2, '0');
    const second = time.second == null ? '00' : String(time.second).padStart(2, '0');
    return parseTime(`${hour}:${minute}:${second}`);
}

export default Timer;



