import { FC } from 'react';
import {
	Form,
	Input,
	Select,
	Button,
	Typography,
	Divider,
	Row,
	Col,
	Tabs,
	Card,
	Space,
	Table,
} from 'antd';
import { CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormSchema, ComponentSchema } from '../../Schema';
import { ReactNodeProperty } from '../../Schema/specialProperties';
import { ComponentConfigPanelMap, FormItemConfigPanel } from './components';
import FormConfigPanel from './components/FormConfigPanel';
import { getDefaultComponentPropsSchema } from '../../Schema/componentSchemas';
import './index.less';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface NodeConfigPanelProps {
	schema: FormSchema | null;
	selectedNode: string | null;
	onPropertyChange: (propertyPath: string, value: any) => void;
	onNodeSelect?: (nodeId: string) => void;
	onExpand?: (expandedKeys: string[]) => void;
	expandedKeys?: string[];
	onClose?: () => void;
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
}) => {
	console.log('NodeConfigPanel render:', { schema, selectedNode, onClose });

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
			return {
				type: 'property',
				componentIndex,
				propName,
				propertyPath: `properties.children.${componentIndex}.props.${propName}`,
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
			/>
		);
	};

	const renderComponentProperties = () => {
		if (!nodeInfo || nodeInfo.type !== 'component') return null;

		const children = schema.properties?.children || [];
		const component = children[nodeInfo.componentIndex!];

		if (!component) return null;

		const componentType = component.type;
		const ComponentConfigPanel =
			ComponentConfigPanelMap[
				componentType as keyof typeof ComponentConfigPanelMap
			];

		const handleComponentPropsChange = (newProps: any) => {
			const newChildren = [...children];
			newChildren[nodeInfo.componentIndex!] = {
				...newChildren[nodeInfo.componentIndex!],
				props: newProps,
			};
			onPropertyChange('properties.children', newChildren);
		};

		const handleFormItemPropsChange = (newFormItemProps: any) => {
			const newChildren = [...children];
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
			onPropertyChange('properties.children', newChildren);
		};

		return (
			<div className="component-properties">
				<Title level={5} style={{ color: '#fff' }}>
					组件配置
				</Title>
				{ComponentConfigPanel && (
					<ComponentConfigPanel
						props={component.props || {}}
						onChange={handleComponentPropsChange}
					/>
				)}

				{component.formItem && (
					<>
						<Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
						<FormItemConfigPanel
							props={component.formItem.properties || {}}
							onChange={handleFormItemPropsChange}
						/>
					</>
				)}
			</div>
		);
	};

	const renderArrayItemConfig = () => {
		if (!nodeInfo || nodeInfo.type !== 'array-item') return null;

		// 获取当前数组项的值
		const currentValue = getValueByPath(schema, nodeInfo.propertyPath);

		if (!currentValue) return null;

		// 如果是 ReactNodeProperty 类型
		if (
			currentValue &&
			typeof currentValue === 'object' &&
			'type' in currentValue
		) {
			const reactNodeProp = currentValue as ReactNodeProperty;

			if (reactNodeProp.type === 'reactNode' && 'content' in reactNodeProp) {
				return (
					<div className="array-item-config">
						<Title level={5} style={{ color: '#fff' }}>
							JSX 内容配置
						</Title>
						<Form layout="vertical">
							<Form.Item label="JSX 内容">
								<TextArea
									value={reactNodeProp.content}
									onChange={(e) => {
										const newValue = {
											...reactNodeProp,
											content: e.target.value,
										};
										onPropertyChange(nodeInfo.propertyPath, newValue);
									}}
									rows={6}
									placeholder="请输入JSX内容"
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
			}

			// 如果是 ComponentSchema 类型
			if (reactNodeProp.type && reactNodeProp.type !== 'reactNode') {
				const componentSchema = reactNodeProp as ComponentSchema;
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

		// 如果是 ReactNodeProperty 类型
		if (propValue && typeof propValue === 'object' && 'type' in propValue) {
			const reactNodeProp = propValue as ReactNodeProperty;

			if (reactNodeProp.type === 'reactNode' && 'content' in reactNodeProp) {
				return (
					<div className="property-config">
						<Title level={5} style={{ color: '#fff' }}>
							组件属性配置
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
									属性名: {nodeInfo.propName}
								</Text>
								<Text
									type="secondary"
									style={{ color: 'rgba(255, 255, 255, 0.6)' }}
								>
									类型: ReactNode
								</Text>
								<Button
									type="primary"
									size="small"
									onClick={() => {
										// 确保父节点（属性节点）被展开
										const parentKey = selectedNode;
										const reactNodeKey = `${selectedNode}-reactnode-0`;

										// 如果父节点还没有展开，先展开父节点
										if (!expandedKeys.includes(parentKey)) {
											const newExpandedKeys = [...expandedKeys, parentKey];
											onExpand?.(newExpandedKeys);
										}

										// 选中对应的ReactNode节点
										onNodeSelect?.(reactNodeKey);
									}}
								>
									配置
								</Button>
							</Space>
						</Card>
					</div>
				);
			}

			// 如果是 ComponentSchema 类型
			if (reactNodeProp.type && reactNodeProp.type !== 'reactNode') {
				const componentSchema = reactNodeProp as ComponentSchema;
				return (
					<div className="property-config">
						<Title level={5} style={{ color: '#fff' }}>
							组件配置
						</Title>
						<Card
							size="small"
							style={{
								marginBottom: 16,
								background: 'rgba(255, 255, 255, 0.05)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
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
				if (
					reactNodeValue.type === 'reactNode' &&
					'content' in reactNodeValue
				) {
					return (
						<div className="reactnode-config">
							<Title level={5} style={{ color: '#fff' }}>
								JSX 内容配置
							</Title>
							<Form layout="vertical">
								<Form.Item label="JSX 内容">
									<TextArea
										value={reactNodeValue.content}
										onChange={(e) => {
											const newValue = {
												...reactNodeValue,
												content: e.target.value,
											};
											onPropertyChange(nodeInfo.propertyPath, newValue);
										}}
										rows={6}
										placeholder="请输入JSX内容"
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
				}

				// ComponentSchema类型
				if (reactNodeValue.type && reactNodeValue.type !== 'reactNode') {
					return (
						<div className="reactnode-config">
							<Title level={5} style={{ color: '#fff' }}>
								嵌套组件配置
							</Title>
							<Card
								size="small"
								style={{
									marginBottom: 16,
									background: 'rgba(255, 255, 255, 0.05)',
									border: '1px solid rgba(255, 255, 255, 0.1)',
								}}
							>
								<Space direction="vertical" style={{ width: '100%' }}>
									<Text strong style={{ color: '#fff' }}>
										组件类型: {reactNodeValue.type}
									</Text>
									<Text
										type="secondary"
										style={{ color: 'rgba(255, 255, 255, 0.6)' }}
									>
										子组件数量: {reactNodeValue.children?.length || 0}
									</Text>
								</Space>
							</Card>

							<Text
								type="secondary"
								style={{ color: 'rgba(255, 255, 255, 0.6)' }}
							>
								嵌套组件配置功能正在开发中...
							</Text>
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

	return (
		<div className="node-config-panel">
			<div className="config-header">
				<Title level={4} style={{ color: '#fff' }}>
					节点配置
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
