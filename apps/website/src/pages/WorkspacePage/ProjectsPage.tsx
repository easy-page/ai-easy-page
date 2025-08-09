import React, { useCallback, useEffect } from 'react';
import {
	Card,
	Row,
	Col,
	Button,
	Space,
	Typography,
	Empty,
	List,
	Avatar,
	Tag,
} from 'antd';
import {
	PlusOutlined,
	FolderOutlined,
	FileTextOutlined,
} from '@ant-design/icons';
import './ProjectsPage.less';
import { useService } from '@/infra';
import { ChatService } from '@/services/chatGlobalState';
import { useObservable } from '@/hooks/useObservable';
import { ProjectInfo, ProjectType, PROJECT_TYPE_CONFIG } from '@/apis/project';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ProjectsPage: React.FC = () => {
	const chatService = useService(ChatService);
	const navigate = useNavigate();
	const projects = useObservable(chatService.globalState.projects$, null);

	const fetchProjects = useCallback(async () => {
		await chatService.getProjects({ page_num: 1, page_size: 100 });
	}, [chatService]);

	useEffect(() => {
		if (!projects) fetchProjects();
	}, [projects, fetchProjects]);

	const list = projects?.data || [];

	return (
		<div className="projects-page">
			{/* 项目装饰元素 */}
			<div className="project-decoration">
				<div className="project-grid"></div>
				<div className="code-lines">
					<div className="code-line"></div>
					<div className="code-line"></div>
					<div className="code-line"></div>
					<div className="code-line"></div>
				</div>
			</div>
			<div className="projects-header">
				<Title level={2}>项目管理</Title>
				<Text type="secondary">管理您的所有项目</Text>
			</div>

			<Row gutter={[24, 24]}>
				<Col xs={24} lg={16}>
					<Card
						title="我的项目"
						extra={
							<Button
								type="primary"
								icon={<PlusOutlined />}
								onClick={() => navigate('/dashboard/workspace')}
							>
								新建项目
							</Button>
						}
					>
						{list.length === 0 ? (
							<Empty
								image={
									<FolderOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
								}
								description="暂无项目，开始创建您的第一个项目吧！"
							>
								<Button
									type="primary"
									icon={<PlusOutlined />}
									onClick={() => navigate('/dashboard/workspace')}
								>
									创建项目
								</Button>
							</Empty>
						) : (
							<List
								dataSource={list}
								renderItem={(item: ProjectInfo) => {
									const typeConfig =
										PROJECT_TYPE_CONFIG[item.project_type as ProjectType];
									return (
										<List.Item
											actions={[
												<Button
													key="open"
													type="link"
													onClick={() =>
														navigate(`/dashboard/workspace/projects/${item.id}`)
													}
												>
													详情
												</Button>,
											]}
										>
											<List.Item.Meta
												avatar={
													<Avatar
														icon={<FileTextOutlined />}
														style={{ backgroundColor: '#00ffff' }}
													/>
												}
												title={item.name}
												description={
													<>
														<span style={{ marginRight: 8 }}>
															{item.description || '暂无描述'}
														</span>
														<Tag color={typeConfig.color}>
															{typeConfig.text}
														</Tag>
													</>
												}
											/>
										</List.Item>
									);
								}}
							/>
						)}
					</Card>
				</Col>
				<Col xs={24} lg={8}>
					<Card title="项目统计">
						<Space direction="vertical" size="large" style={{ width: '100%' }}>
							<div>
								<Text strong>总项目数</Text>
								<div
									style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}
								>
									0
								</div>
							</div>
							<div>
								<Text strong>进行中</Text>
								<div
									style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}
								>
									0
								</div>
							</div>
							<div>
								<Text strong>已完成</Text>
								<div
									style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}
								>
									0
								</div>
							</div>
						</Space>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default ProjectsPage;
