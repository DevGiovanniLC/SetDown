import { parseTime, type Time } from "@internationalized/date";
import {
	DateInput,
	DateSegment,
	FieldError,
	Label,
	Text,
	TimeField,
} from "react-aria-components";
import { useTimerActions, useTimerState } from "../context/TimerContext";

const Timer = () => {
	const { timerValue: value, isRunning } = useTimerState();
	const { handleTimerChange: onChange } = useTimerActions();
	const parsedValue = fillEmptySegments(parseTime(value));

	const handleChange = (newValue: Time | null) => {
		if (newValue == null) return;
		const normalizedValue = fillEmptySegments(newValue).toString();
		onChange(normalizedValue);
	};

	return (
		<TimeField
			aria-label="input-time"
			granularity="second"
			shouldForceLeadingZeros
			value={parsedValue}
			onChange={handleChange}
			className="border-none bg-transparent outline-none"
			isReadOnly={isRunning}
		>
			<Label />
			<DateInput
				className={`rounded-2xl px-3 py-2 font-mono text-5xl font-semibold tracking-tight transition-all duration-300 ${isRunning ? "text-emerald-200" : "text-zinc-100"}`}
				style={{ textShadow: "0 0 28px rgba(255, 255, 255, 0.06)" }}
			>
				{(segment) => (
					<span key={segment.type}>
						<DateSegment
							segment={segment}
							className={({ isFocused, isPlaceholder }) =>
								`rounded-md px-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 ${isFocused ? "bg-purple-500/20 text-blue-100" : ""} ${isPlaceholder ? "text-zinc-500" : ""}`
							}
						/>
					</span>
				)}
			</DateInput>
			<Text slot="description" />
			<FieldError />
		</TimeField>
	);
};

function fillEmptySegments(time: Time): Time {
	const hour = time.hour == null ? "00" : String(time.hour).padStart(2, "0");
	const minute =
		time.minute == null ? "00" : String(time.minute).padStart(2, "0");
	const second =
		time.second == null ? "00" : String(time.second).padStart(2, "0");
	return parseTime(`${hour}:${minute}:${second}`);
}

export default Timer;
