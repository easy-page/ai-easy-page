import React from 'react';
import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { motion } from 'framer-motion';
import {
	RocketOutlined,
	CodeOutlined,
	BookOutlined,
	StarOutlined,
	ThunderboltOutlined,
	ApiOutlined,
	SettingOutlined,
	EyeOutlined,
	CheckCircleOutlined,
	BranchesOutlined,
	BlockOutlined,
} from '@ant-design/icons';
import CodeHighlight from '../components/CodeHighlight';
import './HomePage.less';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
	const features = [
		{
			icon: <RocketOutlined />,
			title: '强大的动态表单',
			description: '支持各种动态表单布局场景，轻松应对复杂业务需求',
		},
		{
			icon: <BranchesOutlined />,
			title: '超强联动能力',
			description: '多字段联动、父子表单联动、上下文联动校验，游刃有余',
		},
		{
			icon: <BookOutlined />,
			title: '统一状态管理',
			description: '将 effects、actions、apis 统一管理，降低复杂度',
		},
		{
			icon: <ThunderboltOutlined />,
			title: '高性能精准渲染',
			description: '基于 MobX，统一调度管理，所有变更都是精准渲染',
		},
		{
			icon: <ApiOutlined />,
			title: '超强扩展性',
			description: '轻松扩展任意组件库，模块化复用，提升开发效率',
		},
		{
			icon: <SettingOutlined />,
			title: '灵活状态控制',
			description: '支持字段禁用切换、外部上下文联动，适应各种业务场景',
		},
		{
			icon: <CodeOutlined />,
			title: '开发配置双模式',
			description: '既可开发也可配置，支持 JSON 化动态渲染',
		},
		{
			icon: <EyeOutlined />,
			title: '智能显隐控制',
			description: '沉淀显示隐藏控制能力，实现各种场景展示需求',
		},
	];

	return (
		<div className="home-page">
			{/* 浮动粒子效果 */}
			<div className="particle" />
			<div className="particle" />
			<div className="particle" />
			<div className="particle" />
			<div className="particle" />

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
								<CodeHighlight
									language="tsx"
									customStyle={{
										fontSize: '13px',
										lineHeight: '1.4',
									}}
								>
									{`import { Form, FormItem, When } from '@easy-page/core';
import { Input, Select } from '@easy-page/pc';

<Form onSubmit={async (values) => console.log(values)}>
 <FormItem
    id="province"
    label="省份"
    effects={[{
      effectedKeys: ['city'],
      handler: async ({ store }) => {
        const province = store.getValue('province');
        return {
          city: {
            fieldValue: '',
            fieldProps: {
              options: await getCities(province)
            }
          }
        };
      }
    }]}
  >
    <Select
      placeholder="请选择省份"
      options={[
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广东', value: 'guangdong' }
      ]}
    />
  </FormItem>
</Form>`}
								</CodeHighlight>
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
						<Col xs={24} sm={12} md={8} lg={6} key={index}>
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
