import React, { useState, useEffect } from 'react';
import {
	Card,
	Table,
	Button,
	Modal,
	Form,
	Input,
	Space,
	Popconfirm,
	Tag,
	Avatar,
	Typography,
	Row,
	Col,
	Statistic,
	message,
	Tooltip,
	Badge,
	Select,
	DatePicker,
	Divider,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	FolderOutlined,
	UserOutlined,
	SettingOutlined,
	EyeOutlined,
	CopyOutlined,
	SearchOutlined,
	FilterOutlined,
	ExportOutlined,
	InboxOutlined,
	ReloadOutlined,
	TeamOutlined,
	CalendarOutlined,
} from '@ant-design/icons';
import { useObservable } from '@/hooks/useObservable';
import { useService } from '@/infra';
import { ChatService } from '@/services/chatGlobalState';
import {
	ProjectInfo,
	ProjectCreateParams,
	ProjectType,
	PROJECT_TYPE_CONFIG,
} from '@/apis/project';
import { TeamInfo } from '@/apis/team';
import './index.less';
import { useNavigate } from 'react-router-dom';
import CreateProjectModal from '../WorkspacePage/CreateProject';
import { useGlobalInfo } from '@/hooks/useGlobalInfo';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ProjectManagePageProps {
	onProjectSelect?: (project: ProjectInfo) => void;
}

