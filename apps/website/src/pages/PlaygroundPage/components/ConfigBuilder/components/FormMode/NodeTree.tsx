import { FC } from 'react';
import { Tree, Button, Space, Typography } from 'antd';
import {
	PlusOutlined,
	DeleteOutlined,
	FolderOutlined,
	FileOutlined,
	CodeOutlined,
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
}

const NodeTree: FC<NodeTreeProps> = ({
	schema,
	selectedNode,
	onNodeSelect,
	onAddNode,
	onDeleteNode,
	expandedKeys = [],
	onExpand,
}) => {
	// 递归构建 ReactNodeProperty 的树节点
	const buildReactNodeTree = (
		nodeProp: ReactNodeProperty,
		parentKey: string,
		index: number
	): TreeNode => {
		const nodeKey = `${parentKey}-reactnode-${index}`;

		// 如果是 ComponentSchema 类型
		if (nodeProp.type && nodeProp.type !== 'reactNode') {
			const componentSchema = nodeProp as ComponentSchema;
			return {
				key: nodeKey,
				title: (
					<Space>
						<FileOutlined />
						<Text style={{ color: '#fff' }}>
							{componentSchema.type || 'Component'}
						</Text>
						<Button
							type="text"
							size="small"
							icon={<PlusOutlined />}
							onClick={(e) => {
								e.stopPropagation();
								onAddNode(nodeKey, 'component');
							}}
						/>
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
				children: componentSchema.children?.map((child, childIndex) =>
					buildReactNodeTree(child, nodeKey, childIndex)
				),
			};
		}

		// 如果是字符串类型的 ReactNodeProperty
		if (nodeProp.type === 'reactNode' && 'content' in nodeProp) {
			return {
				key: nodeKey,
				title: (
					<Space>
						<CodeOutlined />
						<Text style={{ color: '#fff' }}>
							JSX: {nodeProp.content.substring(0, 20)}...
						</Text>
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
			};
		}

		// 默认情况
		return {
			key: nodeKey,
			title: (
				<Space>
					<FileOutlined />
					<Text style={{ color: '#fff' }}>Unknown Node</Text>
				</Space>
			),
		};
	};

	const buildTreeData = (): TreeNode[] => {
		// 即使没有schema也显示基本的Form节点
		const formNode: TreeNode = {
			key: 'form',
			title: (
				<Space>
					<FolderOutlined />
					<Text style={{ color: '#fff' }}>Form</Text>
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
			children: [],
		};

		// 如果有schema，添加子节点
		if (schema?.properties?.children) {
			formNode.children = schema.properties.children.map(
				(child: ComponentSchema, index: number) => {
					const childNode: TreeNode = {
						key: `child-${index}`,
						title: (
							<Space>
								<FileOutlined />
								<Text style={{ color: '#fff' }}>
									{child.type || 'Component'}
								</Text>
								<Button
									type="text"
									size="small"
									icon={<PlusOutlined />}
									onClick={(e) => {
										e.stopPropagation();
										onAddNode(`child-${index}`, 'component');
									}}
								/>
								<Button
									type="text"
									size="small"
									icon={<DeleteOutlined />}
									onClick={(e) => {
										e.stopPropagation();
										onDeleteNode(`child-${index}`);
									}}
								/>
							</Space>
						),
						children: [],
					};

					// 递归处理子节点的子节点
					if (child.children && child.children.length > 0) {
						childNode.children = child.children.map(
							(grandChild: ComponentSchema, grandIndex: number) => ({
								key: `child-${index}-${grandIndex}`,
								title: (
									<Space>
										<FileOutlined />
										<Text style={{ color: '#fff' }}>
											{grandChild.type || 'Component'}
										</Text>
										<Button
											type="text"
											size="small"
											icon={<PlusOutlined />}
											onClick={(e) => {
												e.stopPropagation();
												onAddNode(`child-${index}-${grandIndex}`, 'component');
											}}
										/>
										<Button
											type="text"
											size="small"
											icon={<DeleteOutlined />}
											onClick={(e) => {
												e.stopPropagation();
												onDeleteNode(`child-${index}-${grandIndex}`);
											}}
										/>
									</Space>
								),
								children: grandChild.children?.map(
									(greatGrandChild, greatGrandIndex) =>
										buildReactNodeTree(
											greatGrandChild,
											`child-${index}-${grandIndex}`,
											greatGrandIndex
										)
								),
							})
						);
					}

					// 处理组件属性中的 ReactNodeProperty
					if (child.props) {
						const reactNodeChildren: TreeNode[] = [];
						Object.entries(child.props).forEach(([key, value]) => {
							if (value && typeof value === 'object' && 'type' in value) {
								if (
									value.type === 'reactNode' ||
									(value.type && value.type !== 'reactNode')
								) {
									reactNodeChildren.push(
										buildReactNodeTree(
											value as ReactNodeProperty,
											`child-${index}`,
											reactNodeChildren.length
										)
									);
								}
							}
						});

						if (reactNodeChildren.length > 0) {
							childNode.children = [
								...(childNode.children || []),
								...reactNodeChildren,
							];
						}
					}

					return childNode;
				}
			);
		}

		return [formNode];
	};

	const treeData = buildTreeData();

	return (
		<div className="node-tree">
			<Tree
				treeData={treeData}
				selectedKeys={selectedNode ? [selectedNode] : []}
				expandedKeys={expandedKeys}
				onSelect={(selectedKeys) => {
					if (selectedKeys.length > 0) {
						const nodeId = selectedKeys[0] as string;
						onNodeSelect(nodeId);
					} else {
						// 如果没有选中任何节点，清空选择
						onNodeSelect('');
					}
				}}
				onExpand={onExpand}
				showLine
				showIcon={false}
				className="node-tree-component"
			/>
		</div>
	);
};

export default NodeTree;
