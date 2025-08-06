import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { InputNumber } from '@easy-page/pc';
import { Button } from 'antd';

interface InputNumberExampleProps {
	isFormComponent?: boolean;
}

const InputNumberExample: React.FC<InputNumberExampleProps> = ({
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
					<FormItem id="inputNumber" label="数字输入框">
						<InputNumber 
							placeholder="请输入数字"
							min={0}
							max={100}
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
			<InputNumber 
				placeholder="请输入数字"
				min={0}
				max={100}
				style={{ width: '100%' }}
			/>
		</div>
	);
};

export default InputNumberExample; 