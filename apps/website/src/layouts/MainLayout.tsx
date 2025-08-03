import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Drawer } from 'antd';
import {
	MenuOutlined,
	GithubOutlined,
	BookOutlined,
	ApiOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import './MainLayout.less';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
	const location = useLocation();

	const menuItems = [
		{
			key: '/',
			icon: <BookOutlined />,
			label: <Link to="/">首页</Link>,
		},
		{
			key: 'guide',
			icon: <BookOutlined />,
			label: '指南',
			children: [
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
			],
		},
		{
			key: 'api',
			icon: <ApiOutlined />,
			label: <Link to="/api">API</Link>,
		},
	];

	const handleMenuClick = ({ key }: { key: string }) => {
		if (key.startsWith('/')) {
			setMobileDrawerVisible(false);
		}
	};

	return (
		<Layout className="main-layout">
			{/* 移动端抽屉 */}
			<Drawer
				title="导航菜单"
				placement="left"
				onClose={() => setMobileDrawerVisible(false)}
				open={mobileDrawerVisible}
				className="mobile-drawer"
			>
				<Menu
					mode="inline"
					selectedKeys={[location.pathname]}
					items={menuItems}
					onClick={handleMenuClick}
					className="mobile-menu"
				/>
			</Drawer>

			{/* 桌面端侧边栏 */}
			<Sider
				trigger={null}
				collapsible
				collapsed={collapsed}
				className="main-sider"
				breakpoint="lg"
				onBreakpoint={(broken) => {
					if (broken) {
						setCollapsed(true);
					}
				}}
			>
				<div className="logo">
					<motion.div
						className="logo-text"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						{!collapsed && <span>Easy Page</span>}
					</motion.div>
				</div>
				<Menu
					mode="inline"
					selectedKeys={[location.pathname]}
					items={menuItems}
					onClick={handleMenuClick}
					className="main-menu"
				/>
			</Sider>

			<Layout>
				<Header className="main-header">
					<div className="header-content">
						<Button
							type="text"
							icon={<MenuOutlined />}
							onClick={() => setMobileDrawerVisible(true)}
							className="mobile-menu-btn"
						/>
						<div className="header-actions">
							<Button
								type="text"
								icon={<GithubOutlined />}
								className="github-btn"
								onClick={() =>
									window.open('https://github.com/your-repo', '_blank')
								}
							>
								GitHub
							</Button>
						</div>
					</div>
				</Header>

				<Content className="main-content">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Outlet />
					</motion.div>
				</Content>
			</Layout>
		</Layout>
	);
};

export default MainLayout;
