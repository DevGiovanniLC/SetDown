import {
    TimeField,
    Label,
    DateInput,
    DateSegment,
    Text,
    FieldError,
} from 'react-aria-components';
import { parseTime } from '@internationalized/date';
import { useTimerActions, useTimerState } from '../context/TimerContext';

const Timer = () => {
    const { timerValue: value, isRunning } = useTimerState();
    const { handleTimerChange: onChange } = useTimerActions();
    const parsedValue = fillEmptySegments(parseTime(value));

    const handleChange = (newValue: any) => {
        const normalizedValue = fillEmptySegments(newValue).toString();
        onChange(normalizedValue);
    };

    return (
        <TimeField
            aria-label='input-time'
            granularity="second"
            shouldForceLeadingZeros
            value={parsedValue}
            onChange={handleChange}
            className={`timer-display`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
            isReadOnly={isRunning}
        >
            <Label />
            <DateInput className="timer-input-shell">
                {segment => (
                    <span
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



