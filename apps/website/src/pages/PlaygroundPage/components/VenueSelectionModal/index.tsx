import React, { FC, useState, useEffect } from 'react';
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
} from 'antd';
import {
	PlusOutlined,
	SearchOutlined,
	FormOutlined,
	FileAddOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.less';
import { ChatService } from '../../AiChat/services/chatGlobalState';
import { useService } from '../../AiChat/infra';
import {
	createVenue,
	queryVenues,
	VenueInfo,
	VenuePageType,
} from '../../AiChat/apis/venue';
import { useObservable } from '../../AiChat/hooks/useObservable';
import { appendParamsToUrl } from '../../AiChat/routers/utils';

const { Title, Text } = Typography;
const { Search } = Input;

interface VenueSelectionModalProps {
	visible: boolean;
	onCancel: () => void;
}

interface CreateVenueForm {
	name: string;
	description: string;
	pageType: VenuePageType;
}

const VenueSelectionModal: FC<VenueSelectionModalProps> = ({
	visible,
	onCancel,
}) => {
	const navigate = useNavigate();
	const chatService = useService(ChatService);
	const curTeam = useObservable(chatService.globalState.curTeam$, null);
	const venues = useObservable(chatService.globalState.venues$, null);

	const [activeTab, setActiveTab] = useState('create');
	const [loading, setLoading] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [createForm, setCreateForm] = useState<CreateVenueForm>({
		name: '',
		description: '',
		pageType: VenuePageType.Form,
	});

	const fetchVenues = async () => {
		if (!curTeam) return;

		setLoading(true);
		try {
			const response = await queryVenues({
				team_id: curTeam.id,
				keyword: searchKeyword,
				page_size: 20,
				page_num: 1,
			});

			if (response.success && response.data) {
				chatService.globalState.setVenues({
					data: response.data.data,
					total: response.data.total,
					pageSize: 20,
					pageNo: 1,
				});
			}
		} catch (error) {
			console.error('获取会场列表失败:', error);
			message.error('获取会场列表失败');
		} finally {
			setLoading(false);
		}
	};

	const handleCreateVenue = async () => {
		if (!createForm.name.trim()) {
			message.error('请输入会场名称');
			return;
		}

		// 暂时不要团队
		// if (!curTeam) {
		// 	message.error('请先选择团队');
		// 	return;
		// }

		setLoading(true);
		try {
			const response = await createVenue({
				name: createForm.name.trim(),
				description: createForm.description.trim(),
				pageType: createForm.pageType,
				// team_id: curTeam.id,
			});

			if (response.success && response.data) {
				message.success('会场创建成功');
				chatService.globalState.setCurVenue(response.data);

				// 跳转到playground页面并带上venueId参数
				const playgroundUrl = appendParamsToUrl('/playground', {
					venueId: response.data.id,
				});
				navigate(playgroundUrl);
				onCancel();
			} else {
				message.error(response.message || '创建会场失败');
			}
		} catch (error) {
			console.error('创建会场失败:', error);
			message.error('创建会场失败');
		} finally {
			setLoading(false);
		}
	};

	const handleSelectVenue = (venue: VenueInfo) => {
		chatService.globalState.setCurVenue(venue);

		// 跳转到playground页面并带上venueId参数
		const playgroundUrl = appendParamsToUrl('/playground', {
			venueId: venue.id,
		});
		navigate(playgroundUrl);
		onCancel();
	};

	const handleSearch = (value: string) => {
		setSearchKeyword(value);
		// 延迟搜索，避免频繁请求
		setTimeout(() => {
			fetchVenues();
		}, 300);
	};

	// 监听搜索关键词变化
	useEffect(() => {
		if (visible && curTeam) {
			fetchVenues();
		}
	}, [searchKeyword, visible, curTeam]);

	const filteredVenues =
		venues?.data?.filter(
			(venue: VenueInfo) =>
				venue.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
				venue.description?.toLowerCase().includes(searchKeyword.toLowerCase())
		) || [];

	return (
		<Modal
			title="选择会场"
			open={visible}
			onCancel={onCancel}
			footer={null}
			width={800}
			destroyOnClose
			className="venue-selection-modal"
		>
			<Tabs
				activeKey={activeTab}
				onChange={setActiveTab}
				items={[
					{
						key: 'create',
						label: '创建新会场',
						children: (
							<div style={{ padding: '20px 0' }}>
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
															<Text type="secondary">创建一个基础表单结构</Text>
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
										disabled={!createForm.name.trim()}
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
							<div style={{ padding: '20px 0' }}>
								<div style={{ marginBottom: 16 }}>
									<Search
										placeholder="搜索会场名称或描述"
										allowClear
										onSearch={handleSearch}
										onChange={(e) => setSearchKeyword(e.target.value)}
										style={{ width: '100%' }}
									/>
								</div>

								<Spin spinning={loading}>
									{filteredVenues.length > 0 ? (
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
														<div>
															<Title level={5} style={{ margin: 0 }}>
																{venue.name}
															</Title>
															<Text type="secondary">
																{venue.description || '暂无描述'}
															</Text>
														</div>
														<div style={{ textAlign: 'right' }}>
															<Text type="secondary" style={{ fontSize: 12 }}>
																{venue.pageType === VenuePageType.Form
																	? '表单页面'
																	: '完整页面'}
															</Text>
															<br />
															<Text type="secondary" style={{ fontSize: 12 }}>
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
									)}
								</Spin>
							</div>
						),
					},
				]}
			/>
		</Modal>
	);
};

export default VenueSelectionModal;
