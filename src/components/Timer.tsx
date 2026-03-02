
import { TimeField, Label, DateInput, DateSegment, Text, FieldError } from 'react-aria-components';
import { parseTime } from '@internationalized/date';
import { useState } from 'react';


function fillEmptySegments(time: any) {
    const hour = time.hour == null ? '00' : String(time.hour).padStart(2, '0');
    const minute = time.minute == null ? '00' : String(time.minute).padStart(2, '0');
    const second = time.second == null ? '00' : String(time.second).padStart(2, '0');
    return parseTime(`${hour}:${minute}:${second}`);
}

const Timer = () => {
    const [value, setValue] = useState(parseTime('00:00:00'));

    const handleChange = (newValue: any) => {
        setValue(fillEmptySegments(newValue));
    };

    const handleSegmentBlur = () => {
        setValue((prev) => fillEmptySegments(prev));
    };

    return (
        <TimeField
            aria-label='input-time'
            granularity="second"
            value={value}
            onChange={handleChange}
            className={'font-semibold text-5xl text-zinc-100'}>
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

export default Timer;



