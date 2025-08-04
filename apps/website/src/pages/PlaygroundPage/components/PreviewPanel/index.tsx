import { FC } from 'react';
import { Select, Space, Divider } from 'antd';
import {
	PlayCircleOutlined,
	EditOutlined,
	EyeOutlined,
} from '@ant-design/icons';

const { Option } = Select;

interface PreviewPanelProps {
	previewMode: 'create' | 'edit' | 'view';
	onPreviewModeChange: (mode: 'create' | 'edit' | 'view') => void;
}

const PreviewPanel: FC<PreviewPanelProps> = ({
	previewMode,
	onPreviewModeChange,
}) => {
	return (
		<div className="preview-container">
			<div className="preview-header">
				<div className="preview-title">
					<h3>表单预览</h3>
					<span className="preview-mode-label">
						当前模式：
						{previewMode === 'create'
							? '创建'
							: previewMode === 'edit'
							? '编辑'
							: '查看'}
					</span>
				</div>
				<div className="preview-toolbar">
					<Space>
						<Select
							value={previewMode}
							onChange={onPreviewModeChange}
							style={{ width: 120 }}
						>
							<Option value="create">
								<PlayCircleOutlined /> 创建
							</Option>
							<Option value="edit">
								<EditOutlined /> 编辑
							</Option>
							<Option value="view">
								<EyeOutlined /> 查看
							</Option>
						</Select>
					</Space>
				</div>
			</div>
			<Divider style={{ margin: '16px 0' }} />
			<div className="preview-content">
				<div className="preview-placeholder">
					<div className="placeholder-icon">
						<PlayCircleOutlined style={{ fontSize: 48, color: '#1890ff' }} />
					</div>
					<h4>预览区域</h4>
					<p>请在左侧配置表单结构</p>
				</div>
			</div>
		</div>
	);
};

export default PreviewPanel;
