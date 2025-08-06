import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Radio } from '@easy-page/pc';
import { Button } from 'antd';

interface RadioExampleProps {
	isFormComponent?: boolean;
}

const RadioExample: React.FC<RadioExampleProps> = ({
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
					<FormItem id="radio" label="单选框">
						<Radio>选项1</Radio>
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
			<Radio>选项1</Radio>
		</div>
	);
};

export default RadioExample;
