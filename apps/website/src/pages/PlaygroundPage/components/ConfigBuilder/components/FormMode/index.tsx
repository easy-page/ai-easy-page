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
import { useService } from '@/infra/ioc/react';
import { ChatService } from '@/services/chatGlobalState';
import { useObservable } from '@/hooks/useObservable';

interface FormModeProps {
	onBack: () => void;
	onImport: () => void;
	onSwitchToPage?: () => void;
	selectedNode?: string | null;
	onNodeSelect?: (nodeId: string) => void;
	expandedKeys?: string[];
	onExpand?: (expandedKeys: string[]) => void;
}

const FormMode: FC<FormModeProps> = ({
	onBack,
	onImport,
	onSwitchToPage,
	selectedNode,
	onNodeSelect,
	expandedKeys: externalExpandedKeys,
	onExpand: externalOnExpand,
}) => {
	const chatService = useService(ChatService);
	const curVenue = useObservable(chatService.globalState.curVenue$, null);
	const schemaData = (curVenue?.page_schema as FormSchema) || null;
	console.log('loadVenueDetail response.data schemaData123213', curVenue);
	const [showAddModal, setShowAddModal] = useState(false);
	const [currentParentId, setCurrentParentId] = useState<string>('');
	const [expandedKeys, setExpandedKeys] = useState<string[]>(
		externalExpandedKeys || []
	);

	// schema 全局管理，无需本地同步

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

		const defaultPropsSchema = getDefaultComponentPropsSchema(componentType)
			.properties as Record<string, any>;

		const inferCanHaveChildren = (
			type: ComponentType,
			props: Record<string, any>
		): boolean => {
			if (props && Object.prototype.hasOwnProperty.call(props, 'children')) {
				return true;
			}
			const legacyContainerTypes = new Set<ComponentType>([
				ComponentType.CONTAINER,
				ComponentType.DYNAMIC_FORM,
				ComponentType.CUSTOM,
				// HTML-like elements commonly accepting children
				ComponentType.DIV,
				ComponentType.SPAN,
				ComponentType.P,
				ComponentType.A,
				ComponentType.UL,
				ComponentType.LI,
			]);

			return legacyContainerTypes.has(type);
		};

		const newComponent = {
			type: componentType,
			props: defaultPropsSchema as Record<string, any>,
			canHaveChildren: inferCanHaveChildren(componentType, defaultPropsSchema),
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

		// 更新schema：插入到当前选中的父节点下面
		if (schemaData) {
			const cloneSchema: FormSchema = { ...schemaData };

			// 计算要插入的 children 路径
			const resolveChildrenPath = (
				parentId: string | null | undefined
			): string => {
				if (!parentId || parentId === 'form') return 'properties.children';
				const basePath = nodeIdToPropertyPath(parentId);
				// basePath 指向组件对象或组件属性（为组件）
				return basePath ? `${basePath}.children` : 'properties.children';
			};

			const childrenPath = resolveChildrenPath(currentParentId);
			const currentChildren = (getValueByPath(cloneSchema, childrenPath) ||
				[]) as unknown[];

			// 过滤掉空节点，仅在根层使用；嵌套时也尽量保持
			const normalizedChildren = Array.isArray(currentChildren)
				? currentChildren.filter((c: any) => c?.type !== 'EmptyNode')
				: [];

			const newChildrenArray = [...normalizedChildren, newComponent];
			const updatedSchema = setValueByPath(
				cloneSchema,
				childrenPath,
				newChildrenArray
			);

			chatService.globalState.updateVenueSchema(updatedSchema);

			// 关闭弹窗
			setShowAddModal(false);

			// 自动选中新创建的节点并展开到该节点
			// 选中规则：
			// - 在根插入：child-<index>
			// - 在子组件 children 中插入：父ID保持不变（让用户在右侧配置看到新的 children）
			if (childrenPath === 'properties.children') {
				const newComponentIndex = newChildrenArray.length - 1;
				const newNodeId = `child-${newComponentIndex}`;
				onNodeSelect?.(newNodeId);
				setExpandedKeys(['form']);
			} else {
				// 尝试展开父节点
				if (currentParentId) {
					onNodeSelect?.(currentParentId);
					setExpandedKeys((prev) =>
						Array.from(new Set([...(prev || []), currentParentId!]))
					);
				}
			}

			message.success(`已添加${ComponentDisplayNames[componentType]}组件`);

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

				chatService.globalState.updateVenueSchema(updatedSchema);

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
					Array.isArray(
						(currentRow as Record<string, unknown[]>)[rowPropName] as unknown[]
					)
				) {
					// 添加新的字段
					const newField = {
						type: 'reactNode' as const,
						content:
							'<FormItem id="newField" label="新字段" required={false}><Input id="newField" placeholder="请输入内容" /></FormItem>',
					};

					const newFields = [
						...((currentRow as Record<string, unknown[]>)[
							rowPropName
						] as unknown[]),
						newField,
					];
					const newRow = {
						...(currentRow as Record<string, unknown>),
						[rowPropName]: newFields,
					} as Record<string, unknown>;

					// 更新整个schema
					const updatedSchema = setValueByPath(
						schemaData,
						parentParse.propertyPath,
						newRow
					);
					chatService.globalState.updateVenueSchema(updatedSchema);

					// 自动选中新创建的字段
					const newFieldIndex = (
						(currentRow as Record<string, unknown[]>)[rowPropName] as unknown[]
					).length;
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

	// 获取指定路径的值（对数组下标和对象键均兼容），去除 any
	function getValueByPath<TObj extends object, TResult = unknown>(
		obj: TObj,
		path: string
	): TResult | undefined {
		const parts = path.split('.');
		let current: unknown = obj;
		for (const rawKey of parts) {
			if (current == null || typeof current !== 'object') return undefined;
			const isIndex = /^\d+$/.test(rawKey);
			if (Array.isArray(current) && isIndex) {
				current = current[Number(rawKey)];
			} else {
				current = (current as Record<string, unknown>)[rawKey];
			}
		}
		return current as TResult;
	}

	// 设置指定路径的值（不可变写法，必要时创建中间对象/数组），去除 any
	function setValueByPath<TObj extends object, V = unknown>(
		obj: TObj,
		path: string,
		value: V
	): TObj {
		const parts = path.split('.');
		const rootClone: unknown = Array.isArray(obj)
			? [...(obj as unknown[])]
			: { ...(obj as Record<string, unknown>) };
		let current: unknown = rootClone;
		for (let i = 0; i < parts.length - 1; i++) {
			const rawKey = parts[i];
			const isIndex = /^\d+$/.test(rawKey);
			if (Array.isArray(current) && isIndex) {
				const idx = Number(rawKey);
				const arr = current as unknown[];
				const nextVal = arr[idx];
				arr[idx] =
					nextVal && typeof nextVal === 'object'
						? Array.isArray(nextVal)
							? [...nextVal]
							: { ...(nextVal as Record<string, unknown>) }
						: {};
				current = arr[idx];
			} else {
				const objCur = current as Record<string, unknown>;
				const nextVal = objCur[rawKey];
				objCur[rawKey] =
					nextVal && typeof nextVal === 'object'
						? Array.isArray(nextVal)
							? [...nextVal]
							: { ...(nextVal as Record<string, unknown>) }
						: {};
				current = objCur[rawKey];
			}
		}
		const lastKey = parts[parts.length - 1];
		if (Array.isArray(current) && /^\d+$/.test(lastKey)) {
			(current as unknown[])[Number(lastKey)] = value as unknown;
		} else {
			(current as Record<string, unknown>)[lastKey] = value as unknown;
		}
		return rootClone as TObj;
	}

	const handleAddNode = (parentId: string, nodeType: string) => {
		if (nodeType === 'array-item') {
			handleAddArrayItem(parentId, nodeType);
		} else {
			setCurrentParentId(parentId);
			setShowAddModal(true);
		}
	};

	// 删除路径上的值：如果最后一级是数组下标，则删除该下标元素；否则删除对象键
	function deleteValueByPath<TObj extends object>(
		obj: TObj,
		path: string
	): TObj {
		if (!path) return obj;
		const parts = path.split('.');
		const parentPath = parts.slice(0, -1).join('.');
		const lastKey = parts[parts.length - 1];

		const parent: unknown = parentPath ? getValueByPath(obj, parentPath) : obj;
		if (parent == null || typeof parent !== 'object') return obj;

		let updatedParent: unknown;
		const isIndex = /^\d+$/.test(lastKey);
		if (Array.isArray(parent) && isIndex) {
			const idx = Number(lastKey);
			const newArr = [...parent];
			if (idx < 0 || idx >= newArr.length) return obj;
			newArr.splice(idx, 1);
			updatedParent = newArr;
		} else {
			const newObj = { ...(parent as Record<string, unknown>) };
			delete (newObj as Record<string, unknown>)[lastKey];
			updatedParent = newObj;
		}

		if (!parentPath) {
			return updatedParent as TObj;
		}
		return setValueByPath(obj, parentPath, updatedParent as unknown as never);
	}

	// 从节点ID解析出属性路径
	function nodeIdToPropertyPath(nodeId: string): string | null {
		const parts = nodeId.split('-');

		// 解析多层 children：child-<i>-child-<j>-...
		const childIndexes: number[] = [];
		for (let i = 0; i < parts.length; i++) {
			if (parts[i] === 'child' && i + 1 < parts.length) {
				const idx = Number(parts[i + 1]);
				if (!Number.isNaN(idx)) childIndexes.push(idx);
			}
		}
		if (childIndexes.length === 0) return null;

		const tokens: string[] = [
			'properties',
			'children',
			String(childIndexes[0]),
		];
		for (let i = 1; i < childIndexes.length; i++) {
			tokens.push('children', String(childIndexes[i]));
		}

		// 属性（prop-<name>）
		const propIdx = parts.indexOf('prop');
		if (propIdx >= 0) {
			const propName = parts[propIdx + 1];
			if (propName) {
				tokens.push('props', propName);
			}
		}

		// 数组项（item-<n>）
		const itemIdx = parts.indexOf('item');
		if (itemIdx >= 0) {
			const indexStr = parts[itemIdx + 1];
			if (indexStr) tokens.push(String(Number(indexStr)));
		}

		// 行内属性（rowprop-<name>）
		const rowPropIdx = parts.indexOf('rowprop');
		if (rowPropIdx >= 0) {
			const rowPropName = parts[rowPropIdx + 1];
			if (rowPropName) tokens.push(rowPropName);
		}

		// 字段索引（field-<m>）
		const fieldIdx = parts.indexOf('field');
		if (fieldIdx >= 0) {
			const fIndexStr = parts[fieldIdx + 1];
			if (fIndexStr) tokens.push(String(Number(fIndexStr)));
		}

		return tokens.join('.');
	}

	const handleDeleteNode = (nodeId: string) => {
		if (!schemaData) return;

		let updatedSchema: FormSchema | null = null;

		// 解析属性路径
		const propertyPath = nodeIdToPropertyPath(nodeId);

		if (propertyPath) {
			updatedSchema = deleteValueByPath(schemaData, propertyPath);
		} else {
			message.warning('无法解析需要删除的节点');
			return;
		}

		chatService.globalState.updateVenueSchema(updatedSchema);
		message.success('已删除节点');
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
						selectedNode={selectedNode || null}
						onNodeSelect={onNodeSelect || (() => {})}
						onExpand={setExpandedKeys}
						expandedKeys={expandedKeys}
						onPropertyChange={(propertyPath: string, value: any) => {
							if (!schemaData) return;
							const updatedSchema = setValueByPath(
								schemaData,
								propertyPath,
								value
							);
							chatService.globalState.updateVenueSchema(updatedSchema);
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
