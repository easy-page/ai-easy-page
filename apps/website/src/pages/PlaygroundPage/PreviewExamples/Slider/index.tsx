import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Slider } from '@easy-page/pc';
import { Button } from 'antd';

interface SliderExampleProps {
	isFormComponent?: boolean;
}

const SliderExample: React.FC<SliderExampleProps> = ({
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
					<FormItem id="slider" label="滑块">
						<Slider 
							min={0}
							max={100}
							defaultValue={30}
							marks={{
								0: '0',
								20: '20',
								40: '40',
								60: '60',
								80: '80',
								100: '100',
							}}
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
			<Slider 
				min={0}
				max={100}
				defaultValue={30}
				marks={{
					0: '0',
					20: '20',
					40: '40',
					60: '60',
					80: '80',
					100: '100',
				}}
			/>
		</div>
	);
};

export default SliderExample; 