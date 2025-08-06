import { FC, useState } from 'react';
import { Tree, Button, Space, Typography, Badge, Switch } from 'antd';
import {
	PlusOutlined,
	DeleteOutlined,
	FolderOutlined,
	FileOutlined,
	CodeOutlined,
	SettingOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';
import { FormSchema, ComponentSchema } from '../../../../Schema';
import { ReactNodeProperty } from '../../../../Schema/specialProperties';

const { Text } = Typography;

interface NodeTreeProps {
	schema: FormSchema | null;
	selectedNode: string | null;
	onNodeSelect: (nodeId: string) => void;
	onAddNode: (parentId: string, nodeType: string) => void;
	onDeleteNode: (nodeId: string) => void;
	expandedKeys?: string[];
	onExpand?: (expandedKeys: string[]) => void;
}

interface TreeNode {
	key: string;
	title: React.ReactNode;
	children?: TreeNode[];
	isProperty?: boolean; // 标识是否为属性节点
	propertyPath?: string; // 属性路径
	nodeType?: 'component' | 'property' | 'array' | 'reactNode'; // 节点类型
}

// 判断组件是否支持children
const supportsChildren = (componentType: string): boolean => {
	// 支持children的组件类型
	const componentsWithChildren = [
		'Container',
		'DynamicForm',
		'Custom',
		// 可以根据需要添加更多支持children的组件
	];

	return componentsWithChildren.includes(componentType);
};

// 判断组件是否支持数组属性
const supportsArrayProps = (componentType: string): boolean => {
	// 支持数组属性的组件类型
	const componentsWithArrayProps = [
		'DynamicForm', // 支持 rows, headers 等数组属性
		'Container', // 可能支持某些数组属性
		// 可以根据需要添加更多支持数组属性的组件
	];

	return componentsWithArrayProps.includes(componentType);
};

// 检查值是否为ReactNodeProperty
const isReactNodeProperty = (value: any): value is ReactNodeProperty => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	// 检查是否有 type 属性
	if (!('type' in value)) {
		return false;
	}

	// 如果是 { type: 'reactNode', content: string }
	if (value.type === 'reactNode' && 'content' in value) {
		return true;
	}

	return false;
};

// 检查数组中是否包含ReactNodeProperty
const hasReactNodeInArray = (array: any[]): boolean => {
	return array.some((item) => isReactNodeProperty(item));
};

// 检查对象中是否包含ReactNodeProperty数组
const hasReactNodeArrayInObject = (obj: Record<string, any>): boolean => {
	return Object.values(obj).some(
		(value) => Array.isArray(value) && hasReactNodeInArray(value)
	);
};

