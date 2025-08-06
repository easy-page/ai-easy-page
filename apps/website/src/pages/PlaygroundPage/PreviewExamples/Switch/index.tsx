import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Switch } from '@easy-page/pc';
import { Button } from 'antd';

interface SwitchExampleProps {
	isFormComponent?: boolean;
}

const SwitchExample: React.FC<SwitchExampleProps> = ({
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
					<FormItem id="switch" label="开关">
						<Switch 
							checkedChildren="开启" 
							unCheckedChildren="关闭"
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
			<Switch 
				checkedChildren="开启" 
				unCheckedChildren="关闭"
			/>
		</div>
	);
};

export default SwitchExample; 