import React, { FC, useState, useEffect } from 'react';
import {
	Card,
	Typography,
	Button,
	Space,
	Divider,
	Form,
	Input,
	Select,
	Switch,
	Row,
	Col,
	Tabs,
	Table,
} from 'antd';
import { CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormSchema } from '../../Schema/form';
import {
	ReactNodeProperty,
	FunctionProperty,
	FunctionReactNodeProperty,
} from '../../Schema/specialProperties';
import { ComponentSchema } from '../../Schema/component';
import { ComponentConfigPanelMap, FormItemConfigPanel } from './components';
import FormConfigPanel from './components/FormConfigPanel';
import ReactNodeConfigPanel from './components/ReactNodeConfigPanel';
import FunctionPropertyConfigPanel from './components/FunctionPropertyConfigPanel';
import FunctionReactNodePropertyConfigPanel from './components/FunctionReactNodePropertyConfigPanel';
import ReactNodeArrayConfigPanel from './components/ReactNodeArrayConfigPanel';
import { getDefaultComponentPropsSchema } from '../../Schema/componentSchemas';
import './index.less';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface NodeConfigPanelProps {
	schema: FormSchema | null;
	selectedNode: string | null;
	onPropertyChange: (propertyPath: string, value: any) => void;
	onNodeSelect?: (nodeId: string) => void;
	onExpand?: (expandedKeys: string[]) => void;
	expandedKeys?: string[];
	onClose?: () => void;
	// 新增：用于更新父组件的属性，使其在左侧树中显示为组件节点
	onUpdateParentProperty?: (
		propertyPath: string,
		componentSchema: ComponentSchema
	) => void;
}

interface NodeInfo {
	type:
		| 'form'
		| 'component'
		| 'property'
		| 'array'
		| 'reactNode'
		| 'array-item';
	propertyPath: string;
	componentIndex?: number;
	propName?: string;
	index?: number;
	parentPath?: string;
}

