import React from 'react';
import { Card, Row, Col, Button, Space, Typography, Empty } from 'antd';
import { PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import './TemplatesPage.less';

const { Title, Text } = Typography;

const TemplatesPage: React.FC = () => {
	return (
		<div className="templates-page">
			<div className="templates-header">
				<Title level={2}>模板库</Title>
				<Text type="secondary">浏览和使用各种表单模板</Text>
			</div>

			<Row gutter={[24, 24]}>
				<Col xs={24} lg={16}>
					<Card
						title="可用模板"
						extra={
							<Button type="primary" icon={<PlusOutlined />}>
								上传模板
							</Button>
						}
					>
						<Empty
							image={
								<AppstoreOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
							}
							description="暂无模板，您可以上传自己的模板或使用系统提供的模板"
						>
							<Space>
								<Button type="primary" icon={<PlusOutlined />}>
									上传模板
								</Button>
								<Button>浏览系统模板</Button>
							</Space>
						</Empty>
					</Card>
				</Col>
				<Col xs={24} lg={8}>
					<Card title="模板统计">
						<Space direction="vertical" size="large" style={{ width: '100%' }}>
							<div>
								<Text strong>我的模板</Text>
								<div
									style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}
								>
									0
								</div>
							</div>
							<div>
								<Text strong>系统模板</Text>
								<div
									style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}
								>
									0
								</div>
							</div>
							<div>
								<Text strong>使用次数</Text>
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

export default TemplatesPage;
