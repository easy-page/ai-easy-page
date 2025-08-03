import React from 'react';
import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { motion } from 'framer-motion';
import {
	RocketOutlined,
	CodeOutlined,
	BookOutlined,
	StarOutlined,
} from '@ant-design/icons';
import './HomePage.less';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
	const features = [
		{
			icon: <RocketOutlined />,
			title: '快速开发',
			description: '基于配置的表单生成，大幅提升开发效率',
		},
		{
			icon: <CodeOutlined />,
			title: '类型安全',
			description: '完整的 TypeScript 支持，提供优秀的开发体验',
		},
		{
			icon: <BookOutlined />,
			title: '易于使用',
			description: '简洁的 API 设计，学习成本低',
		},
		{
			icon: <StarOutlined />,
			title: '高度可定制',
			description: '支持自定义组件和样式，满足各种业务需求',
		},
	];

	return (
		<div className="home-page">
			{/* Hero Section */}
			<motion.section
				className="hero-section"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<div className="hero-content">
					<Title level={1} className="hero-title">
						Easy Page
						<span className="gradient-text"> 动态表单框架</span>
					</Title>
					<Paragraph className="hero-description">
						基于 React
						的现代化动态表单框架，提供强大的表单生成能力和优秀的开发体验
					</Paragraph>
					<Space size="large" className="hero-actions">
						<Button type="primary" size="large" className="sci-fi-button">
							开始使用
						</Button>
						<Button size="large" className="outline-button">
							查看文档
						</Button>
					</Space>
				</div>
				<div className="hero-visual">
					<motion.div
						className="floating-card"
						animate={{ y: [-10, 10, -10] }}
						transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
					>
						<div className="code-preview">
							<div className="code-header">
								<div className="code-dots">
									<span></span>
									<span></span>
									<span></span>
								</div>
							</div>
							<div className="code-content">
								<pre>
									<code>
										{`const schema = {
  fields: [
    {
      name: 'name',
      label: '姓名',
      type: 'input'
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'input',
      rules: [
        { required: true, message: '请输入邮箱' }
      ]
    }
  ]
}`}
									</code>
								</pre>
							</div>
						</div>
					</motion.div>
				</div>
			</motion.section>

			{/* Features Section */}
			<motion.section
				className="features-section"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.3 }}
			>
				<Title level={2} className="section-title">
					核心特性
				</Title>
				<Row gutter={[24, 24]}>
					{features.map((feature, index) => (
						<Col xs={24} sm={12} lg={6} key={index}>
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<Card className="feature-card sci-fi-card">
									<div className="feature-icon">{feature.icon}</div>
									<Title level={4} className="feature-title">
										{feature.title}
									</Title>
									<Paragraph className="feature-description">
										{feature.description}
									</Paragraph>
								</Card>
							</motion.div>
						</Col>
					))}
				</Row>
			</motion.section>

			{/* CTA Section */}
			<motion.section
				className="cta-section"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.6 }}
			>
				<Card className="cta-card sci-fi-card">
					<Title level={2} className="cta-title">
						准备开始了吗？
					</Title>
					<Paragraph className="cta-description">
						立即体验 Easy Page 的强大功能，开始构建你的下一个项目
					</Paragraph>
					<Space size="large">
						<Button type="primary" size="large" className="sci-fi-button">
							快速开始
						</Button>
						<Button size="large" className="outline-button">
							查看示例
						</Button>
					</Space>
				</Card>
			</motion.section>
		</div>
	);
};

export default HomePage;
