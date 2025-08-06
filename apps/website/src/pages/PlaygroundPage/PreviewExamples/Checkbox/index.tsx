import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Checkbox } from '@easy-page/pc';
import { Button } from 'antd';

interface CheckboxExampleProps {
	isFormComponent?: boolean;
}

const CheckboxExample: React.FC<CheckboxExampleProps> = ({
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
					<FormItem id="checkbox" label="复选框">
						<Checkbox>同意用户协议</Checkbox>
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
			<Checkbox>同意用户协议</Checkbox>
		</div>
	);
};

export default CheckboxExample;
