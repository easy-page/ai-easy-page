import { FC, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import {
	CanvasNode,
	LineNode,
	RectNode,
	EllipseNode,
	TextNode,
	ViewportState,
	ToolType,
	worldToScreen,
	screenToWorld,
} from './types';

interface CanvasProps {
	nodes: CanvasNode[];
	selectedId: string | null;
	tool: ToolType;
	viewport: ViewportState;
	onCreateNode: (node: CanvasNode) => void;
	onSelectNode: (id: string | null) => void;
	onViewportChange: (next: ViewportState) => void;
}

const CANVAS_BG = '#1a1a1a';

const Canvas: FC<CanvasProps> = ({
	nodes,
	selectedId,
	tool,
	viewport,
	onCreateNode,
	onSelectNode,
	onViewportChange,
}) => {
	const ref = useRef<HTMLCanvasElement | null>(null);
	const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
		null
	);
	const [tempNode, setTempNode] = useState<CanvasNode | null>(null);

	// Render loop
	useEffect(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		canvas.width = Math.floor(rect.width * dpr);
		canvas.height = Math.floor(rect.height * dpr);
		ctx.scale(dpr, dpr);
		ctx.clearRect(0, 0, rect.width, rect.height);

		// background
		ctx.fillStyle = CANVAS_BG;
		ctx.fillRect(0, 0, rect.width, rect.height);

		// draw grid
		drawGrid(ctx, rect.width, rect.height, viewport);

		const drawNode = (node: CanvasNode) => {
			switch (node.type) {
				case 'rect':
					drawRect(ctx, node, viewport, node.id === selectedId);
					break;
				case 'ellipse':
					drawEllipse(ctx, node, viewport, node.id === selectedId);
					break;
				case 'line':
					drawLine(ctx, node, viewport, node.id === selectedId);
					break;
				case 'text':
					drawText(ctx, node, viewport, node.id === selectedId);
					break;
			}
		};

		nodes.forEach(drawNode);
		if (tempNode) drawNode(tempNode);
	}, [nodes, tempNode, selectedId, viewport]);

	function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
		e.preventDefault();
		const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
		const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		const worldBefore = screenToWorld(mouseX, mouseY, viewport);
		const nextScale = Math.min(8, Math.max(0.2, viewport.scale * scaleFactor));
		const nextViewport = { ...viewport, scale: nextScale };
		const screenAfter = worldToScreen(
			worldBefore.x,
			worldBefore.y,
			nextViewport
		);
		nextViewport.offsetX += mouseX - screenAfter.x;
		nextViewport.offsetY += mouseY - screenAfter.y;
		onViewportChange(nextViewport);
	}

	function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
		const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
		const start = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		setDragStart(start);

		if (tool === 'pan') return;

		const world = screenToWorld(start.x, start.y, viewport);
		if (tool === 'rect') {
			setTempNode({
				id: `rect_${Date.now()}`,
				type: 'rect',
				name: 'Rect',
				x: world.x,
				y: world.y,
				width: 1,
				height: 1,
				fill: 'rgba(0, 255, 255, 0.15)',
				stroke: '#00FFFF',
				strokeWidth: 1,
			} as RectNode);
		} else if (tool === 'ellipse') {
			setTempNode({
				id: `ellipse_${Date.now()}`,
				type: 'ellipse',
				name: 'Ellipse',
				x: world.x,
				y: world.y,
				width: 1,
				height: 1,
				fill: 'rgba(0, 255, 255, 0.15)',
				stroke: '#00FFFF',
				strokeWidth: 1,
			} as EllipseNode);
		} else if (tool === 'line') {
			setTempNode({
				id: `line_${Date.now()}`,
				type: 'line',
				name: 'Line',
				x: world.x,
				y: world.y,
				points: [world, world],
				stroke: '#00FFFF',
				strokeWidth: 1,
			} as LineNode);
		} else if (tool === 'text') {
			const text = prompt('输入文字');
			if (text) {
				onCreateNode({
					id: `text_${Date.now()}`,
					type: 'text',
					name: 'Text',
					x: world.x,
					y: world.y,
					text,
					fontSize: 14,
					color: '#FFFFFF',
				} as TextNode);
			}
			setDragStart(null);
		}
	}

	function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
		if (!dragStart) return;
		const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
		const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		if (tool === 'pan') {
			onViewportChange({
				...viewport,
				offsetX: viewport.offsetX + (pos.x - dragStart.x),
				offsetY: viewport.offsetY + (pos.y - dragStart.y),
			});
			setDragStart(pos);
			return;
		}
		const startWorld = screenToWorld(dragStart.x, dragStart.y, viewport);
		const curWorld = screenToWorld(pos.x, pos.y, viewport);
		if (tempNode?.type === 'rect') {
			setTempNode({
				...tempNode,
				width: curWorld.x - startWorld.x,
				height: curWorld.y - startWorld.y,
			} as RectNode);
		} else if (tempNode?.type === 'ellipse') {
			setTempNode({
				...tempNode,
				width: curWorld.x - startWorld.x,
				height: curWorld.y - startWorld.y,
			} as EllipseNode);
		} else if (tempNode?.type === 'line') {
			setTempNode({
				...tempNode,
				points: [startWorld, curWorld],
			} as LineNode);
		}
	}

	function handleMouseUp() {
		if (tempNode) {
			// normalize width/height positive
			if (tempNode.type === 'rect' || tempNode.type === 'ellipse') {
				const normalized = normalizeRectLike(tempNode);
				onCreateNode(normalized as CanvasNode);
			} else if (tempNode.type === 'line') {
				onCreateNode(tempNode);
			}
		}
		setTempNode(null);
		setDragStart(null);
	}

	return (
		<div className="canvas-stage">
			<canvas
				ref={ref}
				className="canvas"
				onWheel={handleWheel}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
			/>
		</div>
	);
};

