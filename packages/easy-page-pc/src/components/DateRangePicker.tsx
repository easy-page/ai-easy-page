import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { FieldValue } from '@easy-page/core';

const { RangePicker } = DatePicker;

export interface DateRangePickerProps {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
	placeholder?: [string, string];
	disabled?: boolean;
	style?: React.CSSProperties;
	className?: string;
	showTime?: boolean;
	format?: string;
	allowClear?: boolean;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
	value,
	onChange,
	placeholder = ['开始日期', '结束日期'],
	showTime = false,
	format = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
	allowClear = true,
	...props
}) => {
	// 将字符串数组转换为 dayjs 对象数组
	const dayjsValue =
		value && Array.isArray(value)
			? [
					value[0] ? dayjs(value[0] as string) : null,
					value[1] ? dayjs(value[1] as string) : null,
			  ]
			: null;

	const handleChange = (dates: any, dateStrings: [string, string]) => {
		onChange?.(dateStrings);
	};

	return (
		<RangePicker
			value={dayjsValue as any}
			onChange={handleChange}
			placeholder={placeholder}
			showTime={showTime}
			format={format}
			allowClear={allowClear}
			style={{ minWidth: 300, ...props.style }}
			{...props}
		/>
	);
};
