import { FC, useMemo } from 'react';
import { Layout, Card } from 'antd';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import NodeTree from './NodeTree';
import PropertyPanel from './PropertyPanel';
import { useCanvasState } from './state';
import { CanvasNode } from './types';
import './index.less';

const { Sider, Content } = Layout;

const CanvasPanel: FC = () => {
	const {
		state,
		setTool,
		addNode,
		selectNode,
		setViewport,
		zoomIn,
		zoomOut,
		undo,
		redo,
		clear,
		updateNode,
	} = useCanvasState([]);

	const selectedNode: CanvasNode | null = useMemo(
		() => state.nodes.find((n) => n.id === state.selectedId) || null,
		[state.nodes, state.selectedId]
	);

	return (
		<div className="canvas-panel">
			<div className="canvas-panel-toolbar">
				<Toolbar
					tool={state.tool}
					onChangeTool={setTool}
					onZoomIn={zoomIn}
					onZoomOut={zoomOut}
					onUndo={undo}
					onRedo={redo}
					onClear={clear}
				/>
			</div>
			<Layout className="canvas-panel-layout">
				<Sider width={260} className="canvas-left">
					<Card className="canvas-card" title="节点树">
						<NodeTree
							nodes={state.nodes}
							selectedId={state.selectedId}
							onSelect={selectNode}
						/>
					</Card>
				</Sider>
				<Content className="canvas-center">
					<Card className="canvas-card" bodyStyle={{ padding: 0 }}>
						<Canvas
							nodes={state.nodes}
							selectedId={state.selectedId}
							tool={state.tool}
							viewport={state.viewport}
							onCreateNode={(node) => addNode(node)}
							onSelectNode={selectNode}
							onViewportChange={(next) => setViewport(next)}
						/>
					</Card>
				</Content>
				<Sider width={280} className="canvas-right">
					<Card className="canvas-card" title="属性">
						<PropertyPanel
							node={selectedNode}
							onChange={(changes) => {
								if (selectedNode) {
									updateNode(selectedNode.id, changes as any);
								}
							}}
						/>
					</Card>
				</Sider>
			</Layout>
		</div>
	);
};

export default CanvasPanel;
