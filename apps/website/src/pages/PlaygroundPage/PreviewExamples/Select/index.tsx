import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Select } from '@easy-page/pc';
import { Button } from 'antd';

interface SelectExampleProps {
	isFormComponent?: boolean;
}

const SelectExample: React.FC<SelectExampleProps> = ({
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
					<FormItem id="select" label="选择器">
						<Select
							placeholder="请选择"
							options={[
								{ value: 'option1', label: '选项1' },
								{ value: 'option2', label: '选项2' },
								{ value: 'option3', label: '选项3' },
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
			<Select
				placeholder="请选择"
				options={[
					{ value: 'option1', label: '选项1' },
					{ value: 'option2', label: '选项2' },
					{ value: 'option3', label: '选项3' },
				]}
			/>
		</div>
	);
};

export default SelectExample;
