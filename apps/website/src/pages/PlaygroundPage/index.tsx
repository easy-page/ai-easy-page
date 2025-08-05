import { useState, FC } from 'react';
import { Layout, Tabs, Card, Row, Col } from 'antd';
import { RobotOutlined, SettingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import ConfigBuilder from './components/ConfigBuilder';
import AIBuilder from './components/AIBuilder';
import PreviewPanel from './components/PreviewPanel';
import NodeConfigPanel from './components/NodeConfigPanel';
import { FormSchema } from './Schema';
import './index.less';

const { Sider, Content } = Layout;

const PlaygroundPage: FC = () => {
	const [activeTab, setActiveTab] = useState('config');
	const [previewMode, setPreviewMode] = useState<'create' | 'edit' | 'view'>(
		'create'
	);
	const [currentSchema, setCurrentSchema] = useState<FormSchema | undefined>(
		undefined
	);
	const [selectedNode, setSelectedNode] = useState<string | null>(null);

	const handleTabChange = (key: string) => {
		setActiveTab(key);
	};

	const handlePreviewModeChange = (mode: 'create' | 'edit' | 'view') => {
		setPreviewMode(mode);
	};

	const handleSchemaChange = (schema: FormSchema) => {
		setCurrentSchema(schema);
		console.log('Schema 已更新:', schema);
	};

	const handleNodeSelect = (nodeId: string) => {
		setSelectedNode(nodeId);
	};

	const handleCloseConfigPanel = () => {
		setSelectedNode(null);
	};

	const handlePropertyChange = (propertyPath: string, value: any) => {
		if (!currentSchema) return;

		const newSchema = { ...currentSchema };
		const pathParts = propertyPath.split('.');
		let current: any = newSchema;

		// 导航到属性路径
		for (let i = 0; i < pathParts.length - 1; i++) {
			current = current[pathParts[i]];
		}

		// 设置新值
		current[pathParts[pathParts.length - 1]] = value;
		setCurrentSchema(newSchema);
	};

	return (
		<motion.div
			className="playground-page"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Layout className="playground-layout">
				<Sider width={320} className="playground-sider">
					<Card className="sider-card">
						<Tabs
							activeKey={activeTab}
							onChange={handleTabChange}
							className="playground-tabs"
							items={[
								{
									key: 'config',
									label: (
										<span>
											<SettingOutlined />
											配置搭建
										</span>
									),
									children: (
										<ConfigBuilder
											onSchemaChange={handleSchemaChange}
											selectedNode={selectedNode}
											onNodeSelect={handleNodeSelect}
										/>
									),
								},
								{
									key: 'ai',
									label: (
										<span>
											<RobotOutlined />
											AI 搭建
										</span>
									),
									children: <AIBuilder />,
								},
							]}
						/>
					</Card>
				</Sider>

				<Content className={`playground-content ${selectedNode ? 'with-config-panel' : ''}`}>
					<Card className="preview-card">
						<PreviewPanel
							previewMode={previewMode}
							onPreviewModeChange={handlePreviewModeChange}
							schema={currentSchema}
						/>
					</Card>
				</Content>
			</Layout>

			{/* 右侧滑出的配置面板 */}
			{selectedNode && (
				<div 
					className="config-panel-overlay"
					onClick={handleCloseConfigPanel}
				>
					<div 
						className="config-panel-container"
						onClick={(e) => e.stopPropagation()}
					>
						<NodeConfigPanel
							schema={currentSchema || null}
							selectedNode={selectedNode}
							onPropertyChange={handlePropertyChange}
							onClose={handleCloseConfigPanel}
						/>
					</div>
				</div>
			)}
		</motion.div>
	);
};

export default PlaygroundPage;
