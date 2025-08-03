import React from 'react';
import { Card, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CustomContainerProps } from '@easy-page/core';

// 卡片容器组件
export const CardContainer: React.FC<CustomContainerProps> = ({
	value,
	onAdd,
	onDelete,
	rows,
	canAdd,
	canDelete,
	renderFields,
}) => {
	return (
		<div>
			{value.map((item, index) => {
				return (
					<Card
						key={index}
						title={`表单 ${index + 1}`}
						style={{ marginBottom: '16px' }}
						extra={
							canDelete(index) ? (
								<Button
									type="text"
									danger
									size="small"
									icon={<DeleteOutlined />}
									onClick={() => onDelete(index)}
								>
									删除
								</Button>
							) : null
						}
					>
						<Space direction="vertical" style={{ width: '100%' }}>
							{renderFields(index)}
						</Space>
					</Card>
				);
			})}
			{canAdd && (
				<div style={{ textAlign: 'center' }}>
					<Button type="dashed" icon={<PlusOutlined />} onClick={onAdd}>
						添加表单
					</Button>
				</div>
			)}
		</div>
	);
};
