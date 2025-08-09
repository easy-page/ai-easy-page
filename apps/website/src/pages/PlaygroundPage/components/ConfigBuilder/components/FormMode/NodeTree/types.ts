import { ReactNode } from 'react';

export interface TreeNode {
	key: string;
	title: ReactNode;
	children?: TreeNode[];
	isProperty?: boolean;
	propertyPath?: string;
	nodeType?: 'component' | 'property' | 'array' | 'reactNode';
}

export interface BuildActions {
	onAddNode: (parentId: string, nodeType: string) => void;
	onDeleteNode: (nodeId: string) => void;
}
