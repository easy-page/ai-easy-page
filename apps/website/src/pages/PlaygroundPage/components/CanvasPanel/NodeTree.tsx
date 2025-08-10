import { FC, useMemo } from 'react';
import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { CanvasNode } from './types';

interface NodeTreeProps {
	nodes: CanvasNode[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}

const NodeTree: FC<NodeTreeProps> = ({ nodes, selectedId, onSelect }) => {
	const treeData = useMemo<DataNode[]>(() => {
		return nodes.map((n) => ({
			key: n.id,
			title: `${n.type} (${n.name || n.id})`,
		}));
	}, [nodes]);

	return (
		<div className="canvas-node-tree">
			<Tree
				height={300}
				selectedKeys={selectedId ? [selectedId] : []}
				onSelect={(keys) => keys[0] && onSelect(String(keys[0]))}
				treeData={treeData}
			/>
		</div>
	);
};

export default NodeTree;
