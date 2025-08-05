import { useState, FC } from 'react';
import { Layout, Tabs, Card } from 'antd';
import { RobotOutlined, SettingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import ConfigBuilder from './components/ConfigBuilder';
import AIBuilder from './components/AIBuilder';
import PreviewPanel from './components/PreviewPanel';
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

	return (
		<motion.div
			className="playground-page"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Layout className="playground-layout">
				<Sider width={480} className="playground-sider">
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
										<ConfigBuilder onSchemaChange={handleSchemaChange} />
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

				<Content className="playground-content">
					<Card className="preview-card">
						<PreviewPanel
							previewMode={previewMode}
							onPreviewModeChange={handlePreviewModeChange}
							schema={currentSchema}
						/>
					</Card>
				</Content>
			</Layout>
		</motion.div>
	);
};

export default PlaygroundPage;
