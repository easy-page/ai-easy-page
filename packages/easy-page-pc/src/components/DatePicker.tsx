import React from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FieldValue } from '@easy-page/core';

export interface DatePickerProps {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
	placeholder?: string;
	disabled?: boolean;
	style?: React.CSSProperties;
	className?: string;
	showTime?: boolean;
	format?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
	value,
	onChange,
	showTime = false,
	format = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
	...props
}) => {
	// 将字符串转换为 dayjs 对象
	const dayjsValue = value ? dayjs(value as string) : null;

	const handleChange = (date: Dayjs | null, dateString: string | string[]) => {
		onChange?.(
			Array.isArray(dateString) ? dateString[0] || '' : dateString || ''
		);
	};

	return (
		<AntDatePicker
			value={dayjsValue}
			onChange={handleChange}
			showTime={showTime}
			format={format}
			style={{ minWidth: 200, ...props.style }}
			{...props}
		/>
	);
};
