import { CommonComponentProps, baseProps } from './types';

// DatePicker 组件属性 Schema
export interface DatePickerPropsSchema {
	type: 'datePicker';
	properties: CommonComponentProps & {
		format?: string;
		showTime?: boolean;
		allowClear?: boolean;
	};
}

// DateRangePicker 组件属性 Schema
export interface DateRangePickerPropsSchema {
	type: 'dateRangePicker';
	properties: CommonComponentProps & {
		format?: string;
		showTime?: boolean;
		allowClear?: boolean;
	};
}

// TimePicker 组件属性 Schema
export interface TimePickerPropsSchema {
	type: 'timePicker';
	properties: CommonComponentProps & {
		format?: string;
		showNow?: boolean;
		allowClear?: boolean;
	};
}

// DatePicker 默认属性
export const getDefaultDatePickerProps = (): DatePickerPropsSchema => ({
	type: 'datePicker',
	properties: {
		...baseProps,
		format: 'YYYY-MM-DD',
		allowClear: true,
	},
});

// DateRangePicker 默认属性
export const getDefaultDateRangePickerProps =
	(): DateRangePickerPropsSchema => ({
		type: 'dateRangePicker',
		properties: {
			...baseProps,
			format: 'YYYY-MM-DD',
			allowClear: true,
		},
	});

// TimePicker 默认属性
export const getDefaultTimePickerProps = (): TimePickerPropsSchema => ({
	type: 'timePicker',
	properties: {
		...baseProps,
		format: 'HH:mm:ss',
		allowClear: true,
	},
});
