import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Input } from '@easy-page/pc';
import { Button } from 'antd';

interface InputExampleProps {
	isFormComponent?: boolean;
}

const InputExample: React.FC<InputExampleProps> = ({
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
					<FormItem id="input" label="输入框">
						<Input placeholder="请输入内容" />
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
			<Input placeholder="请输入内容" />
		</div>
	);
};

export default InputExample;
