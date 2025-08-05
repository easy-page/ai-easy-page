import { FC } from 'react';
import { Tree, Button, Space, Typography } from 'antd';
import {
	PlusOutlined,
	DeleteOutlined,
	FolderOutlined,
	FileOutlined,
} from '@ant-design/icons';
import { FormSchema, ComponentSchema } from '../../../../Schema';

const { Text } = Typography;

interface NodeTreeProps {
	schema: FormSchema | null;
	selectedNode: string | null;
	onNodeSelect: (nodeId: string) => void;
	onAddNode: (parentId: string, nodeType: string) => void;
	onDeleteNode: (nodeId: string) => void;
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
}) => {
	const buildTreeData = (): TreeNode[] => {
		if (!schema) return [];

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

		// 添加子节点
		if (schema.properties?.children) {
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
							})
						);
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
				onSelect={(selectedKeys) => {
					if (selectedKeys.length > 0) {
						onNodeSelect(selectedKeys[0] as string);
					}
				}}
				showLine
				showIcon={false}
			/>
		</div>
	);
};

export default NodeTree;
