import React from 'react';
import { Tabs, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CustomContainerProps } from '@easy-page/core';

// Tab容器组件
export const TabContainer: React.FC<CustomContainerProps> = ({
	value,
	onAdd,
	onDelete,
	rows,
	canAdd,
	canDelete,
	renderFields,
}) => {
	const items = value.map((item, index) => {
		return {
			key: index.toString(),
			label: `表单 ${index + 1}`,
			children: (
				<div style={{ padding: '16px 0' }}>
					{renderFields(index, <div style={{ marginBottom: '16px' }} />)}
					{canDelete(index) && (
						<Button
							type="text"
							danger
							icon={<DeleteOutlined />}
							onClick={() => onDelete(index)}
							style={{ marginTop: '8px' }}
						>
							删除
						</Button>
					)}
				</div>
			),
		};
	});

	return (
		<div>
			<Tabs items={items} type="card" />
			{canAdd && (
				<div style={{ textAlign: 'center', marginTop: '16px' }}>
					<Button type="dashed" icon={<PlusOutlined />} onClick={onAdd}>
						添加表单
					</Button>
				</div>
			)}
		</div>
	);
};
