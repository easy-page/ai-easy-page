import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { AutoComplete } from '@easy-page/pc';
import { Button } from 'antd';

interface AutoCompleteExampleProps {
	isFormComponent?: boolean;
}

const AutoCompleteExample: React.FC<AutoCompleteExampleProps> = ({
	isFormComponent = true,
}) => {
	const handleSubmit = (values: any) => {
		console.log('提交的数据:', values);
		alert(JSON.stringify(values, null, 2));
	};

	const options = [
		{ value: 'Burns Bay Road' },
		{ value: 'Downing Street' },
		{ value: 'Wall Street' },
	];

	if (isFormComponent) {
		return (
			<div style={{ padding: '16px' }}>
				<Form onSubmit={handleSubmit}>
					<FormItem id="autoComplete" label="自动完成">
						<AutoComplete
							options={options}
							placeholder="请输入内容"
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
			<AutoComplete
				options={options}
				placeholder="请输入内容"
				style={{ width: '100%' }}
			/>
		</div>
	);
};

export default AutoCompleteExample; 