import { useCallback, useMemo, useRef, useState } from 'react';
import {
	CanvasNode,
	CanvasState,
	Operation,
	ToolType,
	createDefaultViewport,
	generateNodeName,
} from './types';

export function useCanvasState(initialNodes: CanvasNode[] = []): {
	state: CanvasState;
	setTool: (tool: ToolType) => void;
	addNode: (node: CanvasNode) => void;
	updateNode: (id: string, changes: Partial<CanvasNode>) => void;
	deleteNode: (id: string) => void;
	selectNode: (id: string | null) => void;
	setViewport: (next: Partial<CanvasState['viewport']>) => void;
	zoomIn: () => void;
	zoomOut: () => void;
	undo: () => void;
	redo: () => void;
	clear: () => void;
} {
	const [state, setState] = useState<CanvasState>(() => ({
		nodes: initialNodes,
		selectedId: null,
		tool: 'select',
		viewport: createDefaultViewport(),
		history: [],
		future: [],
	}));

	const commit = useCallback((op: Operation) => {
		setState((prev) => ({ ...applyOperation(prev, op), future: [] }));
	}, []);

	const setTool = useCallback((tool: ToolType) => {
		setState((prev) => ({ ...prev, tool }));
	}, []);

	const addNode = useCallback(
		(node: CanvasNode) => {
			commit({ opType: 'create', node });
		},
		[commit]
	);

	const updateNode = useCallback(
		(id: string, changes: Partial<CanvasNode>) => {
			commit({ opType: 'update', id, changes });
		},
		[commit]
	);

	const deleteNode = useCallback(
		(id: string) => {
			commit({ opType: 'delete', id });
		},
		[commit]
	);

	const selectNode = useCallback((id: string | null) => {
		setState((prev) => ({ ...prev, selectedId: id }));
	}, []);

	const setViewport = useCallback((next: Partial<CanvasState['viewport']>) => {
		setState((prev) => ({ ...prev, viewport: { ...prev.viewport, ...next } }));
	}, []);

	const zoomIn = useCallback(() => {
		setState((prev) => ({
			...prev,
			viewport: {
				...prev.viewport,
				scale: Math.min(8, prev.viewport.scale * 1.1),
			},
		}));
	}, []);

	const zoomOut = useCallback(() => {
		setState((prev) => ({
			...prev,
			viewport: {
				...prev.viewport,
				scale: Math.max(0.2, prev.viewport.scale / 1.1),
			},
		}));
	}, []);

	const undo = useCallback(() => {
		setState((prev) => undoState(prev));
	}, []);

	const redo = useCallback(() => {
		setState((prev) => redoState(prev));
	}, []);

	const clear = useCallback(() => {
		setState((prev) => ({ ...prev, nodes: [], selectedId: null }));
	}, []);

	return {
		state,
		setTool,
		addNode,
		updateNode,
		deleteNode,
		selectNode,
		setViewport,
		zoomIn,
		zoomOut,
		undo,
		redo,
		clear,
	};
}

function applyOperation(prev: CanvasState, op: Operation): CanvasState {
	switch (op.opType) {
		case 'create':
			return {
				...prev,
				nodes: [...prev.nodes, op.node],
				history: [...prev.history, op],
			};
		case 'update':
			return {
				...prev,
				nodes: prev.nodes.map((n) =>
					n.id === op.id ? { ...n, ...op.changes } : n
				),
				history: [...prev.history, op],
			};
		case 'delete':
			return {
				...prev,
				nodes: prev.nodes.filter((n) => n.id !== op.id),
				history: [...prev.history, op],
				selectedId: prev.selectedId === op.id ? null : prev.selectedId,
			};
		case 'reorder': {
			const index = prev.nodes.findIndex((n) => n.id === op.id);
			if (index < 0) return prev;
			const newNodes = prev.nodes.slice();
			const [spliced] = newNodes.splice(index, 1);
			newNodes.splice(op.toIndex, 0, spliced);
			return { ...prev, nodes: newNodes, history: [...prev.history, op] };
		}
		default:
			return prev;
	}
}

function undoState(prev: CanvasState): CanvasState {
	const last = prev.history[prev.history.length - 1];
	if (!last) return prev;
	let next: CanvasState = prev;
	if (last.opType === 'create') {
		next = { ...next, nodes: next.nodes.filter((n) => n.id !== last.node.id) };
	} else if (last.opType === 'update') {
		// We do not store before/after; simple strategy: no-op undo for update.
		// For production, maintain inverse ops.
	} else if (last.opType === 'delete') {
		// cannot restore without snapshot; ignored in this minimal version
	} else if (last.opType === 'reorder') {
		// not supported in minimal undo
	}
	return {
		...next,
		history: prev.history.slice(0, -1),
		future: [last, ...prev.future],
	};
}

function redoState(prev: CanvasState): CanvasState {
	const nextOp = prev.future[0];
	if (!nextOp) return prev;
	const applied = applyOperation(
		{ ...prev, future: prev.future.slice(1) },
		nextOp
	);
	return applied;
}
