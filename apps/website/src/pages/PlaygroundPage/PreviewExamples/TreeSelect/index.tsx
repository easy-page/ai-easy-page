import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { TreeSelect } from '@easy-page/pc';
import { Button } from 'antd';

interface TreeSelectExampleProps {
	isFormComponent?: boolean;
}

const TreeSelectExample: React.FC<TreeSelectExampleProps> = ({
	isFormComponent = true,
}) => {
	const handleSubmit = (values: any) => {
		console.log('提交的数据:', values);
		alert(JSON.stringify(values, null, 2));
	};

	const treeData = [
		{
			title: '父节点1',
			value: 'parent1',
			children: [
				{
					title: '子节点1-1',
					value: 'child1-1',
				},
				{
					title: '子节点1-2',
					value: 'child1-2',
				},
			],
		},
		{
			title: '父节点2',
			value: 'parent2',
			children: [
				{
					title: '子节点2-1',
					value: 'child2-1',
				},
				{
					title: '子节点2-2',
					value: 'child2-2',
				},
			],
		},
	];

	if (isFormComponent) {
		return (
			<div style={{ padding: '16px' }}>
				<Form onSubmit={handleSubmit}>
					<FormItem id="treeSelect" label="树选择器">
						<TreeSelect
							treeData={treeData}
							placeholder="请选择节点"
							style={{ width: '100%' }}
							treeDefaultExpandAll
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
			<TreeSelect
				treeData={treeData}
				placeholder="请选择节点"
				style={{ width: '100%' }}
				treeDefaultExpandAll
			/>
		</div>
	);
};

export default TreeSelectExample; 