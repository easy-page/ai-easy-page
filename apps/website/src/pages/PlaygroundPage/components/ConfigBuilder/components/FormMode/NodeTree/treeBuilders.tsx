import { Space, Typography, Badge, Button } from 'antd';
import {
	PlusOutlined,
	DeleteOutlined,
	FolderOutlined,
	FileOutlined,
	CodeOutlined,
	SettingOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';
import { FormSchema, ComponentSchema } from '../../../../../Schema';
import { ReactNodeProperty } from '../../../../../Schema/specialProperties';
import { BuildActions, TreeNode } from './types';
import {
	canAddChildren,
	isReactNodeProperty,
	supportsArrayProps,
} from './utils';

const { Text } = Typography;

const buildReactNodeTree = (
	nodeProp: ReactNodeProperty,
	parentKey: string,
	index: number,
	propertyPath: string,
	actions: BuildActions
): TreeNode => {
	const nodeKey = `${parentKey}-reactnode-${index}`;
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
							actions.onDeleteNode(nodeKey);
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

const buildComponentPropertiesTree = (
	component: ComponentSchema,
	parentKey: string,
	propertyPath: string,
	showReactNodeOnly: boolean,
	actions: BuildActions
): TreeNode[] => {
	const properties: TreeNode[] = [];
	Object.entries((component as any).props || {}).forEach(([key, value]) => {
		const propKey = `${parentKey}-prop-${key}`;
		const currentPropertyPath = `${propertyPath}.props.${key}`;

		if (
			!showReactNodeOnly ||
			isReactNodeProperty(value) ||
			(value &&
				typeof value === 'object' &&
				'type' in value &&
				(value as any).type !== 'reactNode')
		) {
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
									actions.onAddNode(propKey, 'array-item');
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

						if (isReactNodeProperty(item)) {
							return buildReactNodeTree(
								item,
								itemKey,
								0,
								itemPropertyPath,
								actions
							);
						}
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
												actions.onDeleteNode(itemKey);
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
									if (Array.isArray(rowValue)) {
										return {
											key: rowPropKey,
											title: (
												<Space>
													<UnorderedListOutlined style={{ color: '#722ed1' }} />
													<Text style={{ color: '#fff' }}>{rowKey}</Text>
													<Badge count={rowValue.length} size="small" />
													<Button
														type="text"
														size="small"
														icon={<PlusOutlined />}
														onClick={(e) => {
															e.stopPropagation();
															actions.onAddNode(rowPropKey, 'array-item');
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
														fieldPath,
														actions
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
															<Text type="secondary" style={{ fontSize: 12 }}>
																{typeof fieldItem}
															</Text>
															<Button
																type="text"
																size="small"
																icon={<DeleteOutlined />}
																onClick={(e) => {
																	e.stopPropagation();
																	actions.onDeleteNode(fieldKey);
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
									return {
										key: rowPropKey,
										title: (
											<Space>
												<SettingOutlined style={{ color: '#722ed1' }} />
												<Text style={{ color: '#fff' }}>{rowKey}</Text>
												<Text type="secondary" style={{ fontSize: 12 }}>
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
						return {
							key: itemKey,
							title: (
								<Space>
									<SettingOutlined style={{ color: '#722ed1' }} />
									<Text style={{ color: '#fff' }}>Item {index + 1}</Text>
									<Text type="secondary" style={{ fontSize: 12 }}>
										{typeof item}
									</Text>
									<Button
										type="text"
										size="small"
										icon={<DeleteOutlined />}
										onClick={(e) => {
											e.stopPropagation();
											actions.onDeleteNode(itemKey);
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
			} else if (isReactNodeProperty(value)) {
				properties.push(
					buildReactNodeTree(value, propKey, 0, currentPropertyPath, actions)
				);
			} else if (
				value &&
				typeof value === 'object' &&
				'type' in value &&
				(value as any).type !== 'reactNode'
			) {
				const componentSchema = value as ComponentSchema;
				const canHaveChildren = canAddChildren(componentSchema);
				properties.push({
					key: propKey,
					title: (
						<Space>
							<FileOutlined style={{ color: '#1890ff' }} />
							<Text style={{ color: '#fff' }}>
								【{key}】{(componentSchema as any).type || 'Component'}
							</Text>
							{canHaveChildren && (
								<Badge
									count={(componentSchema as any).children?.length || 0}
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
										actions.onAddNode(propKey, 'component');
									}}
								/>
							)}
							<Button
								type="text"
								size="small"
								icon={<DeleteOutlined />}
								onClick={(e) => {
									e.stopPropagation();
									actions.onDeleteNode(propKey);
								}}
							/>
						</Space>
					),
					isProperty: true,
					propertyPath: currentPropertyPath,
					nodeType: 'component',
					children: canHaveChildren
						? (componentSchema as any).children?.map(
								(child: any, childIndex: number) => {
									if (isReactNodeProperty(child)) {
										return buildReactNodeTree(
											child,
											propKey,
											childIndex,
											`${currentPropertyPath}.children.${childIndex}`,
											actions
										);
									}
									return {
										key: `${propKey}-child-${childIndex}`,
										title: (
											<Space>
												<FileOutlined style={{ color: '#1890ff' }} />
												<Text style={{ color: '#fff' }}>
													{(child as any).type || 'Component'}
												</Text>
											</Space>
										),
										isProperty: true,
										propertyPath: `${currentPropertyPath}.children.${childIndex}`,
										nodeType: 'component',
									};
								}
						  )
						: undefined,
				});
			} else {
				properties.push({
					key: propKey,
					title: (
						<Space>
							<SettingOutlined style={{ color: '#722ed1' }} />
							<Text style={{ color: '#fff' }}>{key}</Text>
							<Text type="secondary" style={{ fontSize: 12 }}>
								{typeof value}
							</Text>
						</Space>
					),
					isProperty: true,
					propertyPath: currentPropertyPath,
					nodeType: 'property',
				});
			}
		} else {
			if (Array.isArray(value)) {
				const hasReactNodeItems = value.some((item) => {
					if (isReactNodeProperty(item)) return true;
					if (item && typeof item === 'object' && !('type' in item)) {
						const obj = item as Record<string, any>;
						return Object.values(obj).some(
							(val) =>
								Array.isArray(val) &&
								(val as any[]).some((subItem) => isReactNodeProperty(subItem))
						);
					}
					return false;
				});
				if (hasReactNodeItems) {
					const arrayChildren = (value as unknown[])
						.map((item, index) => {
							const itemKey = `${propKey}-item-${index}`;
							const itemPropertyPath = `${currentPropertyPath}.${index}`;
							if (isReactNodeProperty(item)) {
								return buildReactNodeTree(
									item,
									itemKey,
									0,
									itemPropertyPath,
									actions
								);
							}
							if (item && typeof item === 'object' && !('type' in item)) {
								const rowObj = item as Record<string, any>;
								const reactNodeFields = Object.entries(rowObj).filter(
									([, rowValue]) =>
										Array.isArray(rowValue) &&
										(rowValue as any[]).some((subItem) =>
											isReactNodeProperty(subItem)
										)
								);
								if (reactNodeFields.length > 0) {
									const children: TreeNode[] = [];
									reactNodeFields.forEach(([rowKey, rowValue]) => {
										const rowPropKey = `${itemKey}-rowprop-${rowKey}`;
										const rowPropPath = `${itemPropertyPath}.${rowKey}`;
										if (Array.isArray(rowValue)) {
											const fieldChildren: TreeNode[] = [];
											(rowValue as any[]).forEach((fieldItem, fieldIndex) => {
												const fieldKey = `${rowPropKey}-field-${fieldIndex}`;
												const fieldPath = `${rowPropPath}.${fieldIndex}`;
												if (isReactNodeProperty(fieldItem)) {
													fieldChildren.push(
														buildReactNodeTree(
															fieldItem,
															fieldKey,
															0,
															fieldPath,
															actions
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
															<Text style={{ color: '#fff' }}>{rowKey}</Text>
															<Badge
																count={(rowValue as any[]).length}
																size="small"
															/>
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
													<Text style={{ color: '#fff' }}>Row {index + 1}</Text>
												</Space>
											),
											isProperty: true,
											propertyPath: itemPropertyPath,
											nodeType: 'property',
											children,
										};
									}
								}
								return null;
							}
							return null;
						})
						.filter((item): item is TreeNode => item !== null);

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
						children: arrayChildren,
					});
				}
			} else if (isReactNodeProperty(value)) {
				properties.push(
					buildReactNodeTree(value, propKey, 0, currentPropertyPath, actions)
				);
			}
		}
	});

	return properties;
};

export const buildTreeData = (
	schema: FormSchema | null,
	showReactNodeOnly: boolean,
	actions: BuildActions
): TreeNode[] => {
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
						actions.onAddNode('form', 'component');
					}}
				/>
			</Space>
		),
		children: (schema.properties?.children || []).map((child, index) => {
			const childKey = `child-${index}`;
			const childPropertyPath = `properties.children.${index}`;
			const componentProperties = buildComponentPropertiesTree(
				child,
				childKey,
				childPropertyPath,
				showReactNodeOnly,
				actions
			);
			const canHaveChildrenFlag = canAddChildren(child);
			const canHaveArrayProps = supportsArrayProps(child.type);
			return {
				key: childKey,
				title: (
					<Space>
						<FileOutlined style={{ color: '#1890ff' }} />
						<Text style={{ color: '#fff' }}>{child.type || 'Component'}</Text>
						{canHaveChildrenFlag && (
							<Badge
								count={(child as any).children?.length || 0}
								size="small"
							/>
						)}
						{canHaveArrayProps && componentProperties.length > 0 && (
							<Badge
								count={componentProperties.length}
								size="small"
								style={{ backgroundColor: '#722ed1' }}
							/>
						)}
						{canHaveChildrenFlag && (
							<Button
								type="text"
								size="small"
								icon={<PlusOutlined />}
								onClick={(e) => {
									e.stopPropagation();
									actions.onAddNode(childKey, 'component');
								}}
							/>
						)}
						<Button
							type="text"
							size="small"
							icon={<DeleteOutlined />}
							onClick={(e) => {
								e.stopPropagation();
								actions.onDeleteNode(childKey);
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
