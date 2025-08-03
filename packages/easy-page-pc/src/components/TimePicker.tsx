import React from 'react';
import { TimePicker as AntTimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FieldValue } from '@easy-page/core';

export interface TimePickerProps {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
	placeholder?: string;
	disabled?: boolean;
	style?: React.CSSProperties;
	className?: string;
	format?: string;
	showNow?: boolean;
	use12Hours?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
	value,
	onChange,
	placeholder = '请选择时间',
	format = 'HH:mm:ss',
	showNow = true,
	use12Hours = false,
	...props
}) => {
	// 将字符串转换为 dayjs 对象
	const dayjsValue = value ? dayjs(value as string, format) : null;

	const handleChange = (time: Dayjs | null, timeString: string | string[]) => {
		onChange?.(
			Array.isArray(timeString) ? timeString[0] || '' : timeString || ''
		);
	};

	return (
		<AntTimePicker
			value={dayjsValue}
			onChange={handleChange}
			placeholder={placeholder}
			format={format}
			showNow={showNow}
			use12Hours={use12Hours}
			style={{ minWidth: 150, ...props.style }}
			{...props}
		/>
	);
};
