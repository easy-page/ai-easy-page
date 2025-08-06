import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { TextArea } from '@easy-page/pc';
import { Button } from 'antd';

interface TextAreaExampleProps {
	isFormComponent?: boolean;
}

const TextAreaExample: React.FC<TextAreaExampleProps> = ({
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
					<FormItem id="textarea" label="文本域">
						<TextArea 
							placeholder="请输入多行文本" 
							rows={4}
							showCount
							maxLength={200}
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
			<TextArea 
				placeholder="请输入多行文本" 
				rows={4}
				showCount
				maxLength={200}
			/>
		</div>
	);
};

export default TextAreaExample; 