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
} from '@ant-design/icons';
import { useObservable } from '@/hooks/useObservable';
import { useService } from '@/infra';
import { ChatService } from '@/services/chatGlobalState';
import {
	VenueInfo,
	createVenue,
	updateVenue,
	queryVenues,
	deleteVenue,
	VenueCreateParams,
	VenueUpdateParams,
	VenueStatus,
	VENUE_STATUS_CONFIG,
} from '@/apis/venue';
import { TeamInfo } from '@/apis/team';
import './index.less';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface WorkspaceManagePageProps {
	onWorkspaceSelect?: (workspace: VenueInfo) => void;
}

const WorkspaceManagePage: React.FC<WorkspaceManagePageProps> = ({
	onWorkspaceSelect,
}) => {
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingWorkspace, setEditingWorkspace] = useState<VenueInfo | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [tableLoading, setTableLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');

	const chatService = useService(ChatService);

	const venues = useObservable(chatService.globalState.venues$, null);
	const curVenue = useObservable(chatService.globalState.curVenue$, null);
	const curTeam = useObservable(chatService.globalState.curTeam$, null);
	const userTeams = useObservable(chatService.globalState.userTeams$, []);

	// 获取项目列表
	const fetchWorkspaces = async () => {
		setTableLoading(true);
		try {
			const response = await queryVenues({
				team_id: curTeam?.id,
				page_size: 100,
				page_num: 1,
				keyword: searchText || undefined,
				status:
					statusFilter === 'all' ? undefined : (statusFilter as VenueStatus),
			});
			if (response.data) {
				chatService.globalState.setVenues(response.data);
			}
		} catch (error) {
			message.error('获取项目列表失败');
			console.error('Fetch workspaces error:', error);
		} finally {
			setTableLoading(false);
		}
	};

	// 创建或更新项目
	const handleSubmit = async (values: any) => {
		setLoading(true);
		try {
			if (editingWorkspace) {
				await updateVenue({
					venue_id: editingWorkspace.id.toString(),
					venue_data: values,
				});
				message.success('项目更新成功');
			} else {
				await createVenue({
					...values,
					team_id: curTeam?.id,
				} as VenueCreateParams);
				message.success('项目创建成功');
			}
			setIsModalVisible(false);
			form.resetFields();
			setEditingWorkspace(null);
			fetchWorkspaces();
		} catch (error) {
			message.error(editingWorkspace ? '项目更新失败' : '项目创建失败');
			console.error('Submit workspace error:', error);
		} finally {
			setLoading(false);
		}
	};

	// 删除项目
	const handleDelete = async (venueId: number) => {
		try {
			await deleteVenue({ venue_id: venueId.toString() });
			message.success('项目删除成功');
			fetchWorkspaces();
		} catch (error) {
			message.error('项目删除失败');
			console.error('Delete workspace error:', error);
		}
	};

	// 选择项目
	const handleSelectWorkspace = (workspace: VenueInfo) => {
		chatService.globalState.setCurVenue(workspace);
		onWorkspaceSelect?.(workspace);
		message.success(`已选择项目：${workspace.name}`);
	};

	// 打开编辑模态框
	const showEditModal = (workspace: VenueInfo) => {
		setEditingWorkspace(workspace);
		form.setFieldsValue({
			name: workspace.name,
			description: workspace.description,
			icon: workspace.icon,
			tags: workspace.tags,
		});
		setIsModalVisible(true);
	};

	// 打开创建模态框
	const showCreateModal = () => {
		if (!curTeam) {
			message.warning('请先选择一个团队');
			return;
		}
		setEditingWorkspace(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	// 关闭模态框
	const handleCancel = () => {
		setIsModalVisible(false);
		setEditingWorkspace(null);
		form.resetFields();
	};

	// 搜索和筛选
	const handleSearch = () => {
		fetchWorkspaces();
	};

	// 重置筛选
	const handleReset = () => {
		setSearchText('');
		setStatusFilter('all');
		fetchWorkspaces();
	};

	useEffect(() => {
		if (curTeam) {
			fetchWorkspaces();
		}
	}, [curTeam, searchText, statusFilter]);

	// 表格列配置
	const columns = [
		{
			title: '项目信息',
			key: 'workspace_info',
			render: (record: VenueInfo) => (
				<div className="workspace-info-cell">
					<Avatar
						size={40}
						icon={<FolderOutlined />}
						style={{ backgroundColor: '#00ffff' }}
					/>
					<div className="workspace-details">
						<div className="workspace-name">{record.name}</div>
						<div className="workspace-description">
							{record.description || '暂无描述'}
						</div>
						{record.tags && (
							<div className="workspace-tags">
								{record.tags.split(',').map((tag, index) => (
									<Tag key={index} size="small" color="cyan">
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
			render: (record: VenueInfo) => {
				const statusConfig = VENUE_STATUS_CONFIG[record.status];
				return (
					<Badge
						status={
							record.status === VenueStatus.NORMAL ? 'success' : 'default'
						}
						text={<Tag color={statusConfig.color}>{statusConfig.text}</Tag>}
					/>
				);
			},
		},
		{
			title: '创建者',
			key: 'created_by',
			render: (record: VenueInfo) => (
				<div className="creator-info">
					<UserOutlined />
					<Text>{record.created_by}</Text>
				</div>
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
					<Tooltip title="选择项目">
						<Button
							type={curVenue?.id === record.id ? 'primary' : 'default'}
							size="small"
							icon={<EyeOutlined />}
							onClick={() => handleSelectWorkspace(record)}
						>
							{curVenue?.id === record.id ? '当前项目' : '选择'}
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
					<Tooltip title="复制项目ID">
						<Button
							type="text"
							size="small"
							icon={<CopyOutlined />}
							onClick={() => {
								navigator.clipboard.writeText(record.id.toString());
								message.success('项目ID已复制到剪贴板');
							}}
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

	const workspaceList = venues?.data || [];

	return (
		<div className="workspace-manage-page">
			{/* 页面头部 */}
			<div className="workspace-header">
				<div className="header-content">
					<Title level={2} className="page-title">
						<FolderOutlined /> 项目管理
					</Title>
					<Text type="secondary" className="page-subtitle">
						管理您的项目和页面
					</Text>
					{curTeam && (
						<Text type="secondary" className="current-team">
							当前团队：{curTeam.name}
						</Text>
					)}
				</div>
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
			</div>

			{/* 统计卡片 */}
			<Row gutter={[24, 24]} className="stats-row">
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="总项目数"
							value={workspaceList.length}
							prefix={<FolderOutlined />}
							valueStyle={{ color: '#00ffff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="正常项目"
							value={
								workspaceList.filter((w) => w.status === VenueStatus.NORMAL)
									.length
							}
							prefix={<UserOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="当前项目"
							value={curVenue ? 1 : 0}
							prefix={<SettingOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="stat-card">
						<Statistic
							title="总访问量"
							value={workspaceList.reduce((sum, w) => sum + w.view_count, 0)}
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
							<Option value={VenueStatus.NORMAL}>正常</Option>
							<Option value={VenueStatus.DELETED}>已删除</Option>
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
			<Card className="workspace-table-card">
				<Table
					columns={columns}
					dataSource={workspaceList}
					rowKey="id"
					loading={tableLoading}
					pagination={false}
					className="workspace-table"
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
						{editingWorkspace ? (
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
				className="workspace-modal"
				okText={editingWorkspace ? '更新' : '创建'}
				cancelText="取消"
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					className="workspace-form"
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
				</Form>
			</Modal>
		</div>
	);
};

export default WorkspaceManagePage;
