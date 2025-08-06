import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { RadioGroup } from '@easy-page/pc';
import { Button } from 'antd';

interface RadioGroupExampleProps {
	isFormComponent?: boolean;
}

const RadioGroupExample: React.FC<RadioGroupExampleProps> = ({
	isFormComponent = true,
}) => {
	const handleSubmit = (values: any) => {
		console.log('提交的数据:', values);
		alert(JSON.stringify(values, null, 2));
	};

	const options = [
		{ label: '选项1', value: '1' },
		{ label: '选项2', value: '2' },
		{ label: '选项3', value: '3' },
	];

	if (isFormComponent) {
		return (
			<div style={{ padding: '16px' }}>
				<Form onSubmit={handleSubmit}>
					<FormItem id="radioGroup" label="单选组">
						<RadioGroup options={options} />
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
			<RadioGroup options={options} />
		</div>
	);
};

export default RadioGroupExample; 