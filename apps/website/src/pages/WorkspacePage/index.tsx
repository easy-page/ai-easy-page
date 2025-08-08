import React from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography } from 'antd';
import {
	UserOutlined,
	FileTextOutlined,
	StarOutlined,
	SettingOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import './index.less';

const { Title, Text } = Typography;

const WorkspacePage: React.FC = () => {
	const { user } = useAuth();

	return (
		<div className="workspace-page">
			<div className="workspace-header">
				<Title level={2}>个人工作空间</Title>
				<Text type="secondary">
					欢迎回来，{user?.english_name || user?.username}
				</Text>
			</div>

			<Row gutter={[24, 24]}>
				{/* 统计卡片 */}
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="我的项目"
							value={0}
							prefix={<FileTextOutlined />}
							valueStyle={{ color: '#3f8600' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="收藏项目"
							value={0}
							prefix={<StarOutlined />}
							valueStyle={{ color: '#cf1322' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="今日访问"
							value={1}
							prefix={<UserOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="活跃天数"
							value={1}
							prefix={<UserOutlined />}
							valueStyle={{ color: '#722ed1' }}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[24, 24]} style={{ marginTop: 24 }}>
				{/* 快速操作 */}
				<Col xs={24} lg={12}>
					<Card title="快速操作" extra={<Link to="/profile">个人设置</Link>}>
						<Space direction="vertical" size="middle" style={{ width: '100%' }}>
							<Button
								type="primary"
								icon={<PlusOutlined />}
								size="large"
								block
								onClick={() => window.open('/playground', '_blank')}
							>
								创建新项目
							</Button>
							<Button
								icon={<FileTextOutlined />}
								size="large"
								block
								onClick={() => window.open('/guide/core-concepts', '_blank')}
							>
								查看文档
							</Button>
							<Button
								icon={<SettingOutlined />}
								size="large"
								block
								onClick={() => window.open('/api/components', '_blank')}
							>
								API 文档
							</Button>
						</Space>
					</Card>
				</Col>

				{/* 最近项目 */}
				<Col xs={24} lg={12}>
					<Card title="最近项目" extra={<Link to="/projects">查看全部</Link>}>
						<div className="empty-projects">
							<FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
							<Text
								type="secondary"
								style={{ display: 'block', marginTop: 16 }}
							>
								暂无项目，开始创建您的第一个项目吧！
							</Text>
							<Button
								type="primary"
								style={{ marginTop: 16 }}
								onClick={() => window.open('/playground', '_blank')}
							>
								创建项目
							</Button>
						</div>
					</Card>
				</Col>
			</Row>

			{/* 用户信息卡片 */}
			<Row gutter={[24, 24]} style={{ marginTop: 24 }}>
				<Col xs={24} lg={12}>
					<Card title="个人信息">
						<Space direction="vertical" size="middle" style={{ width: '100%' }}>
							<div>
								<Text strong>用户名：</Text>
								<Text>{user?.username}</Text>
							</div>
							<div>
								<Text strong>英文名：</Text>
								<Text>{user?.english_name}</Text>
							</div>
							<div>
								<Text strong>邮箱：</Text>
								<Text>{user?.email || '未设置'}</Text>
							</div>
							<div>
								<Text strong>手机：</Text>
								<Text>{user?.phone || '未设置'}</Text>
							</div>
							<div>
								<Text strong>注册时间：</Text>
								<Text>
									{new Date(user?.created_at || '').toLocaleDateString()}
								</Text>
							</div>
							<Button
								type="link"
								onClick={() => (window.location.href = '/profile')}
							>
								编辑个人信息
							</Button>
						</Space>
					</Card>
				</Col>

				<Col xs={24} lg={12}>
					<Card title="系统信息">
						<Space direction="vertical" size="middle" style={{ width: '100%' }}>
							<div>
								<Text strong>Easy Page 版本：</Text>
								<Text>v1.0.0</Text>
							</div>
							<div>
								<Text strong>最后登录：</Text>
								<Text>{new Date().toLocaleString()}</Text>
							</div>
							<div>
								<Text strong>账户状态：</Text>
								<Text type="success">正常</Text>
							</div>
						</Space>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default WorkspacePage;
