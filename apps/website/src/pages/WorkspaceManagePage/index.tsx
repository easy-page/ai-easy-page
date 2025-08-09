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
	ProjectStatus,
	PROJECT_STATUS_CONFIG,
} from '@/apis/project';
import { TeamInfo } from '@/apis/team';
import './index.less';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ProjectManagePageProps {
	onProjectSelect?: (project: ProjectInfo) => void;
}

const ProjectManagePage: React.FC<ProjectManagePageProps> = ({
	onProjectSelect,
}) => {
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingProject, setEditingProject] = useState<ProjectInfo | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [tableLoading, setTableLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');

	const chatService = useService(ChatService);

	const projects = useObservable(chatService.globalState.projects$, null);
	const curProject = useObservable(chatService.globalState.curProject$, null);
	const curTeam = useObservable(chatService.globalState.curTeam$, null);
	const userTeams = useObservable(chatService.globalState.userTeams$, []);

	// 获取项目列表
	const fetchProjects = async () => {
		setTableLoading(true);
		try {
			await chatService.getProjects({
				team_id: curTeam?.id,
				page_size: 100,
				page_num: 1,
				keyword: searchText || undefined,
				status:
					statusFilter === 'all' ? undefined : (statusFilter as ProjectStatus),
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
		form.setFieldsValue({
			name: project.name,
			description: project.description,
			icon: project.icon,
			tags: project.tags,
			status: project.status,
		});
		setIsModalVisible(true);
	};

	// 打开创建模态框
	const showCreateModal = () => {
		if (!curTeam) {
			message.warning('请先选择一个团队');
			return;
		}
		setEditingProject(null);
		form.resetFields();
		setIsModalVisible(true);
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
		setStatusFilter('all');
		fetchProjects();
	};

	useEffect(() => {
		if (curTeam) {
			fetchProjects();
		}
	}, [curTeam, searchText, statusFilter]);

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
						<div className="project-name">{record.name}</div>
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
			title: '状态',
			key: 'status',
			render: (record: ProjectInfo) => {
				const statusConfig = PROJECT_STATUS_CONFIG[record.status];
				return (
					<Badge
						status={
							record.status === ProjectStatus.ACTIVE ? 'success' : 'default'
						}
						text={<Tag color={statusConfig.color}>{statusConfig.text}</Tag>}
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
					<Tooltip title="选择项目">
						<Button
							type={curProject?.id === record.id ? 'primary' : 'default'}
							size="small"
							icon={<EyeOutlined />}
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
					{record.status !== ProjectStatus.ARCHIVED && (
						<Tooltip title="归档项目">
							<Button
								type="text"
								size="small"
								icon={<InboxOutlined />}
								onClick={() => handleArchive(record.id)}
							/>
						</Tooltip>
					)}
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
		active: projectList.filter((p) => p.status === ProjectStatus.ACTIVE).length,
		archived: projectList.filter((p) => p.status === ProjectStatus.ARCHIVED)
			.length,
		totalVenues: projectList.reduce((sum, p) => sum + p.venue_count, 0),
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
						onClick={showCreateModal}
						className="create-btn"
						disabled={!curTeam}
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
							title="活跃项目"
							value={stats.active}
							prefix={<UserOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="当前项目"
							value={curProject ? 1 : 0}
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
							placeholder="状态筛选"
							value={statusFilter}
							onChange={setStatusFilter}
							style={{ width: '100%' }}
						>
							<Option value="all">全部状态</Option>
							<Option value={ProjectStatus.ACTIVE}>活跃</Option>
							<Option value={ProjectStatus.INACTIVE}>非活跃</Option>
							<Option value={ProjectStatus.ARCHIVED}>已归档</Option>
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
										? '请先选择一个团队'
										: '暂无项目，创建您的第一个项目吧！'}
								</Text>
								{curTeam && (
									<Button
										type="primary"
										icon={<PlusOutlined />}
										style={{ marginTop: 16 }}
										onClick={showCreateModal}
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
			<Modal
				title={
					<div className="modal-title">
						{editingProject ? (
							<>
								<EditOutlined /> 编辑项目
							</>
						) : (
							<>
								<PlusOutlined /> 创建项目
							</>
						)}
					</div>
				}
				open={isModalVisible}
				onOk={form.submit}
				onCancel={handleCancel}
				confirmLoading={loading}
				width={600}
				className="project-modal"
				okText={editingProject ? '更新' : '创建'}
				cancelText="取消"
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					className="project-form"
				>
					<Form.Item
						name="name"
						label="项目名称"
						rules={[
							{ required: true, message: '请输入项目名称' },
							{ max: 50, message: '项目名称不能超过50个字符' },
						]}
					>
						<Input
							placeholder="请输入项目名称"
							prefix={<FolderOutlined />}
							maxLength={50}
						/>
					</Form.Item>

					<Form.Item
						name="description"
						label="项目描述"
						rules={[{ max: 200, message: '项目描述不能超过200个字符' }]}
					>
						<TextArea
							placeholder="请输入项目描述（可选）"
							rows={4}
							maxLength={200}
							showCount
						/>
					</Form.Item>

					<Form.Item name="tags" label="项目标签">
						<Input
							placeholder="请输入项目标签，用逗号分隔（可选）"
							prefix={<SettingOutlined />}
						/>
					</Form.Item>

					<Form.Item name="icon" label="项目图标">
						<Input
							placeholder="请输入项目图标URL（可选）"
							prefix={<SettingOutlined />}
						/>
					</Form.Item>

					{editingProject && (
						<Form.Item name="status" label="项目状态">
							<Select placeholder="请选择项目状态">
								<Option value={ProjectStatus.ACTIVE}>活跃</Option>
								<Option value={ProjectStatus.INACTIVE}>非活跃</Option>
								<Option value={ProjectStatus.ARCHIVED}>已归档</Option>
							</Select>
						</Form.Item>
					)}
				</Form>
			</Modal>
		</div>
	);
};

export default ProjectManagePage;
