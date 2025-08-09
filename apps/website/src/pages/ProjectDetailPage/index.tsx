import React, { useMemo, useState, useEffect } from 'react';
import {
	Card,
	Row,
	Col,
	Statistic,
	Button,
	Space,
	Typography,
	Tag,
	Avatar,
	Table,
	message,
	Tooltip,
	Badge,
	Divider,
	Descriptions,
} from 'antd';
import {
	FolderOutlined,
	UserOutlined,
	SettingOutlined,
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	CopyOutlined,
	InboxOutlined,
	ReloadOutlined,
	TeamOutlined,
	CalendarOutlined,
	ArrowLeftOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useObservable } from '@/hooks/useObservable';
import { useService } from '@/infra';
import { ChatService } from '@/services/chatGlobalState';
import {
	ProjectInfo,
	ProjectType,
	PROJECT_TYPE_CONFIG,
	getProjectDetail,
	getProjectStats,
	getProjectVenues,
} from '@/apis/project';
import { VenueInfo } from '@/apis/venue';
import './index.less';
import VenueProjectModal from '@/components/VenueProjectModal';

const { Title, Text, Paragraph } = Typography;

const ProjectDetailPage: React.FC = () => {
	const { projectId } = useParams<{ projectId: string }>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [project, setProject] = useState<ProjectInfo | null>(null);
	const [projectStats, setProjectStats] = useState<any>(null);
	const [venues, setVenues] = useState<VenueInfo[]>([]);
	const [venuesLoading, setVenuesLoading] = useState(false);
	const [showCreateVenueModal, setShowCreateVenueModal] = useState(false);

	const chatService = useService(ChatService);
	const curProject = useObservable(chatService.globalState.curProject$, null);

	const handleSetCurrentProject = () => {
		if (!project) return;
		chatService.setCurrentProject(project);
		message.success(`已设为当前项目：${project.name}`);
	};

	// 获取项目详情
	const fetchProjectDetail = async () => {
		if (!projectId) return;
		setLoading(true);
		try {
			const response = await getProjectDetail({
				project_id: parseInt(projectId),
			});
			if (response.success && response.data) {
				setProject(response.data);
			} else {
				message.error('获取项目详情失败');
			}
		} catch (error) {
			message.error('获取项目详情失败');
			console.error('Fetch project detail error:', error);
		} finally {
			setLoading(false);
		}
	};

	// 获取项目统计
	const fetchProjectStats = async () => {
		if (!projectId) return;
		try {
			const response = await getProjectStats({
				project_id: parseInt(projectId),
			});
			if (response.success && response.data) {
				setProjectStats(response.data);
			}
		} catch (error) {
			console.error('Fetch project stats error:', error);
		}
	};

	// 获取项目下的会场列表
	const fetchProjectVenues = async () => {
		if (!projectId) return;
		setVenuesLoading(true);
		try {
			const response = await getProjectVenues({
				project_id: parseInt(projectId),
				page_size: 100,
				page_num: 1,
			});
			if (response.success && response.data) {
				setVenues(response.data.data || []);
			}
		} catch (error) {
			message.error('获取会场列表失败');
			console.error('Fetch project venues error:', error);
		} finally {
			setVenuesLoading(false);
		}
	};

	useEffect(() => {
		if (projectId) {
			fetchProjectDetail();
			fetchProjectStats();
			fetchProjectVenues();
		}
	}, [projectId]);

	// 会场表格列配置
	const venueColumns = [
		{
			title: '会场信息',
			key: 'venue_info',
			render: (record: VenueInfo) => (
				<div className="venue-info-cell">
					<Avatar
						size={32}
						icon={<FolderOutlined />}
						style={{ backgroundColor: '#00ffff' }}
					/>
					<div className="venue-details">
						<div className="venue-name">{record.name}</div>
						<div className="venue-description">
							{record.description || '暂无描述'}
						</div>
					</div>
				</div>
			),
		},
		{
			title: '状态',
			key: 'status',
			render: (record: VenueInfo) => (
				<Badge
					status={record.status === 'normal' ? 'success' : 'default'}
					text={record.status === 'normal' ? '正常' : '已删除'}
				/>
			),
		},
		{
			title: '访问量',
			key: 'view_count',
			render: (record: VenueInfo) => (
				<Text type="secondary">{record.view_count}</Text>
			),
		},
		{
			title: '创建时间',
			key: 'created_at',
			render: (record: VenueInfo) => (
				<Text type="secondary">
					{new Date(record.created_at).toLocaleDateString()}
				</Text>
			),
		},
		{
			title: '操作',
			key: 'actions',
			render: (record: VenueInfo) => (
				<Space size="small">
					<Tooltip title="查看会场">
						<Button
							type="text"
							size="small"
							icon={<EyeOutlined />}
							onClick={() => navigate(`/venue/${record.id}`)}
						/>
					</Tooltip>
					<Tooltip title="编辑会场">
						<Button
							type="text"
							size="small"
							icon={<EditOutlined />}
							onClick={() => navigate(`/venue/${record.id}/edit`)}
						/>
					</Tooltip>
				</Space>
			),
		},
	];

	const typeConfig = useMemo(
		() => PROJECT_TYPE_CONFIG[project?.project_type as ProjectType],
		[project?.project_type]
	);

	if (loading) {
		return (
			<div className="project-detail-page">
				<div className="loading-state">
					<Text>加载中...</Text>
				</div>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="project-detail-page">
				<div className="error-state">
					<Text>项目不存在或已被删除</Text>
					<Button
						type="primary"
						icon={<ArrowLeftOutlined />}
						onClick={() => navigate('/dashboard/workspace/projects')}
						style={{ marginTop: 16 }}
					>
						返回项目列表
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="project-detail-page">
			{/* 页面头部 */}
			<div className="project-header">
				<div className="header-content">
					<Button
						type="text"
						icon={<ArrowLeftOutlined />}
						onClick={() => navigate('/dashboard/workspace/projects')}
						className="back-btn"
					>
						返回项目列表
					</Button>
					<Title level={2} className="page-title">
						<FolderOutlined /> {project.name}
					</Title>
					<Text type="secondary" className="page-subtitle">
						项目详情和统计信息
					</Text>
				</div>
				<Space>
					{curProject?.id === project.id ? (
						<Button disabled>当前项目</Button>
					) : (
						<Button type="primary" onClick={handleSetCurrentProject}>
							设为当前项目
						</Button>
					)}
					<Button
						icon={<ReloadOutlined />}
						onClick={() => {
							fetchProjectDetail();
							fetchProjectStats();
							fetchProjectVenues();
						}}
					>
						刷新
					</Button>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => setShowCreateVenueModal(true)}
					>
						创建会场
					</Button>
				</Space>
			</div>

			{/* 项目基本信息 */}
			<Card className="project-info-card">
				<Row gutter={[24, 24]}>
					<Col xs={24} lg={16}>
						<div className="project-basic-info">
							<Avatar
								size={80}
								icon={<FolderOutlined />}
								style={{ backgroundColor: '#00ffff' }}
							/>
							<div className="project-details">
								<Title level={3}>{project.name}</Title>
								<Paragraph className="project-description">
									{project.description || '暂无描述'}
								</Paragraph>
								<div className="project-meta">
									<Space size="large">
										<div className="meta-item">
											<UserOutlined />
											<Text>创建者：{project.created_by}</Text>
										</div>
										<div className="meta-item">
											<CalendarOutlined />
											<Text>
												创建时间：
												{new Date(project.created_at).toLocaleDateString()}
											</Text>
										</div>
										<div className="meta-item">
											<TeamOutlined />
											<Text>团队ID：{project.team_id}</Text>
										</div>
									</Space>
								</div>
								{project.tags && (
									<div className="project-tags">
										{project.tags.split(',').map((tag, index) => (
											<Tag key={index} color="cyan">
												{tag.trim()}
											</Tag>
										))}
									</div>
								)}
							</div>
						</div>
					</Col>
					<Col xs={24} lg={8}>
						<div className="project-status-section">
							<Descriptions title="项目状态" column={1}>
								<Descriptions.Item label="项目类型">
									<Tag color={typeConfig.color}>{typeConfig.text}</Tag>
								</Descriptions.Item>
								<Descriptions.Item label="当前项目">
									<Tag
										color={curProject?.id === project.id ? 'blue' : 'default'}
									>
										{curProject?.id === project.id ? '是' : '否'}
									</Tag>
								</Descriptions.Item>
								<Descriptions.Item label="会场数量">
									<Text strong>{project.venue_count}</Text>
								</Descriptions.Item>
								<Descriptions.Item label="最后更新">
									{new Date(project.updated_at).toLocaleDateString()}
								</Descriptions.Item>
							</Descriptions>
						</div>
					</Col>
				</Row>
			</Card>

			{/* 统计卡片 */}
			<Row gutter={[24, 24]} className="stats-row">
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="总会场数"
							value={project.venue_count}
							prefix={<FolderOutlined />}
							valueStyle={{ color: '#00ffff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="总访问量"
							value={projectStats?.total_views || 0}
							prefix={<EyeOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="独立访客"
							value={projectStats?.unique_visitors || 0}
							prefix={<UserOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="平均时长"
							value={projectStats?.avg_duration || 0}
							suffix="分钟"
							prefix={<SettingOutlined />}
							valueStyle={{ color: '#722ed1' }}
						/>
					</Card>
				</Col>
			</Row>

			{/* 会场列表 */}
			<Table
				columns={venueColumns}
				dataSource={venues}
				rowKey="id"
				loading={venuesLoading}
				pagination={false}
				locale={{
					emptyText: (
						<div className="empty-state">
							<FolderOutlined style={{ fontSize: 48, color: '#666' }} />
							<Text
								type="secondary"
								style={{ display: 'block', marginTop: 16 }}
							>
								暂无会场，创建您的第一个会场吧！
							</Text>
							<Button
								type="primary"
								icon={<PlusOutlined />}
								style={{ marginTop: 16 }}
								onClick={() => setShowCreateVenueModal(true)}
							>
								创建会场
							</Button>
						</div>
					),
				}}
			/>

			{/* 创建/选择会场弹窗（内置项目选择，默认当前项目） */}
			<VenueProjectModal
				visible={showCreateVenueModal}
				onCancel={() => setShowCreateVenueModal(false)}
				initProjectId={project ? Number(project.id) : undefined}
				shouldNavigate={false}
				onCompleted={() => {
					// 创建或选择成功后刷新列表
					fetchProjectVenues();
				}}
			/>
		</div>
	);
};

export default ProjectDetailPage;
