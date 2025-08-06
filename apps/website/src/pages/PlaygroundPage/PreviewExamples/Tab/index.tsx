import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Tab } from '@easy-page/pc';
import { Button } from 'antd';

interface TabExampleProps {
	isFormComponent?: boolean;
}

const TabExample: React.FC<TabExampleProps> = ({
	isFormComponent = true,
}) => {
	const handleSubmit = (values: any) => {
		console.log('提交的数据:', values);
		alert(JSON.stringify(values, null, 2));
	};

	const items = [
		{
			key: '1',
			label: '标签页1',
			children: '标签页1的内容',
		},
		{
			key: '2',
			label: '标签页2',
			children: '标签页2的内容',
		},
		{
			key: '3',
			label: '标签页3',
			children: '标签页3的内容',
		},
	];

	if (isFormComponent) {
		return (
			<div style={{ padding: '16px' }}>
				<Form onSubmit={handleSubmit}>
					<FormItem id="tab" label="标签页">
						<Tab items={items} />
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
			<Tab items={items} />
		</div>
	);
};

export default TabExample; 