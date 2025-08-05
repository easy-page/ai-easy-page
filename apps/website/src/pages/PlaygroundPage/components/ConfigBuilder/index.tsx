import { FC, useState } from 'react';
import { Button, Card, Space, Typography, Divider, message } from 'antd';
import {
	CodeOutlined,
	FileAddOutlined,
	FormOutlined,
	ArrowLeftOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { SCHEMA_TEMPLATES, FormSchema } from '../../Schema';

const { Title, Text } = Typography;

interface ConfigBuilderProps {
	onSchemaChange?: (schema: FormSchema) => void;
}

const ConfigBuilder: FC<ConfigBuilderProps> = ({ onSchemaChange }) => {
	const [currentSchema, setCurrentSchema] = useState<FormSchema | null>(null);
	const [buildMode, setBuildMode] = useState<'select' | 'form' | 'page'>(
		'select'
	);

	const handleCreateForm = () => {
		const formSchema = SCHEMA_TEMPLATES.EMPTY_FORM;
		setCurrentSchema(formSchema);
		setBuildMode('form');
		onSchemaChange?.(formSchema);
		message.success('已创建基础表单结构');
	};

	const handleCreatePage = () => {
		// 暂时空着，后续实现
		setBuildMode('page');
		message.info('页面配置功能暂未实现，敬请期待...');
	};

	const handleBackToSelect = () => {
		setBuildMode('select');
		setCurrentSchema(null);
		onSchemaChange?.({} as FormSchema);
	};

	const handleImportConfig = () => {
		// 导入配置功能，暂时空着
		message.info('导入配置功能暂未实现');
	};

	const renderSelectMode = () => (
		<div className="config-builder">
			<div className="config-header">
				<Title level={4}>配置搭建</Title>
				<Text type="secondary">选择要创建的内容类型</Text>
			</div>

			<div className="config-options">
				<Space direction="vertical" size="large" style={{ width: '100%' }}>
					<Card
						hoverable
						className="option-card"
						onClick={handleCreateForm}
						style={{ cursor: 'pointer' }}
					>
						<div className="option-content">
							<FormOutlined className="option-icon" />
							<div className="option-text">
								<Title level={5}>创建表单</Title>
								<Text type="secondary">创建一个基础表单结构</Text>
							</div>
						</div>
					</Card>

					<Card
						hoverable
						className="option-card"
						onClick={handleCreatePage}
						style={{ cursor: 'pointer', opacity: 0.6 }}
					>
						<div className="option-content">
							<FileAddOutlined className="option-icon" />
							<div className="option-text">
								<Title level={5}>创建页面</Title>
								<Text type="secondary">创建一个完整页面（暂未实现）</Text>
							</div>
						</div>
					</Card>
				</Space>
			</div>

			<Divider />

			<div className="config-tips">
				<Title level={5}>使用提示</Title>
				<ul>
					<li>选择创建表单开始配置基础表单结构</li>
					<li>支持 JSON Schema 格式的配置</li>
					<li>配置完成后可在右侧实时预览</li>
					<li>支持导入/导出配置文件</li>
				</ul>
			</div>
		</div>
	);

	const renderFormMode = () => (
		<div className="config-builder">
			<div className="config-header">
				<div className="header-actions">
					<Button
						type="text"
						icon={<ArrowLeftOutlined />}
						onClick={handleBackToSelect}
					>
						返回
					</Button>
					<Button
						type="primary"
						size="small"
						icon={<CodeOutlined />}
						onClick={handleImportConfig}
					>
						导入配置
					</Button>
				</div>
				<Title level={4}>表单配置</Title>
			</div>

			<div className="config-editor">
				<div className="schema-display">
					<Text strong>当前 Schema:</Text>
					<pre
						style={{
							background: 'rgba(0, 0, 0, 0.1)',
							padding: '12px',
							borderRadius: '6px',
							fontSize: '12px',
							overflow: 'auto',
							maxHeight: '200px',
						}}
					>
						{JSON.stringify(currentSchema, null, 2)}
					</pre>
				</div>
			</div>

			<div className="config-actions">
				<Space>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => message.info('添加字段功能暂未实现')}
					>
						添加字段
					</Button>
					<Button onClick={() => message.info('导出配置功能暂未实现')}>
						导出配置
					</Button>
				</Space>
			</div>

			<div className="config-tips">
				<Title level={5}>表单配置说明</Title>
				<ul>
					<li>当前已创建基础表单结构</li>
					<li>表单包含默认的提交和值变化处理</li>
					<li>可在右侧预览区域查看渲染效果</li>
					<li>后续可扩展更多字段和组件</li>
				</ul>
			</div>
		</div>
	);

	const renderPageMode = () => (
		<div className="config-builder">
			<div className="config-header">
				<div className="header-actions">
					<Button
						type="text"
						icon={<ArrowLeftOutlined />}
						onClick={handleBackToSelect}
					>
						返回
					</Button>
				</div>
				<Title level={4}>页面配置</Title>
			</div>

			<div className="config-placeholder">
				<Text type="secondary">页面配置功能暂未实现，敬请期待...</Text>
			</div>
		</div>
	);

	switch (buildMode) {
		case 'form':
			return renderFormMode();
		case 'page':
			return renderPageMode();
		default:
			return renderSelectMode();
	}
};

export default ConfigBuilder;
