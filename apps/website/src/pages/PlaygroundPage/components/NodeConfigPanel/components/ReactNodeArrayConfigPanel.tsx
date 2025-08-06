import React, { FC, useState } from 'react';
import { Card, Typography, Button, List, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ReactNodeProperty } from '../../../Schema/specialProperties';
import ReactNodeConfigPanel from './ReactNodeConfigPanel';
import NodeSelectorModal from './NodeSelectorModal';
import { ComponentSchema } from '../../../Schema/component';

const { Title } = Typography;

interface ReactNodeArrayConfigPanelProps {
	value?: ReactNodeProperty[];
	onChange?: (value: ReactNodeProperty[]) => void;
	label?: string;
	onNodeSelect?: (nodeId: string) => void;
	onExpand?: (expandedKeys: string[]) => void;
	onUpdateParentProperty?: (
		propertyPath: string,
		componentSchema: ComponentSchema
	) => void;
	componentIndex?: number; // 当前组件的索引
}

const ReactNodeArrayConfigPanel: FC<ReactNodeArrayConfigPanelProps> = ({
	value = [],
	onChange,
	label = 'React节点数组配置',
	onNodeSelect,
	onExpand,
	onUpdateParentProperty,
	componentIndex,
}) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const handleAddNode = () => {
		setEditingIndex(null);
		setModalVisible(true);
	};

	const handleEditNode = (index: number) => {
		setEditingIndex(index);
		setModalVisible(true);
	};

	const handleDeleteNode = (index: number) => {
		const newValue = [...value];
		newValue.splice(index, 1);
		onChange?.(newValue);
	};

	const handleModalConfirm = (componentSchema: any) => {
		const newValue = [...value];
		if (editingIndex !== null) {
			// 编辑现有节点
			newValue[editingIndex] = {
				type: 'reactNode',
				useSchema: true,
				schema: componentSchema,
			};
		} else {
			// 添加新节点
			newValue.push({
				type: 'reactNode',
				useSchema: true,
				schema: componentSchema,
			});
		}
		onChange?.(newValue);
		setModalVisible(false);
	};

	const handleModalCancel = () => {
		setModalVisible(false);
	};

	const handleNodeChange = (index: number, newValue: ReactNodeProperty) => {
		const newArray = [...value];
		newArray[index] = newValue;
		onChange?.(newArray);
	};

	return (
		<>
			<Card size="small" style={{ marginBottom: 16 }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 8,
					}}
				>
					<Title level={5} style={{ margin: 0 }}>
						{label}
					</Title>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						size="small"
						onClick={handleAddNode}
					>
						添加节点
					</Button>
				</div>

				<List
					size="small"
					dataSource={value}
					renderItem={(item, index) => (
						<List.Item
							style={{
								padding: '8px 0',
								border: '1px solid #d9d9d9',
								borderRadius: 6,
								marginBottom: 8,
								background: 'rgba(255, 255, 255, 0.02)',
							}}
							actions={[
								<Button
									key="edit"
									type="link"
									size="small"
									onClick={() => handleEditNode(index)}
								>
									编辑
								</Button>,
								<Popconfirm
									key="delete"
									title="确定要删除这个节点吗？"
									onConfirm={() => handleDeleteNode(index)}
									okText="确定"
									cancelText="取消"
								>
									<Button
										type="link"
										size="small"
										danger
										icon={<DeleteOutlined />}
									>
										删除
									</Button>
								</Popconfirm>,
							]}
						>
							<List.Item.Meta
								title={
									<div style={{ color: '#fff' }}>
										节点 {index + 1}:{' '}
										{item.useSchema ? item.schema?.type : '字符串模式'}
									</div>
								}
								description={
									<div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
										{item.useSchema
											? `组件类型: ${item.schema?.type}`
											: `内容: ${item.content?.substring(0, 50)}${
													item.content && item.content.length > 50 ? '...' : ''
											  }`}
									</div>
								}
							/>
						</List.Item>
					)}
					locale={{
						emptyText: (
							<div
								style={{
									textAlign: 'center',
									color: 'rgba(255, 255, 255, 0.6)',
								}}
							>
								暂无节点，点击"添加节点"开始配置
							</div>
						),
					}}
				/>

				{value.length > 0 && (
					<div style={{ marginTop: 16 }}>
						<Title level={5} style={{ color: '#fff', marginBottom: 8 }}>
							节点详细配置
						</Title>
						{value.map((item, index) => (
							<div key={index} style={{ marginBottom: 16 }}>
								<ReactNodeConfigPanel
									value={item}
									onChange={(newValue) => handleNodeChange(index, newValue)}
									label={`节点 ${index + 1}`}
									onNodeSelect={onNodeSelect}
									onExpand={onExpand}
									onUpdateParentProperty={onUpdateParentProperty}
									componentIndex={componentIndex}
								/>
							</div>
						))}
					</div>
				)}
			</Card>

			<NodeSelectorModal
				visible={modalVisible}
				onCancel={handleModalCancel}
				onConfirm={handleModalConfirm}
				title={editingIndex !== null ? '编辑节点组件' : '选择新节点组件'}
			/>
		</>
	);
};

export default ReactNodeArrayConfigPanel;
