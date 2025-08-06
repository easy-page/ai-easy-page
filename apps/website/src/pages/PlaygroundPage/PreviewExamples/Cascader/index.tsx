import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Cascader } from '@easy-page/pc';
import { Button } from 'antd';

interface CascaderExampleProps {
	isFormComponent?: boolean;
}

const CascaderExample: React.FC<CascaderExampleProps> = ({
	isFormComponent = true,
}) => {
	const handleSubmit = (values: any) => {
		console.log('提交的数据:', values);
		alert(JSON.stringify(values, null, 2));
	};

	const options = [
		{
			value: 'zhejiang',
			label: '浙江',
			children: [
				{
					value: 'hangzhou',
					label: '杭州',
					children: [
						{
							value: 'xihu',
							label: '西湖',
						},
					],
				},
			],
		},
		{
			value: 'jiangsu',
			label: '江苏',
			children: [
				{
					value: 'nanjing',
					label: '南京',
					children: [
						{
							value: 'zhonghuamen',
							label: '中华门',
						},
					],
				},
			],
		},
	];

	if (isFormComponent) {
		return (
			<div style={{ padding: '16px' }}>
				<Form onSubmit={handleSubmit}>
					<FormItem id="cascader" label="级联选择器">
						<Cascader
							options={options}
							placeholder="请选择地区"
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
			<Cascader
				options={options}
				placeholder="请选择地区"
				style={{ width: '100%' }}
			/>
		</div>
	);
};

export default CascaderExample; 