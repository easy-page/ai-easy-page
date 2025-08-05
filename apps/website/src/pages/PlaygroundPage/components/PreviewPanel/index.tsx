import { FC } from 'react';
import { Select, Space, Button, Tooltip } from 'antd';
import {
	PlayCircleOutlined,
	EditOutlined,
	EyeOutlined,
	ReloadOutlined,
	FullscreenOutlined,
} from '@ant-design/icons';
import { FormSchema } from '../../Schema';
import SchemaEngine from '../../Engine';

const { Option } = Select;

interface PreviewPanelProps {
	previewMode: 'create' | 'edit' | 'view';
	onPreviewModeChange: (mode: 'create' | 'edit' | 'view') => void;
	schema?: FormSchema;
}

const PreviewPanel: FC<PreviewPanelProps> = ({
	previewMode,
	onPreviewModeChange,
	schema,
}) => {
	const handleRefresh = () => {
		// 刷新预览功能
		console.log('刷新预览');
	};

	const handleFullscreen = () => {
		// 全屏预览功能
		console.log('全屏预览');
	};

	const renderPreviewContent = () => {
		if (!schema || !schema.type) {
			return (
				<div className="preview-placeholder">
					<div className="placeholder-icon">
						<PlayCircleOutlined />
					</div>
					<h4>预览区域</h4>
					<p>请在左侧配置表单结构</p>
					<p>配置完成后，表单将在此处实时预览</p>
				</div>
			);
		}

		try {
			return <div className="preview-form">{SchemaEngine.render(schema)}</div>;
		} catch (error) {
			console.error('Schema 渲染错误:', error);
			return (
				<div className="preview-error">
					<h4>渲染错误</h4>
					<p>Schema 格式有误，请检查配置</p>
					<pre style={{ fontSize: '12px', color: '#ff4d4f' }}>
						{error instanceof Error ? error.message : String(error)}
					</pre>
				</div>
			);
		}
	};

	return (
		<div className="preview-container">
			<div className="preview-header">
				<div className="preview-title">
					<h3>表单预览</h3>
					<span className="preview-mode-label">
						{previewMode === 'create'
							? '创建模式'
							: previewMode === 'edit'
							? '编辑模式'
							: '查看模式'}
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
						<Tooltip title="刷新预览">
							<Button
								type="text"
								icon={<ReloadOutlined />}
								onClick={handleRefresh}
							/>
						</Tooltip>
						<Tooltip title="全屏预览">
							<Button
								type="text"
								icon={<FullscreenOutlined />}
								onClick={handleFullscreen}
							/>
						</Tooltip>
					</Space>
				</div>
			</div>
			<div className="preview-content">{renderPreviewContent()}</div>
		</div>
	);
};

export default PreviewPanel;
