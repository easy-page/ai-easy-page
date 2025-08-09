import React, { FC, useEffect, useMemo, useState } from 'react';
import {
	Modal,
	Tabs,
	Card,
	Space,
	Typography,
	Button,
	Input,
	message,
	Spin,
	Empty,
	Select,
} from 'antd';
import {
	PlusOutlined,
	SearchOutlined,
	FormOutlined,
	FileAddOutlined,
	FolderOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useService } from '@/infra';
import { useObservable } from '@/hooks/useObservable';
import { ChatService } from '@/services/chatGlobalState';
import { appendParamsToUrl } from '@/routers/utils';
import { queryProjects, ProjectInfo, getProjectVenues } from '@/apis/project';
import { createVenue, VenueInfo, VenuePageType } from '@/apis/venue';

const { Title, Text } = Typography;
const { Search } = Input;

export interface VenueProjectModalProps {
	visible: boolean;
	onCancel: () => void;
	initProjectId?: number;
	initVenueId?: number;
	shouldNavigate?: boolean; // 默认 true
	onCompleted?: (payload: { projectId: number; venue: VenueInfo }) => void; // 非跳转模式回调
}

const VenueProjectModal: FC<VenueProjectModalProps> = ({
	visible,
	onCancel,
	initProjectId,
	initVenueId,
	shouldNavigate = true,
	onCompleted,
}) => {
	const navigate = useNavigate();
	const chatService = useService(ChatService);
	const curTeam = useObservable(chatService.globalState.curTeam$, null);

	const [activeTab, setActiveTab] = useState('create');
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<ProjectInfo[]>([]);
	const [projectLoading, setProjectLoading] = useState(false);
	const [venues, setVenues] = useState<VenueInfo[]>([]);
	const [venuesLoading, setVenuesLoading] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [selectedProjectId, setSelectedProjectId] = useState<
		number | undefined
	>(initProjectId);

	const [createForm, setCreateForm] = useState({
		name: '',
		description: '',
		pageType: VenuePageType.Form as VenuePageType,
	});

	// 加载项目列表
	const fetchProjects = async (keyword = '') => {
		setProjectLoading(true);
		try {
			const resp = await queryProjects({
				keyword,
				page_num: 1,
				page_size: 50,
				team_id: curTeam?.id,
			} as any);
			if (resp.success && resp.data) {
				setProjects(resp.data.items || []);
			}
		} catch (err) {
			console.error('加载项目失败', err);
			message.error('加载项目失败');
		} finally {
			setProjectLoading(false);
		}
	};

	// 加载指定项目的会场
	const fetchVenuesByProject = async (projectId?: number) => {
		if (!projectId) return;
		setVenuesLoading(true);
		try {
			const resp = await getProjectVenues({
				project_id: projectId,
				page_num: 1,
				page_size: 100,
			});
			if (resp.success && resp.data) {
				setVenues(resp.data.data || []);
			}
		} catch (err) {
			console.error('加载会场失败', err);
			message.error('加载会场失败');
		} finally {
			setVenuesLoading(false);
		}
	};

	// 首次展示时加载项目
	useEffect(() => {
		if (visible) {
			fetchProjects();
		}
	}, [visible, curTeam?.id]);

	// 选中项目变化时加载该项目下会场
	useEffect(() => {
		if (selectedProjectId) {
			fetchVenuesByProject(selectedProjectId);
		} else {
			setVenues([]);
		}
	}, [selectedProjectId]);

	// 搜索过滤常量
	const filteredVenues = useMemo(() => {
		if (!searchKeyword) return venues;
		return (
			venues?.filter(
				(venue: VenueInfo) =>
					venue.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
					venue.description?.toLowerCase().includes(searchKeyword.toLowerCase())
			) || []
		);
	}, [venues, searchKeyword]);

	// 创建会场
	const handleCreateVenue = async () => {
		if (!selectedProjectId) {
			message.error('请先选择项目');
			return;
		}
		if (!createForm.name.trim()) {
			message.error('请输入会场名称');
			return;
		}
		setLoading(true);
		try {
			const response = await createVenue({
				name: createForm.name.trim(),
				description: createForm.description.trim(),
				pageType: createForm.pageType,
				project_id: selectedProjectId,
			});
			if (response.success && response.data) {
				message.success('会场创建成功');
				chatService.globalState.setCurVenue(response.data);
				if (shouldNavigate) {
					const targetUrl = appendParamsToUrl('/dashboard/playground', {
						projectId: selectedProjectId,
						venueId: response.data.id,
					});
					navigate(targetUrl);
					onCancel();
				} else {
					onCompleted?.({ projectId: selectedProjectId, venue: response.data });
					onCancel();
				}
			} else {
				message.error(response.message || '创建会场失败');
			}
		} catch (err) {
			console.error('创建会场失败', err);
			message.error('创建会场失败');
		} finally {
			setLoading(false);
		}
	};

	// 选择已有会场
	const handleSelectVenue = (venue: VenueInfo) => {
		if (!selectedProjectId) {
			message.error('请先选择项目');
			return;
		}
		chatService.globalState.setCurVenue(venue);
		if (shouldNavigate) {
			const targetUrl = appendParamsToUrl('/dashboard/playground', {
				projectId: selectedProjectId,
				venueId: venue.id,
			});
			navigate(targetUrl);
			onCancel();
		} else {
			onCompleted?.({ projectId: selectedProjectId, venue });
			onCancel();
		}
	};

	return (
		<Modal
			title="选择项目与会场"
			open={visible}
			onCancel={onCancel}
			footer={null}
			width={880}
			destroyOnClose
		>
			<Space direction="vertical" size="large" style={{ width: '100%' }}>
				{/* 项目选择 */}
				<div>
					<Text strong>项目</Text>
					<div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
						<Select
							style={{ flex: 1 }}
							placeholder="请选择项目"
							loading={projectLoading}
							value={selectedProjectId}
							onChange={(val) => setSelectedProjectId(val)}
							showSearch
							optionFilterProp="label"
							options={projects.map((p) => ({ label: p.name, value: p.id }))}
						/>
						<Button icon={<SearchOutlined />} onClick={() => fetchProjects()}>
							刷新
						</Button>
					</div>
				</div>

				<Tabs
					activeKey={activeTab}
					onChange={setActiveTab}
					items={[
						{
							key: 'create',
							label: '创建新会场',
							children: (
								<div style={{ padding: '12px 0' }}>
									<Space
										direction="vertical"
										size="large"
										style={{ width: '100%' }}
									>
										<div>
											<Text strong>会场名称 *</Text>
											<Input
												placeholder="请输入会场名称"
												value={createForm.name}
												onChange={(e) =>
													setCreateForm((prev) => ({
														...prev,
														name: e.target.value,
													}))
												}
												style={{ marginTop: 8 }}
											/>
										</div>

										<div>
											<Text strong>会场描述</Text>
											<Input.TextArea
												placeholder="请输入会场描述（可选）"
												value={createForm.description}
												onChange={(e) =>
													setCreateForm((prev) => ({
														...prev,
														description: e.target.value,
													}))
												}
												rows={3}
												style={{ marginTop: 8 }}
											/>
										</div>

										<div>
											<Text strong>页面类型</Text>
											<div style={{ marginTop: 8 }}>
												<Space direction="vertical" style={{ width: '100%' }}>
													<Card
														hoverable
														className={
															createForm.pageType === VenuePageType.Form
																? 'ant-card-selected'
																: ''
														}
														onClick={() =>
															setCreateForm((prev) => ({
																...prev,
																pageType: VenuePageType.Form,
															}))
														}
														style={{
															cursor: 'pointer',
															borderColor:
																createForm.pageType === VenuePageType.Form
																	? '#1890ff'
																	: undefined,
														}}
													>
														<div
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: 12,
															}}
														>
															<FormOutlined
																style={{ fontSize: 20, color: '#1890ff' }}
															/>
															<div>
																<Title level={5} style={{ margin: 0 }}>
																	表单页面
																</Title>
																<Text type="secondary">
																	创建一个基础表单结构
																</Text>
															</div>
														</div>
													</Card>

													<Card
														hoverable
														className={
															createForm.pageType === VenuePageType.Page
																? 'ant-card-selected'
																: ''
														}
														onClick={() =>
															setCreateForm((prev) => ({
																...prev,
																pageType: VenuePageType.Page,
															}))
														}
														style={{
															cursor: 'pointer',
															borderColor:
																createForm.pageType === VenuePageType.Page
																	? '#1890ff'
																	: undefined,
															opacity: 0.6,
														}}
													>
														<div
															style={{
																display: 'flex',
																alignItems: 'center',
																gap: 12,
															}}
														>
															<FileAddOutlined
																style={{ fontSize: 20, color: '#1890ff' }}
															/>
															<div>
																<Title level={5} style={{ margin: 0 }}>
																	完整页面
																</Title>
																<Text type="secondary">
																	创建一个完整页面（暂未实现）
																</Text>
															</div>
														</div>
													</Card>
												</Space>
											</div>
										</div>

										<Button
											type="primary"
											icon={<PlusOutlined />}
											onClick={handleCreateVenue}
											loading={loading}
											disabled={!createForm.name.trim() || !selectedProjectId}
											block
										>
											创建会场
										</Button>
									</Space>
								</div>
							),
						},
						{
							key: 'select',
							label: '选择已有会场',
							children: (
								<div style={{ padding: '12px 0' }}>
									<div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
										<Search
											placeholder="搜索会场名称或描述"
											allowClear
											onSearch={setSearchKeyword}
											onChange={(e) => setSearchKeyword(e.target.value)}
											style={{ flex: 1 }}
										/>
										<Button
											onClick={() => fetchVenuesByProject(selectedProjectId)}
										>
											刷新
										</Button>
									</div>

									<Spin spinning={venuesLoading}>
										{selectedProjectId ? (
											filteredVenues.length > 0 ? (
												<Space direction="vertical" style={{ width: '100%' }}>
													{filteredVenues.map((venue: VenueInfo) => (
														<Card
															key={venue.id}
															hoverable
															onClick={() => handleSelectVenue(venue)}
															style={{ cursor: 'pointer' }}
														>
															<div
																style={{
																	display: 'flex',
																	justifyContent: 'space-between',
																	alignItems: 'center',
																}}
															>
																<div
																	style={{
																		display: 'flex',
																		alignItems: 'center',
																		gap: 12,
																	}}
																>
																	<FolderOutlined
																		style={{ color: '#1890ff' }}
																	/>
																	<div>
																		<Title level={5} style={{ margin: 0 }}>
																			{venue.name}
																		</Title>
																		<Text type="secondary">
																			{venue.description || '暂无描述'}
																		</Text>
																	</div>
																</div>
																<div style={{ textAlign: 'right' }}>
																	<Text
																		type="secondary"
																		style={{ fontSize: 12 }}
																	>
																		{venue.pageType === VenuePageType.Form
																			? '表单页面'
																			: '完整页面'}
																	</Text>
																	<br />
																	<Text
																		type="secondary"
																		style={{ fontSize: 12 }}
																	>
																		创建于{' '}
																		{new Date(
																			venue.created_at
																		).toLocaleDateString()}
																	</Text>
																</div>
															</div>
														</Card>
													))}
												</Space>
											) : (
												<Empty
													description={
														searchKeyword ? '未找到匹配的会场' : '暂无会场'
													}
													image={Empty.PRESENTED_IMAGE_SIMPLE}
												/>
											)
										) : (
											<Empty
												description={'请先选择项目'}
												image={Empty.PRESENTED_IMAGE_SIMPLE}
											/>
										)}
									</Spin>
								</div>
							),
						},
					]}
				/>
			</Space>
		</Modal>
	);
};

export default VenueProjectModal;
