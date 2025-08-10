import { FC } from 'react';
import { Button, Tooltip, Space, Divider } from 'antd';
import {
	SelectOutlined,
	DragOutlined,
	BorderOutlined,
	DotChartOutlined,
	MinusOutlined,
	FontSizeOutlined,
	ZoomInOutlined,
	ZoomOutOutlined,
	RedoOutlined,
	UndoOutlined,
	DeleteOutlined,
} from '@ant-design/icons';
import { ToolType } from './types';

interface ToolbarProps {
	tool: ToolType;
	onChangeTool: (tool: ToolType) => void;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onUndo: () => void;
	onRedo: () => void;
	onClear: () => void;
}

const Toolbar: FC<ToolbarProps> = ({
	tool,
	onChangeTool,
	onZoomIn,
	onZoomOut,
	onUndo,
	onRedo,
	onClear,
}) => {
	return (
		<div className="canvas-toolbar">
			<Space>
				<Tooltip title="选择">
					<Button
						type={tool === 'select' ? 'primary' : 'default'}
						icon={<SelectOutlined />}
						onClick={() => onChangeTool('select')}
					/>
				</Tooltip>
				<Tooltip title="拖拽画布">
					<Button
						type={tool === 'pan' ? 'primary' : 'default'}
						icon={<DragOutlined />}
						onClick={() => onChangeTool('pan')}
					/>
				</Tooltip>
				<Divider type="vertical" />
				<Tooltip title="矩形">
					<Button
						type={tool === 'rect' ? 'primary' : 'default'}
						icon={<BorderOutlined />}
						onClick={() => onChangeTool('rect')}
					/>
				</Tooltip>
				<Tooltip title="圆形">
					<Button
						type={tool === 'ellipse' ? 'primary' : 'default'}
						icon={<DotChartOutlined />}
						onClick={() => onChangeTool('ellipse')}
					/>
				</Tooltip>
				<Tooltip title="直线">
					<Button
						type={tool === 'line' ? 'primary' : 'default'}
						icon={<MinusOutlined />}
						onClick={() => onChangeTool('line')}
					/>
				</Tooltip>
				<Tooltip title="文字">
					<Button
						type={tool === 'text' ? 'primary' : 'default'}
						icon={<FontSizeOutlined />}
						onClick={() => onChangeTool('text')}
					/>
				</Tooltip>
				<Divider type="vertical" />
				<Tooltip title="放大">
					<Button icon={<ZoomInOutlined />} onClick={onZoomIn} />
				</Tooltip>
				<Tooltip title="缩小">
					<Button icon={<ZoomOutOutlined />} onClick={onZoomOut} />
				</Tooltip>
				<Divider type="vertical" />
				<Tooltip title="撤销">
					<Button icon={<UndoOutlined />} onClick={onUndo} />
				</Tooltip>
				<Tooltip title="重做">
					<Button icon={<RedoOutlined />} onClick={onRedo} />
				</Tooltip>
				<Tooltip title="清空">
					<Button danger icon={<DeleteOutlined />} onClick={onClear} />
				</Tooltip>
			</Space>
		</div>
	);
};

export default Toolbar;
