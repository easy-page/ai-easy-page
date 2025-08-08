import { useState, FC, useEffect, useCallback } from 'react';
import { Layout, Tabs, Card, Row, Col } from 'antd';
import { RobotOutlined, SettingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useService } from './AiChat/infra/ioc/react';
import { ChatService } from './AiChat/services/chatGlobalState';
import { useObservable } from './AiChat/hooks/useObservable';
import { getQueryString } from './AiChat/common/utils/url';
import { getVenueDetail } from './AiChat/apis/venue';
import ConfigBuilder from './components/ConfigBuilder';
import AIBuilder from './components/AIBuilder';
import PreviewPanel from './components/PreviewPanel';
import NodeConfigPanel from './components/NodeConfigPanel';
import VenueSelectionModal from './components/VenueSelectionModal';
import { FormSchema } from './Schema';
import './index.less';

const { Sider, Content } = Layout;

const PlaygroundPage: FC = () => {
	const chatService = useService(ChatService);
	const curVenue = useObservable(chatService.globalState.curVenue$, null);

	const [activeTab, setActiveTab] = useState('config');
	const [previewMode, setPreviewMode] = useState<'create' | 'edit' | 'view'>(
		'create'
	);
	const [currentSchema, setCurrentSchema] = useState<FormSchema | undefined>(
		undefined
	);
	const [selectedNode, setSelectedNode] = useState<string | null>(null);
	const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
	const [showVenueModal, setShowVenueModal] = useState(false);
	const [loading, setLoading] = useState(false);

	// 检查是否需要显示会场选择弹窗
	useEffect(() => {
		const venueId = getQueryString('venueId');

		if (!venueId) {
			// 没有venueId参数，显示会场选择弹窗
			setShowVenueModal(true);
		} else if (!curVenue || curVenue.id !== Number(venueId)) {
			// 有venueId参数但当前会场不匹配，需要加载会场信息
			loadVenueDetailCallback(Number(venueId));
		}
	}, [curVenue]);

	// 加载会场详情
	const loadVenueDetail = async (venueId: number) => {
		setLoading(true);
		try {
			const response = await getVenueDetail({ venueId });
			if (response.success && response.data) {
				chatService.globalState.setCurVenue(response.data);

				// 如果会场有页面schema，则加载到当前schema
				if (response.data.page_schema) {
					setCurrentSchema(response.data.page_schema);
				}
			} else {
				// 会场不存在或加载失败，显示会场选择弹窗
				setShowVenueModal(true);
			}
		} catch (error) {
			console.error('加载会场详情失败:', error);
			// 加载失败，显示会场选择弹窗
			setShowVenueModal(true);
		} finally {
			setLoading(false);
		}
	};

	// 使用useCallback来避免无限循环
	const loadVenueDetailCallback = useCallback(loadVenueDetail, [
		chatService.globalState,
	]);

	const handleTabChange = (key: string) => {
		setActiveTab(key);
	};

	const handlePreviewModeChange = (mode: 'create' | 'edit' | 'view') => {
		setPreviewMode(mode);
	};

	const handleSchemaChange = (schema: FormSchema) => {
		console.log('handleSchemaChange called:', schema);
		setCurrentSchema(schema);
	};

	const handleNodeSelect = (nodeId: string) => {
		console.log('handleNodeSelect called:', nodeId);
		setSelectedNode(nodeId);
	};

	const handleCloseConfigPanel = () => {
		console.log('handleCloseConfigPanel called');
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

	const handleVenueModalCancel = () => {
		setShowVenueModal(false);
		// 如果没有选择会场，可以跳转到其他页面或显示提示
		// 这里暂时保持弹窗打开状态
	};

	// 如果正在加载，显示加载状态
	if (loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					flexDirection: 'column',
					gap: 16,
				}}
			>
				<div>正在加载会场信息...</div>
			</div>
		);
	}

	return (
		<>
			<motion.div
				className="playground-page"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Layout className="playground-layout">
					{/* 左侧：组件树 */}
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
												<SettingOutlined style={{ marginRight: 4 }} />
												配置搭建
											</span>
										),
										children: (
											<ConfigBuilder
												onSchemaChange={handleSchemaChange}
												selectedNode={selectedNode}
												onNodeSelect={handleNodeSelect}
												expandedKeys={expandedKeys}
												onExpand={setExpandedKeys}
											/>
										),
									},
									{
										key: 'ai',
										label: (
											<span>
												<RobotOutlined style={{ marginRight: 4 }} />
												AI 搭建
											</span>
										),
										children: <AIBuilder />,
									},
								]}
							/>
						</Card>
					</Sider>

					{/* 中间：预览区域 */}
					<Content className="playground-content">
						<Card className="preview-card">
							<PreviewPanel
								previewMode={previewMode}
								onPreviewModeChange={handlePreviewModeChange}
								schema={currentSchema}
							/>
						</Card>
					</Content>

					{/* 右侧：节点配置面板 */}
					{selectedNode && (
						<Sider width={320} className="playground-config-sider">
							<Card className="config-sider-card">
								<NodeConfigPanel
									schema={currentSchema || null}
									selectedNode={selectedNode}
									onNodeSelect={handleNodeSelect}
									onExpand={setExpandedKeys}
									expandedKeys={expandedKeys}
									onPropertyChange={handlePropertyChange}
									onClose={handleCloseConfigPanel}
								/>
							</Card>
						</Sider>
					)}
				</Layout>
			</motion.div>

			{/* 会场选择弹窗 */}
			<VenueSelectionModal
				visible={showVenueModal}
				onCancel={handleVenueModalCancel}
			/>
		</>
	);
};

export default PlaygroundPage;
