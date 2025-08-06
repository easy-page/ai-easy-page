import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Transfer } from '@easy-page/pc';
import { Button } from 'antd';

interface TransferExampleProps {
	isFormComponent?: boolean;
}

const TransferExample: React.FC<TransferExampleProps> = ({
	isFormComponent = true,
}) => {
	const handleSubmit = (values: any) => {
		console.log('提交的数据:', values);
		alert(JSON.stringify(values, null, 2));
	};

	const mockData = Array.from({ length: 20 }).map((_, i) => ({
		key: i.toString(),
		title: `内容${i + 1}`,
		description: `描述${i + 1}`,
		disabled: i % 4 === 0,
	}));

	if (isFormComponent) {
		return (
			<div style={{ padding: '16px' }}>
				<Form onSubmit={handleSubmit}>
					<FormItem id="transfer" label="穿梭框">
						<Transfer
							dataSource={mockData}
							titles={['源列表', '目标列表']}
							targetKeys={[]}
							render={(item) => item.title}
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
			<Transfer
				dataSource={mockData}
				titles={['源列表', '目标列表']}
				targetKeys={[]}
				render={(item) => item.title}
				style={{ width: '100%' }}
			/>
		</div>
	);
};

export default TransferExample; 