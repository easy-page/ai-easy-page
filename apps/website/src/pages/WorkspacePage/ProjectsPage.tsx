import React from 'react';
import { Card, Row, Col, Button, Space, Typography, Empty } from 'antd';
import { PlusOutlined, FolderOutlined } from '@ant-design/icons';
import './ProjectsPage.less';

const { Title, Text } = Typography;

const ProjectsPage: React.FC = () => {
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
							<Button type="primary" icon={<PlusOutlined />}>
								新建项目
							</Button>
						}
					>
						<Empty
							image={
								<FolderOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
							}
							description="暂无项目，开始创建您的第一个项目吧！"
						>
							<Button type="primary" icon={<PlusOutlined />}>
								创建项目
							</Button>
						</Empty>
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
