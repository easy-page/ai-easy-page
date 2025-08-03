import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { motion } from 'framer-motion';
import CoreConcepts from './guide/CoreConcepts';
import Basics from './guide/Basics';
import Advanced from './guide/Advanced';
import './GuidePage.less';

const { Sider, Content } = Layout;
const { Title } = Typography;

const GuidePage: React.FC = () => {
	const location = useLocation();

	const menuItems = [
		{
			key: '/guide/core-concepts',
			label: <Link to="/guide/core-concepts">核心概念</Link>,
		},
		{
			key: '/guide/basics',
			label: <Link to="/guide/basics">基础</Link>,
		},
		{
			key: '/guide/advanced',
			label: <Link to="/guide/advanced">进阶</Link>,
		},
	];

	return (
		<div className="guide-page">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Title level={1} className="page-title">
					指南
				</Title>
				<Title level={4} className="page-subtitle">
					学习如何使用 Easy Page 构建强大的动态表单
				</Title>
			</motion.div>

			<Layout className="guide-layout">
				<Sider className="guide-sider" width={250}>
					<Menu
						mode="inline"
						selectedKeys={[location.pathname]}
						items={menuItems}
						className="guide-menu"
					/>
				</Sider>
				<Content className="guide-content">
					<Routes>
						<Route path="core-concepts" element={<CoreConcepts />} />
						<Route path="basics" element={<Basics />} />
						<Route path="advanced" element={<Advanced />} />
						<Route index element={<CoreConcepts />} />
					</Routes>
				</Content>
			</Layout>
		</div>
	);
};

export default GuidePage;
