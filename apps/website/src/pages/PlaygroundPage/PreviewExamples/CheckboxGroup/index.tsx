import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { CheckboxGroup } from '@easy-page/pc';
import { Button } from 'antd';

interface CheckboxGroupExampleProps {
	isFormComponent?: boolean;
}

const CheckboxGroupExample: React.FC<CheckboxGroupExampleProps> = ({
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
					<FormItem id="checkboxGroup" label="复选框组">
						<CheckboxGroup
							options={[
								{ label: '选项1', value: 'option1' },
								{ label: '选项2', value: 'option2' },
								{ label: '选项3', value: 'option3' },
							]}
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
			<CheckboxGroup
				options={[
					{ label: '选项1', value: 'option1' },
					{ label: '选项2', value: 'option2' },
					{ label: '选项3', value: 'option3' },
				]}
			/>
		</div>
	);
};

export default CheckboxGroupExample;
