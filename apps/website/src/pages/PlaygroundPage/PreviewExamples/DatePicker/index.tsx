import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { DatePicker } from '@easy-page/pc';
import { Button } from 'antd';

interface DatePickerExampleProps {
	isFormComponent?: boolean;
}

const DatePickerExample: React.FC<DatePickerExampleProps> = ({
	isFormComponent = true,
}) => {
	const handleSubmit = (values: any) => {
		console.log('提交的数据:', values);
		alert(JSON.stringify(values, null, 2));
	};

	if (isFormComponent) {
		return (
			<div style={{ padding: '16px' }}>
				<Form onSubmit={handleSubmit}>
					<FormItem id="datePicker" label="日期选择器">
						<DatePicker placeholder="请选择日期" style={{ width: '100%' }} />
					</FormItem>
					<FormItem id="submit">
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</FormItem>
				</Form>
			</div>
		);
	}

	return (
		<div style={{ padding: '16px' }}>
			<DatePicker placeholder="请选择日期" style={{ width: '100%' }} />
		</div>
	);
};

export default DatePickerExample;