const ProjectManagePage: React.FC<ProjectManagePageProps> = ({
	onProjectSelect,
}) => {
	// 初始化全局信息：确保获取用户信息与团队列表，并设置默认团队
	// 这样当进入本页时会有 curTeam，从而触发项目请求
	useGlobalInfo();
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [createOpen, setCreateOpen] = useState(false);
	const [editingProject, setEditingProject] = useState<ProjectInfo | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [tableLoading, setTableLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [typeFilter, setTypeFilter] = useState<string>('all');
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

	const chatService = useService(ChatService);

	const projects = useObservable(chatService.globalState.projects$, null);
	const curProject = useObservable(chatService.globalState.curProject$, null);
	const curTeam = useObservable(chatService.globalState.curTeam$, null);
	const userTeams = useObservable(chatService.globalState.userTeams$, []);

	// 获取项目列表
	const fetchProjects = async () => {
		setTableLoading(true);
		try {
			const projectType: ProjectType | undefined =
				typeFilter === 'all'
					? curTeam
						? undefined
						: ProjectType.PERSONAL // 无团队时默认查询个人项目
					: (typeFilter as ProjectType);

			await chatService.getProjects({
				team_id: curTeam?.id,
				page_size: 100,
				page_num: 1,
				keyword: searchText || undefined,
				project_type: projectType,
			});
		} catch (error) {
			console.error('Fetch projects error:', error);
		} finally {
			setTableLoading(false);
		}
	};

	// 创建或更新项目
	const handleSubmit = async (values: any) => {
		setLoading(true);
		try {
			if (editingProject) {
				await chatService.updateExistingProject(editingProject.id, values);
			} else {
				await chatService.createNewProject({
					...values,
					team_id: curTeam?.id,
				} as ProjectCreateParams);
			}
			setIsModalVisible(false);
			form.resetFields();
			setEditingProject(null);
			setModalMode('create');
		} catch (error) {
			console.error('Submit project error:', error);
		} finally {
			setLoading(false);
		}
	};

	// 删除项目
	const handleDelete = async (projectId: number) => {
		try {
			await chatService.deleteExistingProject(projectId);
		} catch (error) {
			console.error('Delete project error:', error);
		}
	};

	// 归档项目
	const handleArchive = async (projectId: number) => {
		try {
			await chatService.archiveExistingProject(projectId);
		} catch (error) {
			console.error('Archive project error:', error);
		}
	};

	// 复制项目
	const handleCopy = async (projectId: number, name: string) => {
		try {
			await chatService.copyExistingProject(projectId, `${name} - 副本`);
		} catch (error) {
			console.error('Copy project error:', error);
		}
	};

	// 选择项目
	const handleSelectProject = (project: ProjectInfo) => {
		chatService.setCurrentProject(project);
		onProjectSelect?.(project);
		message.success(`已选择项目：${project.name}`);
	};

	// 打开编辑模态框
	const showEditModal = (project: ProjectInfo) => {
		setEditingProject(project);
		setModalMode('edit');
		setCreateOpen(true);
	};

	// 打开创建模态框
	const showCreateModal = () => {
		setCreateOpen(true);
	};

	// 关闭模态框
	const handleCancel = () => {
		setIsModalVisible(false);
		setEditingProject(null);
		form.resetFields();
	};

	// 搜索和筛选
	const handleSearch = () => {
		fetchProjects();
	};

	// 重置筛选
	const handleReset = () => {
		setSearchText('');
		setTypeFilter('all');
		fetchProjects();
	};

	useEffect(() => {
		fetchProjects();
		// 当 curTeam 变化或筛选条件变化时，都重新获取（无团队则查个人项目）
	}, [curTeam, searchText, typeFilter]);

	// 表格列配置
	const columns = [
		{
			title: '项目信息',
			key: 'project_info',
			render: (record: ProjectInfo) => (
				<div className="project-info-cell">
					<Avatar
						size={40}
						icon={<FolderOutlined />}
						style={{ backgroundColor: '#00ffff' }}
					/>
					<div className="project-details">
						<div
							className="project-name clickable"
							onClick={() =>
								navigate(`/dashboard/workspace/projects/${record.id}`)
							}
						>
							{record.name}
						</div>
						<div className="project-description">
							{record.description || '暂无描述'}
						</div>
						{record.tags && (
							<div className="project-tags">
								{record.tags.split(',').map((tag, index) => (
									<Tag key={index} color="cyan">
										{tag.trim()}
									</Tag>
								))}
							</div>
						)}
					</div>
				</div>
			),
		},
		{
			title: '类型',
			key: 'project_type',
			render: (record: ProjectInfo) => {
				const typeConfig =
					PROJECT_TYPE_CONFIG[record.project_type as ProjectType];
				return (
					<Badge
						status={'processing'}
						text={<Tag color={typeConfig.color}>{typeConfig.text}</Tag>}
					/>
				);
			},
		},
		{
			title: '会场数量',
			key: 'venue_count',
			render: (record: ProjectInfo) => (
				<div className="venue-count">
					<FolderOutlined style={{ marginRight: 4 }} />
					<Text>{record.venue_count}</Text>
				</div>
			),
		},
		{
			title: '创建者',
			key: 'created_by',
			render: (record: ProjectInfo) => (
				<div className="creator-info">
					<UserOutlined />
					<Text>{record.created_by}</Text>
				</div>
			),
		},
		{
			title: '创建时间',
			key: 'created_at',
			render: (record: ProjectInfo) => (
				<Text type="secondary">
					{new Date(record.created_at).toLocaleDateString()}
				</Text>
			),
		},
		{
			title: '操作',
			key: 'actions',
			render: (record: ProjectInfo) => (
				<Space size="small">
					<Tooltip title="查看详情">
						<Button
							type="default"
							size="small"
							icon={<EyeOutlined />}
							onClick={() =>
								navigate(`/dashboard/workspace/projects/${record.id}`)
							}
						>
							详情
						</Button>
					</Tooltip>
					<Tooltip title="选择项目">
						<Button
							type={curProject?.id === record.id ? 'primary' : 'default'}
							size="small"
							icon={<FolderOutlined />}
							onClick={() => handleSelectProject(record)}
						>
							{curProject?.id === record.id ? '当前项目' : '选择'}
						</Button>
					</Tooltip>
					<Tooltip title="编辑项目">
						<Button
							type="text"
							size="small"
							icon={<EditOutlined />}
							onClick={() => showEditModal(record)}
						/>
					</Tooltip>
					<Tooltip title="复制项目">
						<Button
							type="text"
							size="small"
							icon={<CopyOutlined />}
							onClick={() => handleCopy(record.id, record.name)}
						/>
					</Tooltip>
					<Tooltip title="归档项目">
						<Button
							type="text"
							size="small"
							icon={<InboxOutlined />}
							onClick={() => handleArchive(record.id)}
						/>
					</Tooltip>
					<Tooltip title="删除项目">
						<Popconfirm
							title="确定要删除这个项目吗？"
							description="删除后无法恢复，请谨慎操作"
							onConfirm={() => handleDelete(record.id)}
							okText="确定"
							cancelText="取消"
						>
							<Button
								type="text"
								size="small"
								danger
								icon={<DeleteOutlined />}
							/>
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	const projectList = projects?.data || [];

	// 统计数据
	const stats = {
		total: projectList.length,
		team: projectList.filter((p) => p.project_type === ProjectType.TEAM).length,
		personal: projectList.filter((p) => p.project_type === ProjectType.PERSONAL)
			.length,
		totalVenues: projectList.reduce((sum, p) => sum + (p.venue_count || 0), 0),
	};

	return (
		<div className="project-manage-page">
			{/* 页面头部 */}
			<div className="project-header">
				<div className="header-content">
					<Title level={2} className="page-title">
						<FolderOutlined /> 项目管理
					</Title>
					<Text type="secondary" className="page-subtitle">
						管理您的项目和关联的会场
					</Text>
					{curTeam && (
						<Text type="secondary" className="current-team">
							<TeamOutlined /> 当前团队：{curTeam.name}
						</Text>
					)}
				</div>
				<Space>
					<Button
						icon={<ReloadOutlined />}
						onClick={fetchProjects}
						loading={tableLoading}
					>
						刷新
					</Button>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						size="large"
						onClick={() => setCreateOpen(true)}
						className="create-btn"
					>
						创建项目
					</Button>
				</Space>
			</div>

			{/* 统计卡片 */}
			<Row gutter={[24, 24]} className="stats-row">
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="总项目数"
							value={stats.total}
							prefix={<FolderOutlined />}
							valueStyle={{ color: '#00ffff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="团队项目"
							value={stats.team}
							prefix={<UserOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="个人项目"
							value={stats.personal}
							prefix={<SettingOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="总会场数"
							value={stats.totalVenues}
							prefix={<EyeOutlined />}
							valueStyle={{ color: '#722ed1' }}
						/>
					</Card>
				</Col>
			</Row>

			{/* 搜索和筛选 */}
			<Card className="filter-card">
				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} sm={8}>
						<Input
							placeholder="搜索项目名称或描述"
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							onPressEnter={handleSearch}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={6}>
						<Select
							placeholder="类型筛选"
							value={typeFilter}
							onChange={setTypeFilter}
							style={{ width: '100%' }}
						>
							<Option value="all">全部类型</Option>
							<Option value={ProjectType.PERSONAL}>个人</Option>
							<Option value={ProjectType.TEAM}>团队</Option>
							<Option value={ProjectType.PUBLIC}>公共</Option>
						</Select>
					</Col>
					<Col xs={24} sm={10}>
						<Space>
							<Button
								type="primary"
								icon={<SearchOutlined />}
								onClick={handleSearch}
							>
								搜索
							</Button>
							<Button icon={<FilterOutlined />} onClick={handleReset}>
								重置
							</Button>
							<Button
								icon={<ExportOutlined />}
								onClick={() => message.info('导出功能开发中')}
							>
								导出
							</Button>
						</Space>
					</Col>
				</Row>
			</Card>

			{/* 项目列表 */}
			<Card className="project-table-card">
				<Table
					columns={columns}
					dataSource={projectList}
					rowKey="id"
					loading={tableLoading}
					pagination={false}
					className="project-table"
					locale={{
						emptyText: (
							<div className="empty-state">
								<FolderOutlined style={{ fontSize: 48, color: '#666' }} />
								<Text
									type="secondary"
									style={{ display: 'block', marginTop: 16 }}
								>
									{!curTeam
										? '暂无个人项目，创建您的第一个项目吧！'
										: '暂无项目，创建您的第一个项目吧！'}
								</Text>
								{curTeam && (
									<Button
										type="primary"
										icon={<PlusOutlined />}
										style={{ marginTop: 16 }}
										onClick={() => setCreateOpen(true)}
									>
										创建项目
									</Button>
								)}
							</div>
						),
					}}
				/>
			</Card>

			{/* 创建/编辑项目模态框 */}
			<CreateProjectModal
				open={createOpen}
				onClose={() => {
					setCreateOpen(false);
					setEditingProject(null);
					setModalMode('create');
				}}
				onSuccess={() => fetchProjects()}
				mode={modalMode}
				project={editingProject}
			/>
		</div>
	);
};

export default ProjectManagePage;
