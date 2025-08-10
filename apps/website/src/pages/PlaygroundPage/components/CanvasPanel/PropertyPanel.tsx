import { FC } from 'react';
import { Form, InputNumber, Input, Select, Divider } from 'antd';
import { CanvasNode } from './types';

interface PropertyPanelProps {
	node: CanvasNode | null;
	onChange: (changes: Partial<CanvasNode>) => void;
}

const PropertyPanel: FC<PropertyPanelProps> = ({ node, onChange }) => {
	if (!node) return <div className="canvas-property-panel">未选择节点</div>;

	const base = (
		<>
			<Form.Item label="名称">
				<Input
					value={node.name}
					onChange={(e) => onChange({ name: e.target.value })}
				/>
			</Form.Item>
			<Form.Item label="X">
				<InputNumber
					value={node.x}
					onChange={(v) => onChange({ x: Number(v) })}
				/>
			</Form.Item>
			<Form.Item label="Y">
				<InputNumber
					value={node.y}
					onChange={(v) => onChange({ y: Number(v) })}
				/>
			</Form.Item>
		</>
	);

	const specific = (() => {
		switch (node.type) {
			case 'rect':
			case 'ellipse':
				return (
					<>
						<Form.Item label="宽度">
							<InputNumber
								value={(node as any).width}
								onChange={(v) => onChange({ width: Number(v) } as any)}
							/>
						</Form.Item>
						<Form.Item label="高度">
							<InputNumber
								value={(node as any).height}
								onChange={(v) => onChange({ height: Number(v) } as any)}
							/>
						</Form.Item>
					</>
				);
			case 'line':
				return <div>线段属性暂不支持编辑</div>;
			case 'text':
				return (
					<>
						<Form.Item label="文字">
							<Input
								value={(node as any).text}
								onChange={(e) => onChange({ text: e.target.value } as any)}
							/>
						</Form.Item>
						<Form.Item label="字号">
							<InputNumber
								value={(node as any).fontSize}
								onChange={(v) => onChange({ fontSize: Number(v) } as any)}
							/>
						</Form.Item>
					</>
				);
		}
	})();

	return (
		<div className="canvas-property-panel">
			<Form layout="vertical">
				{base}
				<Divider />
				{specific}
			</Form>
		</div>
	);
};

export default PropertyPanel;