const NodeTree: FC<NodeTreeProps> = ({
	schema,
	selectedNode,
	onNodeSelect,
	onAddNode,
	onDeleteNode,
	expandedKeys = [],
	onExpand,
}) => {
	const [filterReactNodeOnly, setFilterReactNodeOnly] = useState(true);

	// 递归构建 ReactNodeProperty 的树节点
	const buildReactNodeTree = (
		nodeProp: ReactNodeProperty,
		parentKey: string,
		index: number,
		propertyPath: string
	): TreeNode => {
		const nodeKey = `${parentKey}-reactnode-${index}`;

		// 如果是字符串类型的 ReactNodeProperty
		if (nodeProp.type === 'reactNode' && 'content' in nodeProp) {
			return {
				key: nodeKey,
				title: (
					<Space>
						<CodeOutlined style={{ color: '#52c41a' }} />
						<Text style={{ color: '#fff' }}>
							JSX: {nodeProp.content?.substring(0, 20) || ''}...
						</Text>
						{nodeProp.useSchema && nodeProp.schema && (
							<Badge
								count="Schema"
								size="small"
								style={{ backgroundColor: '#722ed1' }}
							/>
						)}
						<Button
							type="text"
							size="small"
							icon={<DeleteOutlined />}
							onClick={(e) => {
								e.stopPropagation();
								onDeleteNode(nodeKey);
							}}
						/>
					</Space>
				),
				isProperty: true,
				propertyPath,
				nodeType: 'reactNode',
			};
		}

		return {
			key: nodeKey,
			title: (
				<Space>
					<CodeOutlined style={{ color: '#faad14' }} />
					<Text style={{ color: '#fff' }}>Unknown Node</Text>
				</Space>
			),
			isProperty: true,
			propertyPath,
			nodeType: 'reactNode',
		};
	};

	// 递归构建组件属性树
	const buildComponentPropertiesTree = (
		component: ComponentSchema,
		parentKey: string,
		propertyPath: string
	): TreeNode[] => {
		const properties: TreeNode[] = [];

		// 遍历组件的所有属性
		Object.entries(component.props || {}).forEach(([key, value]) => {
			const propKey = `${parentKey}-prop-${key}`;
			const currentPropertyPath = `${propertyPath}.props.${key}`;

			// 如果不过滤，显示所有属性
			// 或者如果过滤，但当前属性是 ReactNode 相关或直接的组件 schema
			if (
				!filterReactNodeOnly ||
				isReactNodeProperty(value) ||
				(value &&
					typeof value === 'object' &&
					'type' in value &&
					value.type !== 'reactNode')
			) {
				// 如果是数组类型
				if (Array.isArray(value)) {
					properties.push({
						key: propKey,
						title: (
							<Space>
								<UnorderedListOutlined style={{ color: '#722ed1' }} />
								<Text style={{ color: '#fff' }}>{key}</Text>
								<Badge count={value.length} size="small" />
								<Button
									type="text"
									size="small"
									icon={<PlusOutlined />}
									onClick={(e) => {
										e.stopPropagation();
										onAddNode(propKey, 'array-item');
									}}
								/>
							</Space>
						),
						isProperty: true,
						propertyPath: currentPropertyPath,
						nodeType: 'array',
						children: value.map((item, index) => {
							const itemKey = `${propKey}-item-${index}`;
							const itemPropertyPath = `${currentPropertyPath}.${index}`;

							// 如果数组元素是 ReactNodeProperty
							if (isReactNodeProperty(item)) {
								return buildReactNodeTree(item, itemKey, 0, itemPropertyPath);
							}

							// 如果数组元素是对象（如 rows 中的 row 对象）
							if (item && typeof item === 'object' && !('type' in item)) {
								const rowObj = item as Record<string, any>;
								return {
									key: itemKey,
									title: (
										<Space>
											<FolderOutlined style={{ color: '#fa8c16' }} />
											<Text style={{ color: '#fff' }}>Row {index + 1}</Text>
											<Button
												type="text"
												size="small"
												icon={<DeleteOutlined />}
												onClick={(e) => {
													e.stopPropagation();
													onDeleteNode(itemKey);
												}}
											/>
										</Space>
									),
									isProperty: true,
									propertyPath: itemPropertyPath,
									nodeType: 'property',
									children: Object.entries(rowObj).map(([rowKey, rowValue]) => {
										const rowPropKey = `${itemKey}-rowprop-${rowKey}`;
										const rowPropPath = `${itemPropertyPath}.${rowKey}`;

										// 如果 row 属性是数组
										if (Array.isArray(rowValue)) {
											return {
												key: rowPropKey,
												title: (
													<Space>
														<UnorderedListOutlined
															style={{ color: '#722ed1' }}
														/>
														<Text style={{ color: '#fff' }}>{rowKey}</Text>
														<Badge count={rowValue.length} size="small" />
														<Button
															type="text"
															size="small"
															icon={<PlusOutlined />}
															onClick={(e) => {
																e.stopPropagation();
																onAddNode(rowPropKey, 'array-item');
															}}
														/>
													</Space>
												),
												isProperty: true,
												propertyPath: rowPropPath,
												nodeType: 'array',
												children: rowValue.map((fieldItem, fieldIndex) => {
													const fieldKey = `${rowPropKey}-field-${fieldIndex}`;
													const fieldPath = `${rowPropPath}.${fieldIndex}`;

													if (isReactNodeProperty(fieldItem)) {
														return buildReactNodeTree(
															fieldItem,
															fieldKey,
															0,
															fieldPath
														);
													}

													return {
														key: fieldKey,
														title: (
															<Space>
																<SettingOutlined style={{ color: '#722ed1' }} />
																<Text style={{ color: '#fff' }}>
																	Item {fieldIndex + 1}
																</Text>
																<Text
																	type="secondary"
																	style={{ fontSize: '12px' }}
																>
																	{typeof fieldItem}
																</Text>
																<Button
																	type="text"
																	size="small"
																	icon={<DeleteOutlined />}
																	onClick={(e) => {
																		e.stopPropagation();
																		onDeleteNode(fieldKey);
																	}}
																/>
															</Space>
														),
														isProperty: true,
														propertyPath: fieldPath,
														nodeType: 'property',
													};
												}),
											};
										}

										// 普通属性
										return {
											key: rowPropKey,
											title: (
												<Space>
													<SettingOutlined style={{ color: '#722ed1' }} />
													<Text style={{ color: '#fff' }}>{rowKey}</Text>
													<Text type="secondary" style={{ fontSize: '12px' }}>
														{typeof rowValue}
													</Text>
												</Space>
											),
											isProperty: true,
											propertyPath: rowPropPath,
											nodeType: 'property',
										};
									}),
								};
							}

							// 普通数组元素
							return {
								key: itemKey,
								title: (
									<Space>
										<SettingOutlined style={{ color: '#722ed1' }} />
										<Text style={{ color: '#fff' }}>Item {index + 1}</Text>
										<Text type="secondary" style={{ fontSize: '12px' }}>
											{typeof item}
										</Text>
										<Button
											type="text"
											size="small"
											icon={<DeleteOutlined />}
											onClick={(e) => {
												e.stopPropagation();
												onDeleteNode(itemKey);
											}}
										/>
									</Space>
								),
								isProperty: true,
								propertyPath: itemPropertyPath,
								nodeType: 'property',
							};
						}),
					});
				}
				// 如果是 ReactNodeProperty 类型
				else if (isReactNodeProperty(value)) {
					properties.push(
						buildReactNodeTree(value, propKey, 0, currentPropertyPath)
					);
				}
				// 如果是 ComponentSchema 类型
				else if (
					value &&
					typeof value === 'object' &&
					'type' in value &&
					value.type !== 'reactNode'
				) {
					const componentSchema = value as ComponentSchema;
					const canHaveChildren = supportsChildren(componentSchema.type);

					properties.push({
						key: propKey,
						title: (
							<Space>
								<FileOutlined style={{ color: '#1890ff' }} />
								<Text style={{ color: '#fff' }}>
									【{key}】{componentSchema.type || 'Component'}
								</Text>
								{canHaveChildren && (
									<Badge
										count={componentSchema.children?.length || 0}
										size="small"
									/>
								)}
								{canHaveChildren && (
									<Button
										type="text"
										size="small"
										icon={<PlusOutlined />}
										onClick={(e) => {
											e.stopPropagation();
											onAddNode(propKey, 'component');
										}}
									/>
								)}
								<Button
									type="text"
									size="small"
									icon={<DeleteOutlined />}
									onClick={(e) => {
										e.stopPropagation();
										onDeleteNode(propKey);
									}}
								/>
							</Space>
						),
						isProperty: true,
						propertyPath: currentPropertyPath,
						nodeType: 'component',
						children: canHaveChildren
							? componentSchema.children?.map((child, childIndex) => {
									if (isReactNodeProperty(child)) {
										return buildReactNodeTree(
											child,
											propKey,
											childIndex,
											`${currentPropertyPath}.children.${childIndex}`
										);
									}
									return {
										key: `${propKey}-child-${childIndex}`,
										title: (
											<Space>
												<FileOutlined style={{ color: '#1890ff' }} />
												<Text style={{ color: '#fff' }}>
													{child.type || 'Component'}
												</Text>
											</Space>
										),
										isProperty: true,
										propertyPath: `${currentPropertyPath}.children.${childIndex}`,
										nodeType: 'component',
									};
							  })
							: undefined,
					});
				}
				// 普通属性
				else {
					properties.push({
						key: propKey,
						title: (
							<Space>
								<SettingOutlined style={{ color: '#722ed1' }} />
								<Text style={{ color: '#fff' }}>{key}</Text>
								<Text type="secondary" style={{ fontSize: '12px' }}>
									{typeof value}
								</Text>
							</Space>
						),
						isProperty: true,
						propertyPath: currentPropertyPath,
						nodeType: 'property',
					});
				}
			}
			// 如果过滤，只显示ReactNode相关属性
			else {
				// 如果是数组类型
				if (Array.isArray(value)) {
					// 检查数组中是否包含ReactNodeProperty（直接检查或嵌套检查）
					const hasReactNodeItems = value.some((item) => {
						// 直接是ReactNodeProperty
						if (isReactNodeProperty(item)) {
							return true;
						}
						// 或者是对象，且对象中包含ReactNodeProperty数组
						if (item && typeof item === 'object' && !('type' in item)) {
							const obj = item as Record<string, any>;
							return Object.values(obj).some(
								(val) =>
									Array.isArray(val) &&
									val.some((subItem) => isReactNodeProperty(subItem))
							);
						}
						return false;
					});

					// 只有当数组包含ReactNodeProperty时才显示
					if (hasReactNodeItems) {
						properties.push({
							key: propKey,
							title: (
								<Space>
									<UnorderedListOutlined style={{ color: '#722ed1' }} />
									<Text style={{ color: '#fff' }}>{key}</Text>
									<Badge count={value.length} size="small" />
								</Space>
							),
							isProperty: true,
							propertyPath: currentPropertyPath,
							nodeType: 'array',
							children: value
								.map((item, index) => {
									const itemKey = `${propKey}-item-${index}`;
									const itemPropertyPath = `${currentPropertyPath}.${index}`;

									// 如果数组元素是 ReactNodeProperty
									if (isReactNodeProperty(item)) {
										return buildReactNodeTree(
											item,
											itemKey,
											0,
											itemPropertyPath
										);
									}

									// 如果数组元素是对象（如 rows 中的 row 对象）
									if (item && typeof item === 'object' && !('type' in item)) {
										const rowObj = item as Record<string, any>;
										// 检查对象中是否包含ReactNodeProperty数组
										const reactNodeFields = Object.entries(rowObj).filter(
											([rowKey, rowValue]) =>
												Array.isArray(rowValue) &&
												rowValue.some((subItem) => isReactNodeProperty(subItem))
										);

										// 只有当对象包含ReactNodeProperty数组时才显示
										if (reactNodeFields.length > 0) {
											const children: TreeNode[] = [];

											reactNodeFields.forEach(([rowKey, rowValue]) => {
												const rowPropKey = `${itemKey}-rowprop-${rowKey}`;
												const rowPropPath = `${itemPropertyPath}.${rowKey}`;

												// 如果 row 属性是 ReactNodeProperty 数组（如 fields）
												if (Array.isArray(rowValue)) {
													const fieldChildren: TreeNode[] = [];

													rowValue.forEach((fieldItem, fieldIndex) => {
														const fieldKey = `${rowPropKey}-field-${fieldIndex}`;
														const fieldPath = `${rowPropPath}.${fieldIndex}`;

														// 只展示ReactNode类型的字段
														if (isReactNodeProperty(fieldItem)) {
															fieldChildren.push(
																buildReactNodeTree(
																	fieldItem,
																	fieldKey,
																	0,
																	fieldPath
																)
															);
														}
													});

													if (fieldChildren.length > 0) {
														children.push({
															key: rowPropKey,
															title: (
																<Space>
																	<UnorderedListOutlined
																		style={{ color: '#722ed1' }}
																	/>
																	<Text style={{ color: '#fff' }}>
																		{rowKey}
																	</Text>
																	<Badge count={rowValue.length} size="small" />
																</Space>
															),
															isProperty: true,
															propertyPath: rowPropPath,
															nodeType: 'array',
															children: fieldChildren,
														});
													}
												}
											});

											if (children.length > 0) {
												return {
													key: itemKey,
													title: (
														<Space>
															<FolderOutlined style={{ color: '#fa8c16' }} />
															<Text style={{ color: '#fff' }}>
																Row {index + 1}
															</Text>
														</Space>
													),
													isProperty: true,
													propertyPath: itemPropertyPath,
													nodeType: 'property',
													children,
												};
											}
										}
									}

									// 如果不是ReactNode类型，不显示
									return null;
								})
								.filter((item): item is TreeNode => item !== null),
						});
					}
				}
				// 如果是 ReactNodeProperty 类型
				else if (isReactNodeProperty(value)) {
					properties.push(
						buildReactNodeTree(value, propKey, 0, currentPropertyPath)
					);
				}
				// 如果是 ComponentSchema 类型 - 过滤模式下不显示
				// 普通属性 - 过滤模式下不显示
			}
		});

		return properties;
	};

	const buildTreeData = (): TreeNode[] => {
		if (!schema) return [];

		const rootNode: TreeNode = {
			key: 'form',
			title: (
				<Space>
					<FolderOutlined style={{ color: '#fa8c16' }} />
					<Text style={{ color: '#fff', fontWeight: 'bold' }}>
						{schema.type || 'Form'}
					</Text>
					<Button
						type="text"
						size="small"
						icon={<PlusOutlined />}
						onClick={(e) => {
							e.stopPropagation();
							onAddNode('form', 'component');
						}}
					/>
				</Space>
			),
			children: (schema.properties?.children || []).map((child, index) => {
				const childKey = `child-${index}`;
				const childPropertyPath = `properties.children.${index}`;

				// 构建组件属性树
				const componentProperties = buildComponentPropertiesTree(
					child,
					childKey,
					childPropertyPath
				);

				const canHaveChildren = supportsChildren(child.type);
				const canHaveArrayProps = supportsArrayProps(child.type);

				return {
					key: childKey,
					title: (
						<Space>
							<FileOutlined style={{ color: '#1890ff' }} />
							<Text style={{ color: '#fff' }}>{child.type || 'Component'}</Text>
							{canHaveChildren && (
								<Badge count={child.children?.length || 0} size="small" />
							)}
							{canHaveArrayProps && componentProperties.length > 0 && (
								<Badge
									count={componentProperties.length}
									size="small"
									style={{ backgroundColor: '#722ed1' }}
								/>
							)}
							{canHaveChildren && (
								<Button
									type="text"
									size="small"
									icon={<PlusOutlined />}
									onClick={(e) => {
										e.stopPropagation();
										onAddNode(childKey, 'component');
									}}
								/>
							)}
							<Button
								type="text"
								size="small"
								icon={<DeleteOutlined />}
								onClick={(e) => {
									e.stopPropagation();
									onDeleteNode(childKey);
								}}
							/>
						</Space>
					),
					children: componentProperties,
				};
			}),
		};

		return [rootNode];
	};

	const handleSelect = (selectedKeys: React.Key[]) => {
		if (selectedKeys.length > 0) {
			onNodeSelect(selectedKeys[0] as string);
		}
	};

	const handleExpand = (expandedKeys: React.Key[]) => {
		onExpand?.(expandedKeys.map((key) => key.toString()));
	};

	return (
		<div className="node-tree">
			<Space style={{ marginBottom: '10px' }}>
				<Switch
					checked={filterReactNodeOnly}
					onChange={(checked) => setFilterReactNodeOnly(checked)}
					unCheckedChildren="All"
					checkedChildren="ReactNode Only"
				/>
			</Space>
			<Tree
				treeData={buildTreeData()}
				selectedKeys={selectedNode ? [selectedNode] : []}
				expandedKeys={expandedKeys}
				onSelect={handleSelect}
				onExpand={handleExpand}
				showLine
				showIcon={false}
				className="custom-tree"
			/>
		</div>
	);
};

export default NodeTree;
