import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, Space, Divider } from 'antd';
import {
	MenuOutlined,
	GithubOutlined,
	BookOutlined,
	ApiOutlined,
	HomeOutlined,
	RocketOutlined,
	StarOutlined,
	LeftOutlined,
	RightOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import './MainLayout.less';

const { Header, Sider, Content } = Layout;

// 菜单配置 - 更具扩展性的设计
const menuConfig = {
	// 顶部导航菜单配置
	topNav: [
		{
			key: 'home',
			path: '/',
			label: '首页',
			icon: <HomeOutlined />,
		},
		{
			key: 'guide',
			path: '/guide/core-concepts',
			label: '指南',
			icon: <BookOutlined />,
		},
		{
			key: 'api',
			path: '/api/components',
			label: 'API',
			icon: <ApiOutlined />,
		},
	],

	// 侧边栏菜单配置
	sideNav: {
		guide: [
			{
				key: '/guide/core-concepts',
				label: <Link to="/guide/core-concepts">核心概念</Link>,
				children: [
					{
						key: '/guide/core-concepts/framework-features',
						label: (
							<Link to="/guide/core-concepts/framework-features">框架特点</Link>
						),
					},
					{
						key: '/guide/core-concepts/design-philosophy',
						label: (
							<Link to="/guide/core-concepts/design-philosophy">设计理念</Link>
						),
					},
					{
						key: '/guide/core-concepts/architecture',
						label: <Link to="/guide/core-concepts/architecture">整体架构</Link>,
					},
				],
			},
			{
				key: '/guide/basics',
				label: <Link to="/guide/basics">基础</Link>,
				children: [
					{
						key: '/guide/basics/basic-usage',
						label: <Link to="/guide/basics/basic-usage">基本使用</Link>,
					},
					{
						key: '/guide/basics/field-capabilities',
						label: (
							<Link to="/guide/basics/field-capabilities">字段完整能力</Link>
						),
					},
					{
						key: '/guide/basics/common-components',
						label: <Link to="/guide/basics/common-components">常用组件</Link>,
					},
					{
						key: '/guide/basics/component-extension',
						label: <Link to="/guide/basics/component-extension">组件扩展</Link>,
					},
				],
			},
			{
				key: '/guide/advanced',
				label: <Link to="/guide/advanced">进阶</Link>,
				children: [
					{
						key: '/guide/advanced/linkage',
						label: <Link to="/guide/advanced/linkage">联动</Link>,
					},
					{
						key: '/guide/advanced/validation',
						label: <Link to="/guide/advanced/validation">校验</Link>,
					},
					{
						key: '/guide/advanced/request-management',
						label: (
							<Link to="/guide/advanced/request-management">请求管理</Link>
						),
					},
					{
						key: '/guide/advanced/dynamic-form',
						label: <Link to="/guide/advanced/dynamic-form">动态表单</Link>,
					},
				],
			},
		],
		api: [
			{
				key: '/api/components',
				label: <Link to="/api/components">组件 API</Link>,
			},
			{
				key: '/api/hooks',
				label: <Link to="/api/hooks">Hooks API</Link>,
			},
			{
				key: '/api/types',
				label: <Link to="/api/types">类型定义</Link>,
			},
		],
	},
};

const MainLayout: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
	const location = useLocation();

	// 根据路径获取当前激活的顶级菜单
	const getCurrentTopNavKey = () => {
		const currentPath = location.pathname;

		// 精确匹配首页
		if (currentPath === '/') return 'home';

		// 匹配其他路径
		for (const item of menuConfig.topNav) {
			if (item.key !== 'home' && currentPath.startsWith(`/${item.key}`)) {
				return item.key;
			}
		}

		return 'home';
	};

	// 根据路径获取当前页面类型
	const getCurrentPageType = () => {
		const currentPath = location.pathname;
		if (currentPath === '/') return 'home';
		if (currentPath.startsWith('/guide')) return 'guide';
		if (currentPath.startsWith('/api')) return 'api';
		return 'home';
	};

	// 获取面包屑文本
	const getBreadcrumbText = () => {
		const pageType = getCurrentPageType();
		const navItem = menuConfig.topNav.find((item) => item.key === pageType);
		return navItem?.label || '首页';
	};

	// 获取侧边栏菜单项
	const getSideMenuItems = () => {
		const pageType = getCurrentPageType();
		return (
			menuConfig.sideNav[pageType as keyof typeof menuConfig.sideNav] || []
		);
	};

	// 获取侧边栏标题
	const getSidebarTitle = () => {
		const pageType = getCurrentPageType();
		const navItem = menuConfig.topNav.find((item) => item.key === pageType);
		return navItem?.label || '';
	};

	// 判断是否需要显示侧边栏
	const shouldShowSidebar = () => {
		const pageType = getCurrentPageType();
		return pageType !== 'home' && getSideMenuItems().length > 0;
	};

	const handleMenuClick = ({ key }: { key: string }) => {
		if (key.startsWith('/')) {
			setMobileDrawerVisible(false);
		}
	};

	const currentTopNavKey = getCurrentTopNavKey();
	const currentPageType = getCurrentPageType();
	const isHome = currentPageType === 'home';

	return (
		<Layout className={`main-layout ${isHome ? 'home-layout' : ''}`}>
			{/* 移动端抽屉 */}
			<Drawer
				title={
					<div className="drawer-title">
						<div className="logo-container">
							<div className="logo-icon">
								<RocketOutlined />
							</div>
							<span className="logo-text">Easy Page</span>
						</div>
					</div>
				}
				placement="left"
				onClose={() => setMobileDrawerVisible(false)}
				open={mobileDrawerVisible}
				className="mobile-drawer"
				width={280}
			>
				<Menu
					mode="inline"
					selectedKeys={[location.pathname]}
					items={menuConfig.topNav.map((item) => ({
						key: item.key === 'home' ? item.path : item.key,
						icon: item.icon,
						label: <Link to={item.path}>{item.label}</Link>,
					}))}
					onClick={handleMenuClick}
					className="mobile-menu"
				/>
			</Drawer>

			{/* 桌面端侧边栏 - 根据页面类型决定是否显示 */}
			{shouldShowSidebar() && (
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
					width={280}
				>
					<div className="sider-header">
						<motion.div
							className="logo-container"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
						>
							<div className="logo-icon">
								<RocketOutlined />
							</div>
							{!collapsed && (
								<motion.span
									className="logo-text"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3, delay: 0.2 }}
								>
									Easy Page
								</motion.span>
							)}
						</motion.div>
						{!collapsed && (
							<motion.div
								className="logo-subtitle"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3, delay: 0.3 }}
							>
								动态表单框架
							</motion.div>
						)}
					</div>

					<div className="sider-content">
						{/* 显示当前分类标题 */}
						{!collapsed && (
							<motion.div
								className="category-title"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								{getSidebarTitle()}
							</motion.div>
						)}

						{/* 左侧菜单 */}
						<Menu
							mode="inline"
							selectedKeys={[location.pathname]}
							items={getSideMenuItems()}
							onClick={handleMenuClick}
							className="main-menu"
						/>
					</div>

					{/* 固定在左下角的版本号和GitHub按钮 */}
					<motion.div
						className="sider-footer"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.4 }}
					>
						<Divider className="footer-divider" />
						<div className="footer-content">
							<div className="version-info">
								<span className="version-text">v1.0.0</span>
							</div>
							<div className="footer-actions">
								{!collapsed && (
									<Button
										type="text"
										icon={<GithubOutlined />}
										className="footer-github-btn"
										onClick={() =>
											window.open('https://github.com/your-repo', '_blank')
										}
									>
										GitHub
									</Button>
								)}
								<Button
									type="text"
									icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
									className="collapse-btn"
									onClick={() => setCollapsed(!collapsed)}
								/>
							</div>
						</div>
					</motion.div>
				</Sider>
			)}

			<Layout>
				<Header className={`main-header ${isHome ? 'home-header' : ''}`}>
					<div className="header-content">
						<div className="header-left">
							<Button
								type="text"
								icon={<MenuOutlined />}
								onClick={() => setMobileDrawerVisible(true)}
								className="mobile-menu-btn"
							/>
							<div className="breadcrumb">
								<span className="breadcrumb-item">Easy Page</span>
								<span className="breadcrumb-separator">/</span>
								<span className="breadcrumb-item">{getBreadcrumbText()}</span>
							</div>
						</div>

						<div className="header-center">
							<Menu
								mode="horizontal"
								selectedKeys={[currentTopNavKey]}
								className="header-nav-menu"
								items={menuConfig.topNav.map((item) => ({
									key: item.key,
									label: <Link to={item.path}>{item.label}</Link>,
								}))}
							/>
						</div>

						<div className="header-right">
							<Space size="middle">
								<Button
									type="text"
									icon={<StarOutlined />}
									className="star-btn"
									onClick={() =>
										window.open('https://github.com/your-repo', '_blank')
									}
								>
									Star
								</Button>
								<Button
									type="primary"
									icon={<GithubOutlined />}
									className="github-btn"
									onClick={() =>
										window.open('https://github.com/your-repo', '_blank')
									}
								>
									GitHub
								</Button>
							</Space>
						</div>
					</div>
				</Header>

				<Content className={`main-content ${isHome ? 'home-content' : ''}`}>
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
