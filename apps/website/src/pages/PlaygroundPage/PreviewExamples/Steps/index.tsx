import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Steps } from '@easy-page/pc';
import { Button } from 'antd';

interface StepsExampleProps {
	isFormComponent?: boolean;
}

const StepsExample: React.FC<StepsExampleProps> = ({
	isFormComponent = true,
}) => {
	const handleSubmit = (values: any) => {
		console.log('提交的数据:', values);
		alert(JSON.stringify(values, null, 2));
	};

	const items = [
		{
			title: '第一步',
			description: '这是第一步的描述',
		},
		{
			title: '第二步',
			description: '这是第二步的描述',
		},
		{
			title: '第三步',
			description: '这是第三步的描述',
		},
	];

	if (isFormComponent) {
		return (
			<div style={{ padding: '16px' }}>
				<Form onSubmit={handleSubmit}>
					<FormItem id="steps" label="步骤条">
						<Steps current={1} items={items} />
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
			<Steps current={1} items={items} />
		</div>
	);
};

export default StepsExample; 