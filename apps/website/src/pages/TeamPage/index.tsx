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
	Tabs,
	Select,
	DatePicker,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	TeamOutlined,
	UserOutlined,
	SettingOutlined,
	EyeOutlined,
	CopyOutlined,
	FolderOutlined,
	SearchOutlined,
	FilterOutlined,
	ExportOutlined,
} from '@ant-design/icons';
import { useObservable } from '@/hooks/useObservable';
import { useService } from '@/infra';
import { ChatService } from '@/services/chatGlobalState';
import {
	TeamInfo,
	createTeam,
	updateTeam,
	queryTeams,
	deleteTeam,
	TeamCreateParams,
	TeamUpdateParams,
} from '@/apis/team';
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
import './index.less';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface TeamPageProps {
	onTeamSelect?: (team: TeamInfo) => void;
}

const TeamPage: React.FC<TeamPageProps> = ({ onTeamSelect }) => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('teams');
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTeam, setEditingTeam] = useState<TeamInfo | null>(null);
	const [editingWorkspace, setEditingWorkspace] = useState<VenueInfo | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [tableLoading, setTableLoading] = useState(false);
	const [workspaceTableLoading, setWorkspaceTableLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [projectType, setProjectType] = useState<'personal' | 'team'>(
		'personal'
	);

	const chatService = useService(ChatService);

	const userTeams = useObservable(chatService.globalState.userTeams$, []);
	const curTeam = useObservable(chatService.globalState.curTeam$, null);
	const curVenue = useObservable(chatService.globalState.curVenue$, null);
	const venues = useObservable(chatService.globalState.venues$, null);

	// 获取团队列表
	const fetchTeams = async () => {
		setTableLoading(true);
		try {
			const response = await queryTeams({
				page_size: 100,
				page_num: 1,
			});
			if (response.data) {
				chatService.globalState.setUserTeams(response.data.data || []);
			}
		} catch (error) {
			message.error('获取团队列表失败');
			console.error('Fetch teams error:', error);
		} finally {
			setTableLoading(false);
		}
	};

	// 创建或更新团队
	const handleSubmit = async (values: any) => {
		setLoading(true);
		try {
			if (editingTeam) {
				await updateTeam({
					team_id: editingTeam.id,
					team_data: values,
				});
				message.success('团队更新成功');
			} else {
				await createTeam(values as TeamCreateParams);
				message.success('团队创建成功');
			}
			setIsModalVisible(false);
			form.resetFields();
			setEditingTeam(null);
			fetchTeams();
		} catch (error) {
			message.error(editingTeam ? '团队更新失败' : '团队创建失败');
			console.error('Submit team error:', error);
		} finally {
			setLoading(false);
		}
	};

	// 删除团队
	const handleDelete = async (teamId: number) => {
		try {
			await deleteTeam({ team_id: teamId });
			message.success('团队删除成功');
			fetchTeams();
		} catch (error) {
			message.error('团队删除失败');
			console.error('Delete team error:', error);
		}
	};

	// 选择团队
	const handleSelectTeam = (team: TeamInfo) => {
		chatService.globalState.setCurTeam(team);
		onTeamSelect?.(team);
		message.success(`已选择团队：${team.name}`);
	};

	// 打开编辑模态框
	const showEditModal = (team: TeamInfo) => {
		setEditingTeam(team);
		form.setFieldsValue({
			name: team.name,
			description: team.description,
			icon: team.icon,
		});
		setIsModalVisible(true);
	};

	// 打开创建模态框
	const showCreateModal = () => {
		setEditingTeam(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	// 关闭模态框
	const handleCancel = () => {
		setIsModalVisible(false);
		setEditingTeam(null);
		form.resetFields();
	};

	// 获取项目列表
	const fetchWorkspaces = async () => {
		setWorkspaceTableLoading(true);
		try {
			const response = await queryVenues({
				team_id: curTeam?.id || undefined, // 如果没有选择团队，则获取个人项目
				page_size: 100,
				page_num: 1,
				keyword: searchText || undefined,
				status:
					statusFilter === 'all' ? undefined : (statusFilter as VenueStatus),
			});
			if (response.data) {
				chatService.globalState.setVenues({
					...response.data,
					pageSize: 100,
					pageNo: 1,
				});
			}
		} catch (error) {
			message.error('获取项目列表失败');
			console.error('Fetch workspaces error:', error);
		} finally {
			setWorkspaceTableLoading(false);
		}
	};

	// 创建或更新项目
	const handleWorkspaceSubmit = async (values: any) => {
		setLoading(true);
		try {
			if (editingWorkspace) {
				await updateVenue({
					venue_id: editingWorkspace.id.toString(),
					venue_data: values,
				});
				message.success('项目更新成功');
			} else {
				// 根据项目类型决定team_id
				const teamId = projectType === 'team' ? curTeam?.id : null;
				if (projectType === 'team' && !curTeam) {
					message.error('请先选择一个团队');
					setLoading(false);
					return;
				}

				await createVenue({
					...values,
					team_id: teamId,
				} as VenueCreateParams);
				message.success('项目创建成功');
			}
			setIsModalVisible(false);
			form.resetFields();
			setEditingWorkspace(null);
			setProjectType('personal');
			fetchWorkspaces();
		} catch (error) {
			message.error(editingWorkspace ? '项目更新失败' : '项目创建失败');
			console.error('Submit workspace error:', error);
		} finally {
			setLoading(false);
		}
	};

	// 删除项目
	const handleDeleteWorkspace = async (venueId: number) => {
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
		message.success(`已选择项目：${workspace.name}`);
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
		fetchTeams();
	}, []);

	useEffect(() => {
		fetchWorkspaces();
	}, [curTeam, searchText, statusFilter]);

	const workspaceList = venues?.data || [];

	// 项目表格列配置
	const workspaceColumns = [
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
							onClick={() => {
								setEditingWorkspace(record);
								form.setFieldsValue({
									name: record.name,
									description: record.description,
									icon: record.icon,
									tags: record.tags,
								});
								setIsModalVisible(true);
							}}
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
							onConfirm={() => handleDeleteWorkspace(record.id)}
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

	// 团队表格列配置
	const columns = [
		{
			title: '团队信息',
			key: 'team_info',
			render: (record: TeamInfo) => (
				<div className="team-info-cell">
					<Avatar
						size={40}
						icon={<TeamOutlined />}
						style={{ backgroundColor: '#00ffff' }}
					/>
					<div className="team-details">
						<div className="team-name">{record.name}</div>
						<div className="team-description">
							{record.description || '暂无描述'}
						</div>
					</div>
				</div>
			),
		},
		{
			title: '状态',
			key: 'status',
			render: (record: TeamInfo) => (
				<Badge
					status={record.status === 'active' ? 'success' : 'default'}
					text={
						<Tag color={record.status === 'active' ? 'green' : 'default'}>
							{record.status === 'active' ? '活跃' : '非活跃'}
						</Tag>
					}
				/>
			),
		},
		{
			title: '管理员',
			key: 'admin_user',
			render: (record: TeamInfo) => (
				<div className="admin-info">
					<UserOutlined />
					<Text>{record.admin_user}</Text>
				</div>
			),
		},
		{
			title: '创建时间',
			key: 'created_at',
			render: (record: TeamInfo) => (
				<Text type="secondary">
					{new Date(record.created_at).toLocaleDateString()}
				</Text>
			),
		},
		{
			title: '操作',
			key: 'actions',
			render: (record: TeamInfo) => (
				<Space size="small">
					<Tooltip title="选择团队">
						<Button
							type={curTeam?.id === record.id ? 'primary' : 'default'}
							size="small"
							icon={<EyeOutlined />}
							onClick={() => handleSelectTeam(record)}
						>
							{curTeam?.id === record.id ? '当前团队' : '选择'}
						</Button>
					</Tooltip>
					<Tooltip title="编辑团队">
						<Button
							type="text"
							size="small"
							icon={<EditOutlined />}
							onClick={() => showEditModal(record)}
						/>
					</Tooltip>
					<Tooltip title="复制团队ID">
						<Button
							type="text"
							size="small"
							icon={<CopyOutlined />}
							onClick={() => {
								navigator.clipboard.writeText(record.id.toString());
								message.success('团队ID已复制到剪贴板');
							}}
						/>
					</Tooltip>
					<Tooltip title="删除团队">
						<Popconfirm
							title="确定要删除这个团队吗？"
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

	return (
		<div className="team-page">
			{/* 团队协作装饰元素 */}
			<div className="team-decoration">
				<div className="collaboration-network"></div>
				<div className="connection-lines">
					<div className="connection-line"></div>
					<div className="connection-line"></div>
					<div className="connection-line"></div>
				</div>
			</div>
			<div className="team-header">
				<div className="header-content">
					<Title level={2} className="page-title">
						<TeamOutlined /> 管理中心
					</Title>
					<Text type="secondary" className="page-subtitle">
						管理您的团队和项目
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
					onClick={
						activeTab === 'teams'
							? showCreateModal
							: () => {
									setEditingWorkspace(null);
									form.resetFields();
									setIsModalVisible(true);
							  }
					}
					className="create-btn"
					disabled={false}
				>
					{activeTab === 'teams' ? '创建团队' : '创建项目'}
				</Button>
			</div>

			<Tabs
				activeKey={activeTab}
				onChange={(key) => {
					if (key === 'workspaces') {
						navigate('/dashboard/workspace/projects');
						return;
					}
					setActiveTab(key);
				}}
				className="manage-tabs"
				items={[
					{
						key: 'teams',
						label: (
							<span className="tab-label">
								<TeamOutlined />
								团队管理
								{curTeam && (
									<Text type="secondary" className="current-indicator">
										({curTeam.name})
									</Text>
								)}
							</span>
						),
						children: (
							<>
								<Row gutter={[24, 24]} className="stats-row">
									<Col xs={24} sm={12} lg={6}>
										<Card className="stat-card">
											<Statistic
												title="总团队数"
												value={userTeams.length}
												prefix={<TeamOutlined />}
												valueStyle={{ color: '#00ffff' }}
											/>
										</Card>
									</Col>
									<Col xs={24} sm={12} lg={6}>
										<Card className="stat-card">
											<Statistic
												title="活跃团队"
												value={
													userTeams.filter((t) => t.status === 'active').length
												}
												prefix={<UserOutlined />}
												valueStyle={{ color: '#52c41a' }}
											/>
										</Card>
									</Col>
									<Col xs={24} sm={12} lg={6}>
										<Card className="stat-card">
											<Statistic
												title="当前团队"
												value={curTeam ? 1 : 0}
												prefix={<SettingOutlined />}
												valueStyle={{ color: '#1890ff' }}
											/>
										</Card>
									</Col>
									<Col xs={24} sm={12} lg={6}>
										<Card className="stat-card">
											<Statistic
												title="本月新增"
												value={0}
												prefix={<PlusOutlined />}
												valueStyle={{ color: '#722ed1' }}
											/>
										</Card>
									</Col>
								</Row>

								<Card className="team-table-card">
									<Table
										columns={columns}
										dataSource={userTeams}
										rowKey="id"
										loading={tableLoading}
										pagination={false}
										className="team-table"
										locale={{
											emptyText: (
												<div className="empty-state">
													<TeamOutlined
														style={{ fontSize: 24, color: '#666' }}
													/>
													<Text type="secondary" style={{ display: 'block' }}>
														暂无团队，创建您的第一个团队开始协作吧！
													</Text>
													<Button
														type="primary"
														icon={<PlusOutlined />}
														onClick={showCreateModal}
													>
														创建团队
													</Button>
												</div>
											),
										}}
									/>
								</Card>
							</>
						),
					},
					{
						key: 'workspaces',
						label: (
							<span className="tab-label">
								<FolderOutlined />
								项目管理
							</span>
						),
						children: null,
						disabled: false,
					},
				]}
			/>

			<Modal
				title={
					<div className="modal-title">
						{activeTab === 'teams' ? (
							editingTeam ? (
								<>
									<EditOutlined /> 编辑团队
								</>
							) : (
								<>
									<PlusOutlined /> 创建团队
								</>
							)
						) : editingWorkspace ? (
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
				className="team-modal"
				okText={
					activeTab === 'teams'
						? editingTeam
							? '更新'
							: '创建'
						: editingWorkspace
						? '更新'
						: '创建'
				}
				cancelText="取消"
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={
						activeTab === 'teams' ? handleSubmit : handleWorkspaceSubmit
					}
					className="team-form"
				>
					{activeTab === 'workspaces' && !editingWorkspace && (
						<Form.Item
							name="projectType"
							label="项目类型"
							initialValue="personal"
						>
							<Select
								placeholder="请选择项目类型"
								onChange={(value) => setProjectType(value)}
								value={projectType}
							>
								<Option value="personal">个人项目</Option>
								<Option value="team" disabled={!curTeam}>
									团队项目 {!curTeam && '(请先选择团队)'}
								</Option>
							</Select>
						</Form.Item>
					)}

					<Form.Item
						name="name"
						label={activeTab === 'teams' ? '团队名称' : '项目名称'}
						rules={[
							{
								required: true,
								message: `请输入${activeTab === 'teams' ? '团队' : '项目'}名称`,
							},
							{
								max: 50,
								message: `${
									activeTab === 'teams' ? '团队' : '项目'
								}名称不能超过50个字符`,
							},
						]}
					>
						<Input
							placeholder={`请输入${
								activeTab === 'teams' ? '团队' : '项目'
							}名称`}
							prefix={
								activeTab === 'teams' ? <TeamOutlined /> : <FolderOutlined />
							}
							maxLength={50}
						/>
					</Form.Item>

					<Form.Item
						name="description"
						label={activeTab === 'teams' ? '团队描述' : '项目描述'}
						rules={[
							{
								max: 200,
								message: `${
									activeTab === 'teams' ? '团队' : '项目'
								}描述不能超过200个字符`,
							},
						]}
					>
						<TextArea
							placeholder={`请输入${
								activeTab === 'teams' ? '团队' : '项目'
							}描述（可选）`}
							rows={4}
							maxLength={200}
							showCount
						/>
					</Form.Item>

					{activeTab === 'workspaces' && (
						<Form.Item name="tags" label="项目标签">
							<Input
								placeholder="请输入项目标签，用逗号分隔（可选）"
								prefix={<SettingOutlined />}
							/>
						</Form.Item>
					)}

					<Form.Item
						name="icon"
						label={activeTab === 'teams' ? '团队图标' : '项目图标'}
					>
						<Input
							placeholder={`请输入${
								activeTab === 'teams' ? '团队' : '项目'
							}图标URL（可选）`}
							prefix={<SettingOutlined />}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default TeamPage;
