import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Rate } from '@easy-page/pc';
import { Button } from 'antd';

interface RateExampleProps {
	isFormComponent?: boolean;
}

const RateExample: React.FC<RateExampleProps> = ({
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
					<FormItem id="rate" label="评分">
						<Rate 
							defaultValue={3}
							allowHalf
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
			<Rate 
				defaultValue={3}
				allowHalf
			/>
		</div>
	);
};

export default RateExample; 