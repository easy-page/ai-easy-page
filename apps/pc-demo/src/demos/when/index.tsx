import React from 'react';
import { Tabs } from 'antd';
import RadioWhenDemo from './RadioWhenDemo';
import CheckboxWhenDemo from './CheckboxWhenDemo';
import SelectWhenDemo from './SelectWhenDemo';

const WhenDemo: React.FC = () => {
	const items = [
		{
			key: 'radio',
			label: '单选框条件显示',
			children: <RadioWhenDemo />,
		},
		{
			key: 'checkbox',
			label: '多选框条件显示',
			children: <CheckboxWhenDemo />,
		},
		{
			key: 'select',
			label: '下拉框条件显示',
			children: <SelectWhenDemo />,
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<h2>When 组件使用示例</h2>
			<p style={{ marginBottom: 24, color: '#666' }}>
				When 组件用于根据表单字段的值条件性地显示或隐藏其他表单字段。
				以下是几种常见的使用场景：
			</p>
			<Tabs items={items} />
		</div>
	);
};

export default WhenDemo;
