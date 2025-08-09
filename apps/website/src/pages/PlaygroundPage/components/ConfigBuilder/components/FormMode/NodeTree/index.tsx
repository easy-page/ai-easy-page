import { FC, useMemo, useState } from 'react';
import { Tree, Space, Switch } from 'antd';
import { FormSchema } from '../../../../../Schema';
import { buildTreeData } from './treeBuilders';
import { TreeNode } from './types';
import './index.less';

interface NodeTreeProps {
	schema: FormSchema | null;
	selectedNode: string | null;
	onNodeSelect: (nodeId: string) => void;
	onAddNode: (parentId: string, nodeType: string) => void;
	onDeleteNode: (nodeId: string) => void;
	expandedKeys?: string[];
	onExpand?: (expandedKeys: string[]) => void;
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
	const [showReactNodeOnly, setShowReactNodeOnly] = useState(false);

	const treeData: TreeNode[] = useMemo(
		() => buildTreeData(schema, showReactNodeOnly, { onAddNode, onDeleteNode }),
		[schema, showReactNodeOnly, onAddNode, onDeleteNode]
	);

	const handleSelect = (selectedKeys: React.Key[]) => {
		if (selectedKeys.length > 0) {
			onNodeSelect(selectedKeys[0] as string);
		}
	};

	const handleExpand = (keys: React.Key[]) => {
		onExpand?.(keys.map((k) => k.toString()));
	};

	return (
		<div className="node-tree">
			<Space style={{ marginBottom: 10 }}>
				<Switch
					checked={showReactNodeOnly}
					onChange={setShowReactNodeOnly}
					unCheckedChildren="All"
					checkedChildren="ReactNode Only"
				/>
			</Space>
			<Tree
				treeData={treeData}
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
