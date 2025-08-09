import React, { FC, useState, useEffect } from 'react';
import {
	Button,
	Card,
	Col,
	Row,
	Space,
	message,
	Modal,
	Form,
	Select,
	Switch,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormSchema } from '../../../../Schema';
import ConfigHeader from '../ConfigHeader';
import NodeTree from './NodeTree';
import AddComponentModal from './AddComponentModal';
import { canUseFormItem } from './ComponentConfig';
import './index.less';
import { ArrowLeftOutlined } from '@ant-design/icons';
import NodeConfigPanel from '../../../NodeConfigPanel';
import { getDefaultComponentPropsSchema } from '@/pages/PlaygroundPage/Schema/componentSchemas';
import { ComponentDisplayNames } from './types';
import { ComponentType } from './types';

interface FormModeProps {
	schema: FormSchema | null;
	onBack: () => void;
	onImport: () => void;
	onSwitchToPage?: () => void;
	selectedNode?: string | null;
	onNodeSelect?: (nodeId: string) => void;
	onSchemaChange?: (schema: FormSchema) => void;
	expandedKeys?: string[];
	onExpand?: (expandedKeys: string[]) => void;
}

const FormMode: FC<FormModeProps> = ({
	schema,
	onBack,
	onImport,
	onSwitchToPage,
	selectedNode,
	onNodeSelect,
	onSchemaChange,
	expandedKeys: externalExpandedKeys,
	onExpand: externalOnExpand,
}) => {
	const [schemaData, setSchemaData] = useState<FormSchema | null>(schema);
	const [showAddModal, setShowAddModal] = useState(false);
	const [currentParentId, setCurrentParentId] = useState<string>('');
	const [expandedKeys, setExpandedKeys] = useState<string[]>(
		externalExpandedKeys || []
	);

	// 当外部 schema 变更时，同步到本地状态（首次加载或上层编辑后）
	useEffect(() => {
		if (schema) {
			setSchemaData(schema);
		}
	}, [schema]);

	// 同步外部展开状态
	useEffect(() => {
		if (externalExpandedKeys) {
			setExpandedKeys(externalExpandedKeys);
		}
	}, [externalExpandedKeys]);

	// 同步内部展开状态到外部
	useEffect(() => {
		if (externalOnExpand) {
			externalOnExpand(expandedKeys);
		}
	}, [expandedKeys, externalOnExpand]);

	const handleAddComponent = (
		componentType: ComponentType,
		isFormComponent: boolean
	) => {
		// 检查组件是否可以使用FormItem
		const canUseFormItemForComponent = canUseFormItem(componentType);
		const finalIsFormComponent = isFormComponent && canUseFormItemForComponent;

		const newComponent = {
			type: componentType,
			props: getDefaultComponentPropsSchema(componentType).properties as Record<
				string,
				any
			>,
			isFormComponent: finalIsFormComponent,
			formItem: finalIsFormComponent
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

		// 更新schema
		if (schemaData) {
			// 过滤掉空节点
			const filteredChildren = (schemaData.properties.children || []).filter(
				(child) => child.type !== 'EmptyNode'
			);

			const updatedSchema: FormSchema = {
				...schemaData,
				properties: {
					...schemaData.properties,
					children: [...filteredChildren, newComponent],
				},
			};

			setSchemaData(updatedSchema);
			onSchemaChange?.(updatedSchema);

			// 关闭弹窗
			setShowAddModal(false);

			// 自动选中新创建的节点并展开到该节点
			const newComponentIndex = filteredChildren.length;
			const newNodeId = `child-${newComponentIndex}`;
			onNodeSelect?.(newNodeId);

			// 确保父节点展开
			setExpandedKeys(['form']);

			message.success(`已添加${ComponentDisplayNames[componentType]}组件`);
			console.log('添加组件:', newComponent);

			// 如果组件不能使用FormItem，显示特殊提示
			if (isFormComponent && !canUseFormItemForComponent) {
				message.warning(
					`${ComponentDisplayNames[componentType]}组件不支持FormItem包装，已自动移除FormItem配置`
				);
			}
		}
	};

	// 处理在数组属性中添加新项
	const handleAddArrayItem = (parentId: string, nodeType: string) => {
		if (!schemaData) return;

		// 解析父节点ID来确定要添加到哪个数组
		const parts = parentId.split('-');

		// 如果是数组属性节点 (如 rows.fields)
		if (parentId.includes('-prop-')) {
			const propIndex = parts.indexOf('prop');
			const componentIndex = parseInt(parts[1]);
			const propName = parts[propIndex + 1];

			// 获取当前数组
			const children = [...(schemaData.properties.children || [])];
			const component = children[componentIndex];
			const currentArray = component?.props?.[propName];

			if (Array.isArray(currentArray)) {
				// 根据属性名确定要添加的类型
				let newItem: any;

				if (propName === 'fields') {
					// 添加一个默认的ReactNodeProperty
					newItem = {
						type: 'reactNode' as const,
						content:
							'<FormItem id="newField" label="新字段" required={false}><Input id="newField" placeholder="请输入内容" /></FormItem>',
					};
				} else if (propName === 'rows') {
					// 添加一个默认的row对象
					newItem = {
						rowIndexs: [currentArray.length + 1],
						fields: [
							{
								type: 'reactNode' as const,
								content:
									'<FormItem id="field1" label="字段1" required={false}><Input id="field1" placeholder="请输入内容" /></FormItem>',
							},
						],
					};
				} else {
					// 默认添加一个空对象
					newItem = {};
				}

				// 更新数组
				const newArray = [...currentArray, newItem];
				const newProps = { ...component.props, [propName]: newArray };
				children[componentIndex] = { ...component, props: newProps };

				const updatedSchema: FormSchema = {
					...schemaData,
					properties: {
						...schemaData.properties,
						children,
					},
				};

				setSchemaData(updatedSchema);
				onSchemaChange?.(updatedSchema);

				// 自动选中新创建的项
				const newItemIndex = currentArray.length;
				const newNodeId = `${parentId}-item-${newItemIndex}`;
				onNodeSelect?.(newNodeId);

				message.success(`已在${propName}中添加新项`);
			}
		}
		// 如果是嵌套数组属性节点 (如 rows.fields 中的 fields)
		else if (parentId.includes('-rowprop-')) {
			const rowPropIndex = parts.indexOf('rowprop');
			const parentKey = parts.slice(0, rowPropIndex).join('-');
			const rowPropName = parts[rowPropIndex + 1];

			// 解析父节点
			const parentParse = parseNodeId(parentKey);
			if (parentParse && parentParse.type === 'array-item') {
				// 获取当前row对象
				const currentRow = getValueByPath(schemaData, parentParse.propertyPath);
				if (
					currentRow &&
					typeof currentRow === 'object' &&
					Array.isArray(currentRow[rowPropName])
				) {
					// 添加新的字段
					const newField = {
						type: 'reactNode' as const,
						content:
							'<FormItem id="newField" label="新字段" required={false}><Input id="newField" placeholder="请输入内容" /></FormItem>',
					};

					const newFields = [...currentRow[rowPropName], newField];
					const newRow = { ...currentRow, [rowPropName]: newFields };

					// 更新整个schema
					const updatedSchema = setValueByPath(
						schemaData,
						parentParse.propertyPath,
						newRow
					);
					setSchemaData(updatedSchema);
					onSchemaChange?.(updatedSchema);

					// 自动选中新创建的字段
					const newFieldIndex = currentRow[rowPropName].length;
					const newNodeId = `${parentId}-field-${newFieldIndex}`;
					onNodeSelect?.(newNodeId);

					message.success(`已在${rowPropName}中添加新字段`);
				}
			}
		}
	};

	// 解析节点ID的辅助函数
	const parseNodeId = (nodeId: string) => {
		const parts = nodeId.split('-');

		// 如果是数组项节点
		if (nodeId.includes('-item-')) {
			const itemIndex = parts.indexOf('item');
			const parentKey = parts.slice(0, itemIndex).join('-');
			const index = parseInt(parts[itemIndex + 1]);

			// 解析父节点的属性路径
			if (parentKey.includes('-prop-')) {
				const propIndex = parentKey.split('-').indexOf('prop');
				const componentIndex = parseInt(parentKey.split('-')[1]);
				const propName = parentKey.split('-')[propIndex + 1];
				const propertyPath = `properties.children.${componentIndex}.props.${propName}.${index}`;

				return {
					type: 'array-item' as const,
					index,
					parentKey,
					propertyPath,
				};
			}
		}

		return null;
	};

	// 获取指定路径的值的辅助函数
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

	// 设置指定路径的值的辅助函数
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

	const handleAddNode = (parentId: string, nodeType: string) => {
		if (nodeType === 'array-item') {
			handleAddArrayItem(parentId, nodeType);
		} else {
			setCurrentParentId(parentId);
			setShowAddModal(true);
		}
	};

	const handleDeleteNode = (nodeId: string) => {
		message.info('删除节点功能暂未实现');
	};

	const handlePropertyChange = (
		nodeId: string,
		property: string,
		value: any
	) => {
		if (!schemaData) return;

		const node = getValueByPath(schemaData, nodeId);
		if (node) {
			const updatedNode = { ...node, [property]: value };
			const updatedSchema = setValueByPath(schemaData, nodeId, updatedNode);
			setSchemaData(updatedSchema);
			onSchemaChange?.(updatedSchema);
		}
	};

	return (
		<div className="form-mode">
			<div className="form-mode-header">
				<div className="header-actions">
					<Button onClick={onBack} icon={<ArrowLeftOutlined />}>
						返回
					</Button>
					<Button onClick={onImport} type="primary">
						导入配置
					</Button>
					{onSwitchToPage && (
						<Button onClick={onSwitchToPage} type="default">
							切换到页面模式
						</Button>
					)}
				</div>
			</div>

			<div className="form-mode-content">
				<div className="node-tree-container">
					<NodeTree
						schema={schemaData}
						selectedNode={selectedNode || null}
						onNodeSelect={onNodeSelect || (() => {})}
						onAddNode={handleAddNode}
						onDeleteNode={handleDeleteNode}
						expandedKeys={expandedKeys}
						onExpand={setExpandedKeys}
					/>
				</div>

				<div className="config-panel-container">
					<NodeConfigPanel
						schema={schemaData}
						selectedNode={selectedNode || null}
						onNodeSelect={onNodeSelect || (() => {})}
						onExpand={setExpandedKeys}
						expandedKeys={expandedKeys}
						onPropertyChange={(propertyPath: string, value: any) => {
							// 这里需要根据propertyPath来更新schema
							if (schemaData) {
								const updatedSchema = setValueByPath(
									schemaData,
									propertyPath,
									value
								);
								setSchemaData(updatedSchema);
								onSchemaChange?.(updatedSchema);
							}
						}}
					/>
				</div>
			</div>

			<AddComponentModal
				visible={showAddModal}
				onCancel={() => setShowAddModal(false)}
				onOk={handleAddComponent}
				defaultIsFormComponent={true}
			/>
		</div>
	);
};

export default FormMode;
