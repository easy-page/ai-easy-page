export type ToolType = 'select' | 'pan' | 'rect' | 'ellipse' | 'line' | 'text';

export interface ViewportState {
	scale: number; // zoom factor
	offsetX: number; // world-to-screen translate X
	offsetY: number; // world-to-screen translate Y
}

export interface BaseNode {
	id: string;
	name: string;
	type: CanvasNodeType;
	x: number;
	y: number;
	rotation?: number;
	zIndex?: number;
	hidden?: boolean;
	locked?: boolean;
}

export type CanvasNodeType = 'rect' | 'ellipse' | 'line' | 'text';

export interface RectNode extends BaseNode {
	type: 'rect';
	width: number;
	height: number;
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	cornerRadius?: number;
}

export interface EllipseNode extends BaseNode {
	type: 'ellipse';
	width: number; // radiusX * 2 in world units
	height: number; // radiusY * 2 in world units
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
}

export interface LineNode extends BaseNode {
	type: 'line';
	points: Array<{ x: number; y: number }>; // polyline; at least 2 points
	stroke?: string;
	strokeWidth?: number;
}

export interface TextNode extends BaseNode {
	type: 'text';
	text: string;
	fontSize?: number;
	color?: string;
}

export type CanvasNode = RectNode | EllipseNode | LineNode | TextNode;

export type Operation =
	| { opType: 'create'; node: CanvasNode }
	| { opType: 'update'; id: string; changes: Partial<CanvasNode> }
	| { opType: 'delete'; id: string }
	| { opType: 'reorder'; id: string; toIndex: number };

export interface CanvasState {
	nodes: CanvasNode[];
	selectedId: string | null;
	tool: ToolType;
	viewport: ViewportState;
	history: Operation[];
	future: Operation[]; // for redo
}

export function createDefaultViewport(): ViewportState {
	return { scale: 1, offsetX: 0, offsetY: 0 };
}

export function generateNodeName(type: CanvasNodeType, index: number): string {
	const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
	return `${capitalized} ${index}`;
}

export function worldToScreen(
	x: number,
	y: number,
	viewport: ViewportState
): { x: number; y: number } {
	return {
		x: x * viewport.scale + viewport.offsetX,
		y: y * viewport.scale + viewport.offsetY,
	};
}

export function screenToWorld(
	x: number,
	y: number,
	viewport: ViewportState
): { x: number; y: number } {
	return {
		x: (x - viewport.offsetX) / viewport.scale,
		y: (y - viewport.offsetY) / viewport.scale,
	};
}