export default Canvas;

// Helpers
function drawGrid(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	viewport: ViewportState
) {
	const spacing = 40 * viewport.scale;
	ctx.save();
	ctx.strokeStyle = 'rgba(0,255,255,0.12)';
	ctx.lineWidth = 1;
	const startX = (-viewport.offsetX % spacing) + 0.5; // crisp lines
	const startY = (-viewport.offsetY % spacing) + 0.5;
	for (let x = startX; x < width; x += spacing) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, height);
		ctx.stroke();
	}
	for (let y = startY; y < height; y += spacing) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(width, y);
		ctx.stroke();
	}
	ctx.restore();
}

function drawRect(
	ctx: CanvasRenderingContext2D,
	node: RectNode,
	viewport: ViewportState,
	isSelected: boolean
) {
	const { x, y } = worldToScreen(node.x, node.y, viewport);
	const w = node.width * viewport.scale;
	const h = node.height * viewport.scale;
	ctx.save();
	if (node.fill) {
		ctx.fillStyle = node.fill;
		ctx.fillRect(x, y, w, h);
	}
	if (node.stroke) {
		ctx.strokeStyle = node.stroke;
		ctx.lineWidth = (node.strokeWidth || 1) * viewport.scale;
		ctx.strokeRect(x, y, w, h);
	}
	if (isSelected) {
		ctx.strokeStyle = '#40a9ff';
		ctx.setLineDash([4, 2]);
		ctx.strokeRect(x, y, w, h);
	}
	ctx.restore();
}

function drawEllipse(
	ctx: CanvasRenderingContext2D,
	node: EllipseNode,
	viewport: ViewportState,
	isSelected: boolean
) {
	const { x, y } = worldToScreen(node.x, node.y, viewport);
	const w = node.width * viewport.scale;
	const h = node.height * viewport.scale;
	ctx.save();
	ctx.beginPath();
	ctx.ellipse(
		x + w / 2,
		y + h / 2,
		Math.abs(w / 2),
		Math.abs(h / 2),
		0,
		0,
		Math.PI * 2
	);
	if (node.fill) {
		ctx.fillStyle = node.fill;
		ctx.fill();
	}
	if (node.stroke) {
		ctx.strokeStyle = node.stroke;
		ctx.lineWidth = (node.strokeWidth || 1) * viewport.scale;
		ctx.stroke();
	}
	if (isSelected) {
		ctx.setLineDash([4, 2]);
		ctx.strokeStyle = '#40a9ff';
		ctx.stroke();
	}
	ctx.restore();
}

function drawLine(
	ctx: CanvasRenderingContext2D,
	node: LineNode,
	viewport: ViewportState,
	isSelected: boolean
) {
	if (node.points.length < 2) return;
	ctx.save();
	ctx.beginPath();
	const first = worldToScreen(node.points[0].x, node.points[0].y, viewport);
	ctx.moveTo(first.x, first.y);
	for (let i = 1; i < node.points.length; i++) {
		const p = worldToScreen(node.points[i].x, node.points[i].y, viewport);
		ctx.lineTo(p.x, p.y);
	}
	ctx.strokeStyle = node.stroke || '#00FFFF';
	ctx.lineWidth = (node.strokeWidth || 1) * viewport.scale;
	ctx.stroke();
	if (isSelected) {
		ctx.setLineDash([4, 2]);
		ctx.strokeStyle = '#40a9ff';
		ctx.stroke();
	}
	ctx.restore();
}

function drawText(
	ctx: CanvasRenderingContext2D,
	node: TextNode,
	viewport: ViewportState,
	isSelected: boolean
) {
	const { x, y } = worldToScreen(node.x, node.y, viewport);
	ctx.save();
	ctx.fillStyle = node.color || '#FFFFFF';
	ctx.font = `${(node.fontSize || 14) * viewport.scale}px sans-serif`;
	ctx.fillText(node.text, x, y);
	if (isSelected) {
		ctx.strokeStyle = '#40a9ff';
		ctx.setLineDash([4, 2]);
		const metrics = ctx.measureText(node.text);
		const width = metrics.width;
		const height = (node.fontSize || 14) * viewport.scale;
		ctx.strokeRect(x - 2, y - height, width + 4, height + 4);
	}
	ctx.restore();
}

function normalizeRectLike(node: RectNode | EllipseNode) {
	const x = Math.min(node.x, node.x + node.width);
	const y = Math.min(node.y, node.y + node.height);
	const w = Math.abs(node.width);
	const h = Math.abs(node.height);
	return { ...node, x, y, width: w, height: h };
}
