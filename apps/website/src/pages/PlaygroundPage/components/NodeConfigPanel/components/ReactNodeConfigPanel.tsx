import React, { FC, useState } from 'react';
import { Card, Typography, Button, Space, Switch, Form } from 'antd';
import {
	RobotOutlined,
	PlusOutlined,
	EditOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { ReactNodeProperty } from '../../../Schema/specialProperties';
import { ComponentSchema } from '../../../Schema/component';
import MonacoEditor from '../../ConfigBuilder/components/FormMode/MonacoEditor';
import AddComponentModal from '../../ConfigBuilder/components/FormMode/AddComponentModal';

import { getDefaultComponentPropsSchema } from '../../../Schema/componentSchemas';
import {
	ComponentDisplayNames,
	ComponentType,
} from '../../ConfigBuilder/components/FormMode/types';

const { Title, Text } = Typography;

interface ReactNodeConfigPanelProps {
	value?: ReactNodeProperty;
	onChange?: (value: ReactNodeProperty) => void;
	label?: string;
	placeholder?: string;
	onNodeSelect?: (nodeId: string) => void;
	onExpand?: (expandedKeys: string[]) => void;
	// 新增：用于更新父组件的属性，使其在左侧树中显示为组件节点
	onUpdateParentProperty?: (
		propertyPath: string,
		componentSchema: ComponentSchema
	) => void;
	propertyPath?: string; // 当前属性的路径，如 'title', 'loadingComponent' 等
	componentIndex?: number; // 当前组件的索引，用于生成正确的节点ID
}

const ReactNodeConfigPanel: FC<ReactNodeConfigPanelProps> = ({
	value,
	onChange,
	label = 'React节点配置',
	placeholder = '请输入React节点代码',
	onNodeSelect,
	onExpand,
	onUpdateParentProperty,
	propertyPath,
	componentIndex,
}) => {
	const [isSchemaMode, setIsSchemaMode] = useState(value?.useSchema || false);
	const [showAddModal, setShowAddModal] = useState(false);

	const handleStringModeChange = (content: string) => {
		onChange?.({
			type: 'reactNode',
			content,
			useSchema: false,
		});
	};

	const handleSchemaModeChange = (schema: ComponentSchema) => {
		onChange?.({
			type: 'reactNode',
			useSchema: true,
			schema,
		});
	};

	const handleModeSwitch = (checked: boolean) => {
		setIsSchemaMode(checked);
		if (checked) {
			// 切换到节点模式时，清空字符串内容
			onChange?.({
				type: 'reactNode',
				useSchema: true,
				schema: value?.schema,
			});
		} else {
			// 切换到字符串模式时，保留字符串内容
			onChange?.({
				type: 'reactNode',
				content: value?.content,
				useSchema: false,
			});
		}
	};

	const handleAIAssist = () => {
		// TODO: 实现AI编辑功能
		console.log('AI编辑功能待实现');
	};

	const handleAddComponent = (
		componentType: ComponentType,
		isFormComponent: boolean
	) => {
		// 创建新的组件schema
		const newComponent: ComponentSchema = {
			type: componentType,
			properties: getDefaultComponentPropsSchema(componentType)
				.properties as Record<string, any>,
			formItem: isFormComponent
				? {
						type: 'formItem' as const,
						properties: {
							id: `${componentType}-${Date.now()}`,
							label: ComponentDisplayNames[componentType],
							required: false,
							labelLayout: 'vertical' as const,
						},
				  }
				: undefined,
		};

		// 更新ReactNode配置
		handleSchemaModeChange(newComponent);

		// 如果提供了 onUpdateParentProperty 和 propertyPath，则更新父组件属性
		if (onUpdateParentProperty && propertyPath) {
			onUpdateParentProperty(propertyPath, newComponent);
		}

		// 关闭弹窗
		setShowAddModal(false);

		// 自动选中新创建的节点并展开到该节点
		if (propertyPath) {
			// 如果 propertyPath 是完整路径（如 properties.children.0.properties.title）
			const pathParts = propertyPath.split('.');
			if (
				pathParts.length >= 4 &&
				pathParts[0] === 'properties' &&
				pathParts[1] === 'children'
			) {
				const componentIndex = parseInt(pathParts[2]);
				const propName = pathParts[4];
				const newNodeId = `${componentIndex}-prop-${propName}`;
				onNodeSelect?.(newNodeId);
				onExpand?.(['form']);
			} else if (componentIndex !== undefined) {
				// 如果 propertyPath 只是属性名（如 'title'），使用 componentIndex
				const newNodeId = `${componentIndex}-prop-${propertyPath}`;
				onNodeSelect?.(newNodeId);
				onExpand?.(['form']);
			} else {
				console.log('需要从父组件获取组件索引信息');
			}
		}

		console.log('添加组件到ReactNode:', newComponent);
	};

	const handleAddNode = () => {
		setShowAddModal(true);
	};

	// 处理查看节点按钮点击
	const handleViewNode = () => {
		if (value?.schema && propertyPath) {
			// 如果 propertyPath 是完整路径（如 properties.children.0.properties.title）
			const pathParts = propertyPath.split('.');
			if (
				pathParts.length >= 4 &&
				pathParts[0] === 'properties' &&
				pathParts[1] === 'children'
			) {
				const componentIndex = parseInt(pathParts[2]);
				const propName = pathParts[4];
				const nodeId = `${componentIndex}-prop-${propName}`;
				onNodeSelect?.(nodeId);
				onExpand?.(['form']);
			} else if (componentIndex !== undefined) {
				// 如果 propertyPath 只是属性名（如 'title'），使用 componentIndex
				const nodeId = `${componentIndex}-prop-${propertyPath}`;
				onNodeSelect?.(nodeId);
				onExpand?.(['form']);
			} else {
				console.log('需要从父组件获取组件索引信息');
			}
		}
	};

	return (
		<>
			<Card
				size="small"
				style={{
					marginBottom: 16,
					background: 'rgba(255, 255, 255, 0.02)',
					border: '1px solid rgba(0, 255, 255, 0.2)',
					borderRadius: '8px',
				}}
				bodyStyle={{ padding: '16px' }}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: '12px',
						marginBottom: '12px',
					}}
				>
					<Switch
						checked={isSchemaMode}
						onChange={handleModeSwitch}
						checkedChildren="节点"
						unCheckedChildren="字符串"
						size="default"
						style={{
							backgroundColor: isSchemaMode
								? 'rgba(0, 255, 255, 0.3)'
								: 'rgba(255, 255, 255, 0.2)',
							height: '24px',
							minWidth: '44px',
						}}
					/>
					{!isSchemaMode && (
						<Button
							type="primary"
							icon={<RobotOutlined />}
							size="small"
							onClick={handleAIAssist}
							style={{
								background: 'linear-gradient(135deg, #00d4aa 0%, #00b4d8 100%)',
								border: 'none',
								borderRadius: '6px',
								height: '32px',
								padding: '0 12px',
								fontSize: '12px',
								fontWeight: 500,
								boxShadow: '0 2px 4px rgba(0, 212, 170, 0.3)',
							}}
						>
							AI编辑
						</Button>
					)}
				</div>

				{!isSchemaMode ? (
					<div style={{ position: 'relative' }}>
						<MonacoEditor
							value={value?.content || ''}
							onChange={handleStringModeChange}
							language="javascript"
							height="200px"
						/>
						<div
							style={{
								position: 'absolute',
								top: '8px',
								right: '8px',
								background: 'rgba(0, 0, 0, 0.6)',
								padding: '2px 6px',
								borderRadius: '4px',
								fontSize: '10px',
								color: 'rgba(255, 255, 255, 0.6)',
								fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
							}}
						>
							JS
						</div>
					</div>
				) : (
					<div>
						{value?.schema ? (
							<div
								style={{
									padding: '16px',
									border: '1px solid rgba(0, 255, 255, 0.3)',
									borderRadius: '8px',
									background: 'rgba(0, 255, 255, 0.05)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Button
									type="text"
									icon={<EyeOutlined />}
									size="small"
									onClick={handleViewNode}
									style={{
										color: 'rgba(0, 255, 255, 0.8)',
										border: '1px solid rgba(0, 255, 255, 0.3)',
										borderRadius: '6px',
										height: '32px',
										padding: '0 16px',
										fontSize: '12px',
										background: 'rgba(0, 255, 255, 0.05)',
									}}
								>
									查看节点配置
								</Button>
							</div>
						) : (
							<Button
								type="dashed"
								onClick={handleAddNode}
								style={{
									width: '100%',
									height: '60px',
									border: '2px dashed rgba(0, 255, 255, 0.4)',
									borderRadius: '8px',
									background: 'rgba(0, 255, 255, 0.02)',
									color: 'rgba(0, 255, 255, 0.8)',
									fontSize: '14px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '8px',
									transition: 'all 0.3s ease',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.6)';
									e.currentTarget.style.background = 'rgba(0, 255, 255, 0.05)';
									e.currentTarget.style.color = 'rgba(0, 255, 255, 1)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.4)';
									e.currentTarget.style.background = 'rgba(0, 255, 255, 0.02)';
									e.currentTarget.style.color = 'rgba(0, 255, 255, 0.8)';
								}}
							>
								<PlusOutlined style={{ fontSize: '16px' }} />
								添加节点
							</Button>
						)}
					</div>
				)}
			</Card>

			<AddComponentModal
				visible={showAddModal}
				onCancel={() => setShowAddModal(false)}
				onOk={handleAddComponent}
				defaultIsFormComponent={true}
			/>
		</>
	);
};

export default ReactNodeConfigPanel;
