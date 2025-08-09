import { useState, FC, useEffect, useCallback } from 'react';
import { Layout, Tabs, Card } from 'antd';
import { RobotOutlined, SettingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useService } from '@/infra/ioc/react';
import { ChatService } from '@/services/chatGlobalState';
import { useObservable } from '@/hooks/useObservable';
import { getQueryString } from '@/common/utils/url';
import ConfigBuilder from './components/ConfigBuilder';
import AIBuilder from './components/AIBuilder';
import PreviewPanel from './components/PreviewPanel';
import NodeConfigPanel from './components/NodeConfigPanel';
import VenueProjectModal from '@/components/VenueProjectModal';
import { FormSchema } from './Schema';
import './index.less';
import { getVenueDetail } from '@/apis/venue';

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
	// 入口参数缺失时，弹出通用选择/创建弹窗
	const [showVenueProjectModal, setShowVenueProjectModal] = useState(false);
	const [initProjectId, setInitProjectId] = useState<number | undefined>(
		undefined
	);
	const [loading, setLoading] = useState(false);

	// 使用useCallback来避免无限循环（先声明函数，再创建回调）

	// 启动参数校验：必须同时具备 projectId 与 venueId
	useEffect(() => {
		const projectIdStr = getQueryString('projectId');
		const venueIdStr = getQueryString('venueId');

		if (!projectIdStr || !venueIdStr) {
			// 缺少参数则弹出通用弹窗，允许用户选择项目和会场
			setInitProjectId(projectIdStr ? Number(projectIdStr) : undefined);
			setShowVenueProjectModal(true);
			return;
		}

		const venueId = Number(venueIdStr);
		if (!curVenue || curVenue.id !== venueId) {
			loadVenueDetail(venueId);
		}
	}, [curVenue]);

	// 加载会场详情
	async function loadVenueDetail(venueId: number) {
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
				// 会场不存在或加载失败，弹窗让用户重新选择
				setShowVenueProjectModal(true);
			}
		} catch (error) {
			console.error('加载会场详情失败:', error);
			// 加载失败，弹窗让用户重新选择
			setShowVenueProjectModal(true);
		} finally {
			setLoading(false);
		}
	}

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

	// 无兜底页，缺参时直接弹窗

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

			<VenueProjectModal
				visible={showVenueProjectModal}
				onCancel={() => setShowVenueProjectModal(false)}
				initProjectId={initProjectId}
				shouldNavigate={true}
			/>
		</>
	);
};

export default PlaygroundPage;
