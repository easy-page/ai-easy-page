import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { TimePicker } from '@easy-page/pc';
import { Button } from 'antd';

interface TimePickerExampleProps {
	isFormComponent?: boolean;
}

const TimePickerExample: React.FC<TimePickerExampleProps> = ({
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
					<FormItem id="timePicker" label="时间选择器">
						<TimePicker 
							placeholder="请选择时间"
							style={{ width: '100%' }}
						/>
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
			<TimePicker 
				placeholder="请选择时间"
				style={{ width: '100%' }}
			/>
		</div>
	);
};

export default TimePickerExample; 