const NodeConfigPanel: FC<NodeConfigPanelProps> = ({
	schema,
	selectedNode,
	onPropertyChange,
	onNodeSelect,
	onExpand,
	expandedKeys = [],
	onClose,
	onUpdateParentProperty,
}) => {
	if (!selectedNode) {
		return (
			<div className="node-config-empty">
				<Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
					请选择一个节点进行配置
				</Text>
			</div>
		);
	}

	// 如果没有schema但有选中的节点，显示基本配置
	if (!schema) {
		return (
			<div
				className="form-properties"
				style={{
					background: 'transparent',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Title level={5} style={{ color: '#fff' }}>
					节点配置
				</Title>
				<Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
					请先创建表单结构以进行详细配置
				</Text>
			</div>
		);
	}

	// 解析节点ID和属性路径
	const parseNodeId = (nodeId: string): NodeInfo | null => {
		const parts = nodeId.split('-');

		// 如果是数组项节点 (如 rows.fields 中的某个字段)
		if (nodeId.includes('-field-')) {
			const fieldIndex = parts.indexOf('field');
			const parentKey = parts.slice(0, fieldIndex).join('-');
			const index = parseInt(parts[fieldIndex + 1]);

			// 解析父节点的属性路径
			const parentParse = parseNodeId(parentKey);
			if (parentParse && parentParse.type === 'array') {
				return {
					type: 'array-item',
					propertyPath: `${parentParse.propertyPath}.${index}`,
					index,
					parentPath: parentParse.propertyPath,
				};
			}
		}

		// 如果是数组项节点 (如 rows 中的某个 row)
		if (nodeId.includes('-item-')) {
			const itemIndex = parts.indexOf('item');
			const parentKey = parts.slice(0, itemIndex).join('-');
			const index = parseInt(parts[itemIndex + 1]);

			// 解析父节点的属性路径
			const parentParse = parseNodeId(parentKey);
			if (parentParse && parentParse.type === 'array') {
				return {
					type: 'array-item',
					propertyPath: `${parentParse.propertyPath}.${index}`,
					index,
					parentPath: parentParse.propertyPath,
				};
			}
		}

		// 如果是ReactNode属性节点
		if (nodeId.includes('-reactnode-')) {
			const reactNodeIndex = parts.indexOf('reactnode');
			const parentKey = parts.slice(0, reactNodeIndex).join('-');
			const index = parseInt(parts[reactNodeIndex + 1]);

			// 解析父节点的属性路径
			const parentParse = parseNodeId(parentKey);
			if (parentParse && parentParse.type === 'property') {
				return {
					type: 'reactNode',
					parentPath: parentParse.propertyPath,
					index,
					propertyPath: `${parentParse.propertyPath}.children.${index}`,
				};
			}
		}

		// 如果是属性节点
		if (nodeId.includes('-prop-')) {
			const propIndex = parts.indexOf('prop');
			const componentIndex = parseInt(parts[1]);
			const propName = parts[propIndex + 1];

			// 检查这个属性是否是直接的组件 schema
			const propertyPath = `properties.children.${componentIndex}.props.${propName}`;

			// 手动获取属性值，避免调用未定义的函数
			const children = schema?.properties?.children || [];
			const parentComponent = children[componentIndex];
			const propertyValue = parentComponent?.props?.[propName];

			// 如果属性值是直接的组件 schema（如 title 属性中的 Input 组件）
			if (
				propertyValue &&
				typeof propertyValue === 'object' &&
				'type' in propertyValue &&
				propertyValue.type !== 'reactNode'
			) {
				return {
					type: 'component',
					componentIndex,
					propName,
					propertyPath: propertyPath,
				};
			}

			return {
				type: 'property',
				componentIndex,
				propName,
				propertyPath: propertyPath,
			};
		}

		// 如果是普通组件节点
		if (nodeId.startsWith('child-')) {
			const componentIndex = parseInt(parts[1]);
			return {
				type: 'component',
				componentIndex,
				propertyPath: `properties.children.${componentIndex}`,
			};
		}

		// 如果是根节点
		if (nodeId === 'form') {
			return {
				type: 'form',
				propertyPath: 'properties',
			};
		}

		return null;
	};

	const nodeInfo = parseNodeId(selectedNode);

	// 获取指定路径的值
	const getValueByPath = (obj: any, path: string): any => {
		const parts = path.split('.');
		let current = obj;
		for (const part of parts) {
			if (current && typeof current === 'object') {
				current = current[part];
			} else {
				return undefined;
			}
		}
		return current;
	};

	// 设置指定路径的值
	const setValueByPath = (obj: any, path: string, value: any): any => {
		const parts = path.split('.');
		const newObj = { ...obj };
		let current = newObj;

		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i];
			if (!(part in current) || typeof current[part] !== 'object') {
				current[part] = {};
			}
			current = current[part];
		}

		current[parts[parts.length - 1]] = value;
		return newObj;
	};

	const renderFormProperties = () => {
		if (selectedNode !== 'form') {
			return null;
		}

		const properties = schema.properties || {};

		return (
			<FormConfigPanel
				properties={properties}
				onPropertyChange={onPropertyChange}
				onNodeSelect={onNodeSelect}
				onExpand={onExpand}
				onUpdateParentProperty={handleUpdateParentProperty}
				componentIndex={nodeInfo?.componentIndex}
			/>
		);
	};

	const renderComponentProperties = () => {
		if (!nodeInfo || nodeInfo.type !== 'component') return null;

		let component: ComponentSchema;

		const children = schema.properties?.children || [];

		// 如果这是属性中的组件（如 title 属性中的 Input 组件）
		if (nodeInfo.propName) {
			const parentComponent = children[nodeInfo.componentIndex!];
			if (!parentComponent || !parentComponent.props) return null;

			const propValue = parentComponent.props[nodeInfo.propName];
			if (!propValue || typeof propValue !== 'object' || !('type' in propValue))
				return null;

			component = propValue as ComponentSchema;
		} else {
			// 这是普通的子组件
			component = children[nodeInfo.componentIndex!];
			if (!component) return null;
		}

		const componentType = component.type;
		const ComponentConfigPanel =
			ComponentConfigPanelMap[
				componentType as keyof typeof ComponentConfigPanelMap
			];

		const handleComponentPropsChange = (newProps: any) => {
			const newChildren = [...children];

			if (nodeInfo.propName) {
				// 更新属性中的组件
				const parentComponent = newChildren[nodeInfo.componentIndex!];
				if (parentComponent && parentComponent.props) {
					const propComponent = parentComponent.props[
						nodeInfo.propName
					] as ComponentSchema;
					if (propComponent) {
						parentComponent.props[nodeInfo.propName] = {
							...propComponent,
							props: newProps,
						};
					}
				}
			} else {
				// 更新普通子组件
				newChildren[nodeInfo.componentIndex!] = {
					...newChildren[nodeInfo.componentIndex!],
					props: newProps,
				};
			}

			onPropertyChange('properties.children', newChildren);
		};

		const handleFormItemPropsChange = (newFormItemProps: any) => {
			const newChildren = [...children];

			if (nodeInfo.propName) {
				// 更新属性中的组件
				const parentComponent = newChildren[nodeInfo.componentIndex!];
				if (parentComponent && parentComponent.props) {
					const propComponent = parentComponent.props[
						nodeInfo.propName
					] as ComponentSchema;
					if (propComponent) {
						parentComponent.props[nodeInfo.propName] = {
							...propComponent,
							formItem: {
								type: 'formItem' as const,
								properties: {
									...propComponent.formItem?.properties,
									...newFormItemProps,
								},
							},
						};
					}
				}
			} else {
				// 更新普通子组件
				newChildren[nodeInfo.componentIndex!] = {
					...newChildren[nodeInfo.componentIndex!],
					formItem: {
						type: 'formItem' as const,
						properties: {
							...newChildren[nodeInfo.componentIndex!].formItem?.properties,
							...newFormItemProps,
						},
					},
				};
			}

			onPropertyChange('properties.children', newChildren);
		};

		// 准备标签页内容
		const tabItems = [];

		// 如果有表单配置，添加表单属性标签页
		if (component.formItem) {
			tabItems.push({
				key: 'formItem',
				label: '表单属性',
				children: (
					<FormItemConfigPanel
						props={component.formItem.properties || {}}
						onChange={handleFormItemPropsChange}
						onNodeSelect={onNodeSelect}
						onExpand={onExpand}
						onUpdateParentProperty={handleUpdateParentProperty}
						componentIndex={nodeInfo.componentIndex}
					/>
				),
			});
		}

		// 如果有组件配置面板，添加组件属性标签页
		if (ComponentConfigPanel) {
			tabItems.push({
				key: 'component',
				label: '组件属性',
				children: (
					<ComponentConfigPanel
						props={component.props || {}}
						onChange={handleComponentPropsChange}
						onNodeSelect={onNodeSelect}
						onExpand={onExpand}
						onUpdateParentProperty={handleUpdateParentProperty}
						componentIndex={nodeInfo.componentIndex}
					/>
				),
			});
		}

		return (
			<div className="component-properties">
				<Tabs
					defaultActiveKey="formItem"
					items={tabItems}
					style={{ color: '#fff' }}
					tabBarStyle={{ color: '#fff' }}
				/>
			</div>
		);
	};

	const renderArrayItemConfig = () => {
		if (!nodeInfo || nodeInfo.type !== 'array-item') return null;

		// 获取当前数组项的值
		const currentValue = getValueByPath(schema, nodeInfo.propertyPath);

		if (!currentValue) return null;

		// 如果是特殊属性类型
		if (
			currentValue &&
			typeof currentValue === 'object' &&
			'type' in currentValue
		) {
			const handlePropertyChange = (newValue: any) => {
				onPropertyChange(nodeInfo.propertyPath, newValue);
			};

			// ReactNodeProperty 类型
			if (currentValue.type === 'reactNode') {
				return (
					<div className="array-item-config">
						<Title level={5} style={{ color: '#fff' }}>
							数组项配置 - ReactNode
						</Title>
						<ReactNodeConfigPanel
							value={currentValue as ReactNodeProperty}
							onChange={handlePropertyChange}
							label="ReactNode 配置"
							onNodeSelect={onNodeSelect}
							onExpand={onExpand}
							onUpdateParentProperty={handleUpdateParentProperty}
							propertyPath={nodeInfo.propertyPath}
							componentIndex={nodeInfo.componentIndex}
						/>
					</div>
				);
			}

			// FunctionProperty 类型
			if (currentValue.type === 'function') {
				return (
					<div className="array-item-config">
						<Title level={5} style={{ color: '#fff' }}>
							数组项配置 - Function
						</Title>
						<FunctionPropertyConfigPanel
							value={currentValue as FunctionProperty}
							onChange={handlePropertyChange}
							label="函数配置"
						/>
					</div>
				);
			}

			// FunctionReactNodeProperty 类型
			if (currentValue.type === 'functionReactNode') {
				return (
					<div className="array-item-config">
						<Title level={5} style={{ color: '#fff' }}>
							数组项配置 - FunctionReactNode
						</Title>
						<FunctionReactNodePropertyConfigPanel
							value={currentValue as FunctionReactNodeProperty}
							onChange={handlePropertyChange}
							label="函数组件配置"
						/>
					</div>
				);
			}

			// 如果是 ComponentSchema 类型
			if (
				currentValue.type &&
				currentValue.type !== 'reactNode' &&
				currentValue.type !== 'function' &&
				currentValue.type !== 'functionReactNode'
			) {
				const componentSchema = currentValue as ComponentSchema;
				return (
					<div className="array-item-config">
						<Title level={5} style={{ color: '#fff' }}>
							组件配置
						</Title>
						<Card
							size="small"
							style={{
								marginBottom: 16,
								background: 'rgba(0, 255, 255, 0.05)',
								border: '1px solid rgba(0, 255, 255, 0.2)',
							}}
						>
							<Space direction="vertical" style={{ width: '100%' }}>
								<Text strong style={{ color: '#fff' }}>
									组件类型: {componentSchema.type}
								</Text>
								<Text
									type="secondary"
									style={{ color: 'rgba(255, 255, 255, 0.6)' }}
								>
									子组件数量: {componentSchema.children?.length || 0}
								</Text>
							</Space>
						</Card>

						<Text
							type="secondary"
							style={{ color: 'rgba(255, 255, 255, 0.6)' }}
						>
							组件属性配置功能正在开发中...
						</Text>
					</div>
				);
			}
		}

		// 如果是对象类型（如 row 对象）
		if (
			currentValue &&
			typeof currentValue === 'object' &&
			!('type' in currentValue)
		) {
			return (
				<div className="array-item-config">
					<Title level={5} style={{ color: '#fff' }}>
						对象配置
					</Title>
					<Form layout="vertical">
						{Object.entries(currentValue).map(([key, value]) => (
							<Form.Item key={key} label={key}>
								{typeof value === 'string' ? (
									<Input
										value={value as string}
										onChange={(e) => {
											const newValue = {
												...currentValue,
												[key]: e.target.value,
											};
											onPropertyChange(nodeInfo.propertyPath, newValue);
										}}
										style={{
											background: 'rgba(255, 255, 255, 0.08)',
											border: '1px solid rgba(0, 255, 255, 0.3)',
											color: '#fff',
										}}
									/>
								) : typeof value === 'number' ? (
									<Input
										type="number"
										value={value as number}
										onChange={(e) => {
											const newValue = {
												...currentValue,
												[key]: Number(e.target.value),
											};
											onPropertyChange(nodeInfo.propertyPath, newValue);
										}}
										style={{
											background: 'rgba(255, 255, 255, 0.08)',
											border: '1px solid rgba(0, 255, 255, 0.3)',
											color: '#fff',
										}}
									/>
								) : (
									<TextArea
										value={JSON.stringify(value, null, 2)}
										onChange={(e) => {
											try {
												const parsedValue = JSON.parse(e.target.value);
												const newValue = {
													...currentValue,
													[key]: parsedValue,
												};
												onPropertyChange(nodeInfo.propertyPath, newValue);
											} catch (error) {
												// 解析错误时不更新
											}
										}}
										rows={3}
										style={{
											background: 'rgba(255, 255, 255, 0.08)',
											border: '1px solid rgba(0, 255, 255, 0.3)',
											color: '#fff',
										}}
									/>
								)}
							</Form.Item>
						))}
					</Form>
				</div>
			);
		}

		// 普通值
		return (
			<div className="array-item-config">
				<Title level={5} style={{ color: '#fff' }}>
					值配置
				</Title>
				<Form layout="vertical">
					<Form.Item label="值">
						<Input
							value={String(currentValue)}
							onChange={(e) => {
								onPropertyChange(nodeInfo.propertyPath, e.target.value);
							}}
							style={{
								background: 'rgba(255, 255, 255, 0.08)',
								border: '1px solid rgba(0, 255, 255, 0.3)',
								color: '#fff',
							}}
						/>
					</Form.Item>
				</Form>
			</div>
		);
	};

	const renderPropertyConfig = () => {
		if (!nodeInfo || nodeInfo.type !== 'property') return null;

		const children = schema.properties?.children || [];
		const component = children[nodeInfo.componentIndex!];
		const propValue = component?.props?.[nodeInfo.propName!];

		// 处理不同类型的属性
		if (propValue && typeof propValue === 'object' && 'type' in propValue) {
			const handlePropertyChange = (newValue: any) => {
				const newChildren = [...children];
				const newComponent = { ...newChildren[nodeInfo.componentIndex!] };
				newComponent.props = {
					...newComponent.props,
					[nodeInfo.propName!]: newValue,
				};
				newChildren[nodeInfo.componentIndex!] = newComponent;
				onPropertyChange('properties.children', newChildren);
			};

			// ReactNodeProperty 类型
			if (propValue.type === 'reactNode') {
				return (
					<div className="property-config">
						<Title level={5} style={{ color: '#fff' }}>
							组件属性配置 - {nodeInfo.propName}
						</Title>
						<ReactNodeConfigPanel
							value={propValue as ReactNodeProperty}
							onChange={handlePropertyChange}
							label={`${nodeInfo.propName} (ReactNode)`}
							onNodeSelect={onNodeSelect}
							onExpand={onExpand}
							onUpdateParentProperty={handleUpdateParentProperty}
							propertyPath={nodeInfo.propName}
							componentIndex={nodeInfo.componentIndex}
						/>
					</div>
				);
			}

			// FunctionProperty 类型
			if (propValue.type === 'function') {
				return (
					<div className="property-config">
						<Title level={5} style={{ color: '#fff' }}>
							组件属性配置 - {nodeInfo.propName}
						</Title>
						<FunctionPropertyConfigPanel
							value={propValue as FunctionProperty}
							onChange={handlePropertyChange}
							label={`${nodeInfo.propName} (Function)`}
						/>
					</div>
				);
			}

			// FunctionReactNodeProperty 类型
			if (propValue.type === 'functionReactNode') {
				return (
					<div className="property-config">
						<Title level={5} style={{ color: '#fff' }}>
							组件属性配置 - {nodeInfo.propName}
						</Title>
						<FunctionReactNodePropertyConfigPanel
							value={propValue as FunctionReactNodeProperty}
							onChange={handlePropertyChange}
							label={`${nodeInfo.propName} (FunctionReactNode)`}
						/>
					</div>
				);
			}

			// ReactNodeProperty[] 数组类型
			if (
				Array.isArray(propValue) &&
				propValue.length > 0 &&
				propValue[0]?.type === 'reactNode'
			) {
				return (
					<div className="property-config">
						<Title level={5} style={{ color: '#fff' }}>
							组件属性配置 - {nodeInfo.propName}
						</Title>
						<ReactNodeArrayConfigPanel
							value={propValue as ReactNodeProperty[]}
							onChange={handlePropertyChange}
							label={`${nodeInfo.propName} (ReactNodeArray)`}
							onNodeSelect={onNodeSelect}
							onExpand={onExpand}
							onUpdateParentProperty={handleUpdateParentProperty}
							componentIndex={nodeInfo.componentIndex}
						/>
					</div>
				);
			}
		}

		// 普通属性 - 不显示
		return null;
	};

	const renderReactNodeConfig = () => {
		if (!nodeInfo || nodeInfo.type !== 'reactNode') return null;

		// 获取ReactNode的值
		const pathParts = nodeInfo.parentPath!.split('.');
		let currentValue = schema;
		for (const part of pathParts) {
			if (currentValue && typeof currentValue === 'object') {
				currentValue = (currentValue as any)[part];
			}
		}

		if (currentValue && Array.isArray((currentValue as any).children)) {
			const reactNodeValue = (currentValue as any).children[nodeInfo.index!];

			if (
				reactNodeValue &&
				typeof reactNodeValue === 'object' &&
				'type' in reactNodeValue
			) {
				const handlePropertyChange = (newValue: any) => {
					onPropertyChange(nodeInfo.propertyPath, newValue);
				};

				// ReactNodeProperty 类型
				if (reactNodeValue.type === 'reactNode') {
					return (
						<div className="reactnode-config">
							<Title level={5} style={{ color: '#fff' }}>
								ReactNode 配置
							</Title>
							<ReactNodeConfigPanel
								value={reactNodeValue as ReactNodeProperty}
								onChange={handlePropertyChange}
								label="ReactNode 配置"
								onNodeSelect={onNodeSelect}
								onExpand={onExpand}
								onUpdateParentProperty={handleUpdateParentProperty}
								propertyPath={nodeInfo.propertyPath}
								componentIndex={nodeInfo.componentIndex}
							/>
						</div>
					);
				}

				// FunctionProperty 类型
				if (reactNodeValue.type === 'function') {
					return (
						<div className="reactnode-config">
							<Title level={5} style={{ color: '#fff' }}>
								函数配置
							</Title>
							<FunctionPropertyConfigPanel
								value={reactNodeValue as FunctionProperty}
								onChange={handlePropertyChange}
								label="函数配置"
							/>
						</div>
					);
				}

				// FunctionReactNodeProperty 类型
				if (reactNodeValue.type === 'functionReactNode') {
					return (
						<div className="reactnode-config">
							<Title level={5} style={{ color: '#fff' }}>
								函数组件配置
							</Title>
							<FunctionReactNodePropertyConfigPanel
								value={reactNodeValue as FunctionReactNodeProperty}
								onChange={handlePropertyChange}
								label="函数组件配置"
							/>
						</div>
					);
				}
			}
		}

		return (
			<div className="reactnode-config">
				<Title level={5} style={{ color: '#fff' }}>
					ReactNode 配置
				</Title>
				<Text type="secondary" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
					无法解析的节点类型
				</Text>
			</div>
		);
	};

	// 同步内部展开状态到外部
	useEffect(() => {
		if (onExpand) {
			onExpand(expandedKeys);
		}
	}, [expandedKeys, onExpand]);

	// 处理更新父组件属性的回调
	const handleUpdateParentProperty = (
		propertyPath: string,
		componentSchema: ComponentSchema
	) => {
		// 这里需要根据当前选中的节点来更新对应的属性
		// 例如：如果当前选中的是容器组件，propertyPath 是 'title'
		// 那么需要将 title 属性从 ReactNodeProperty 更新为 ComponentSchema
		if (nodeInfo && nodeInfo.type === 'component') {
			const children = schema.properties?.children || [];
			const component = children[nodeInfo.componentIndex!];

			if (component) {
				// 更新组件的属性，将 ReactNodeProperty 替换为 ComponentSchema
				const newProps = {
					...component.props,
					[propertyPath]: componentSchema,
				};

				const newChildren = [...children];
				newChildren[nodeInfo.componentIndex!] = {
					...newChildren[nodeInfo.componentIndex!],
					props: newProps,
				};

				// 通知父组件更新
				onPropertyChange('properties.children', newChildren);
			}
		} else if (nodeInfo && nodeInfo.type === 'property') {
			// 如果当前选中的是属性节点，直接更新该属性
			onPropertyChange(nodeInfo.propertyPath, componentSchema);
		}
	};

	return (
		<div className="node-config-panel">
			<div className="config-header">
				<Title level={4} style={{ color: '#fff' }}>
					组件配置
				</Title>
				{onClose && (
					<Button type="text" icon={<CloseOutlined />} onClick={onClose} />
				)}
			</div>

			<div className="config-content">
				{renderFormProperties()}
				{renderComponentProperties()}
				{renderPropertyConfig()}
				{renderArrayItemConfig()}
				{renderReactNodeConfig()}
			</div>
		</div>
	);
};

export default NodeConfigPanel;
