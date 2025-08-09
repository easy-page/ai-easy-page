import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Drawer, Space, Avatar, Dropdown } from 'antd';
import {
	MenuOutlined,
	DashboardOutlined,
	UserOutlined,
	TeamOutlined,
	LogoutOutlined,
	SettingOutlined,
	AppstoreOutlined,
	BellOutlined,
	RocketOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import './DashboardLayout.less';

const { Header, Sider, Content } = Layout;

// 登录后的菜单配置
const dashboardMenuConfig = {
	topNav: [
		{
			key: 'workspace',
			path: '/dashboard/workspace',
			label: '工作台',
			icon: <DashboardOutlined />,
		},
		{
			key: 'profile',
			path: '/dashboard/profile',
			label: '个人空间',
			icon: <UserOutlined />,
		},
		{
			key: 'team',
			path: '/dashboard/team',
			label: '团队',
			icon: <TeamOutlined />,
		},
		{
			key: 'playground',
			path: '/dashboard/playground',
			label: 'Playground',
			icon: <RocketOutlined />,
		},
	],
	sideNav: {
		workspace: [
			{
				key: '/dashboard/workspace',
				label: <Link to="/dashboard/workspace">我的工作台</Link>,
			},
			{
				key: '/dashboard/workspace/projects',
				label: <Link to="/dashboard/workspace/projects">项目管理</Link>,
			},
			{
				key: '/dashboard/workspace/templates',
				label: <Link to="/dashboard/workspace/templates">模板库</Link>,
			},
		],
		profile: [
			{
				key: '/dashboard/profile',
				label: <Link to="/dashboard/profile">个人资料</Link>,
			},
			{
				key: '/dashboard/profile/settings',
				label: <Link to="/dashboard/profile/settings">账户设置</Link>,
			},
		],
		team: [
			{
				key: '/dashboard/team',
				label: <Link to="/dashboard/team">团队管理</Link>,
			},
			{
				key: '/dashboard/team/members',
				label: <Link to="/dashboard/team/members">成员管理</Link>,
			},
		],
		playground: [
			{
				key: '/dashboard/playground',
				label: <Link to="/dashboard/playground">Playground</Link>,
			},
		],
	},
};

const DashboardLayout: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
	const location = useLocation();
	const { authService, user } = useAuth();

	const getCurrentTopNavKey = () => {
		const currentPath = location.pathname;
		for (const item of dashboardMenuConfig.topNav) {
			if (currentPath.startsWith(item.path)) {
				return item.key;
			}
		}
		return 'workspace';
	};

	const getCurrentPageType = () => {
		const currentPath = location.pathname;
		if (currentPath.startsWith('/dashboard/workspace')) return 'workspace';
		if (currentPath.startsWith('/dashboard/profile')) return 'profile';
		if (currentPath.startsWith('/dashboard/team')) return 'team';
		if (currentPath.startsWith('/dashboard/playground')) return 'playground';
		return 'workspace';
	};

	const getBreadcrumbText = () => {
		const pageType = getCurrentPageType();
		const navItem = dashboardMenuConfig.topNav.find(
			(item) => item.key === pageType
		);
		return navItem?.label || '工作台';
	};

	// Playground 页面需要更大空间，隐藏左侧菜单栏
	const shouldShowSidebar = () => {
		const pageType = getCurrentPageType();
		if (pageType === 'playground') return false;
		return true;
	};

	const getSideMenuItems = () => {
		const pageType = getCurrentPageType();
		return (
			dashboardMenuConfig.sideNav[
				pageType as keyof typeof dashboardMenuConfig.sideNav
			] || []
		);
	};

	const getSidebarTitle = () => {
		const pageType = getCurrentPageType();
		const navItem = dashboardMenuConfig.topNav.find(
			(item) => item.key === pageType
		);
		return navItem?.label || '';
	};

	const handleMenuClick = ({ key }: { key: string }) => {
		if (key.startsWith('/')) {
			setMobileDrawerVisible(false);
		}
	};

	const handleLogout = async () => {
		await authService.logout();
		window.location.href = '/';
	};

	const userMenuItems = [
		{
			key: 'workspace',
			label: <Link to="/dashboard/workspace">工作台</Link>,
			icon: <DashboardOutlined />,
		},
		{
			key: 'profile',
			label: <Link to="/dashboard/profile">个人空间</Link>,
			icon: <UserOutlined />,
		},
		{
			key: 'team',
			label: <Link to="/dashboard/team">团队</Link>,
			icon: <TeamOutlined />,
		},
		{
			type: 'divider' as const,
		},
		{
			key: 'settings',
			label: <Link to="/dashboard/profile/settings">设置</Link>,
			icon: <SettingOutlined />,
		},
		{
			type: 'divider' as const,
		},
		{
			key: 'logout',
			label: '退出登录',
			icon: <LogoutOutlined />,
			onClick: handleLogout,
		},
	];

	const currentTopNavKey = getCurrentTopNavKey();

	return (
		<Layout className="dashboard-layout">
			{/* 浮动几何图形装饰 */}
			<div className="floating-shapes">
				<div className="shape triangle"></div>
				<div className="shape circle"></div>
				<div className="shape square"></div>
				<div className="shape hexagon"></div>
			</div>

			{/* 光效装饰 */}
			<div className="light-effects">
				<div className="light-beam"></div>
				<div className="light-beam"></div>
				<div className="light-beam"></div>
				<div className="light-beam"></div>
			</div>
			<Drawer
				title={
					<div className="drawer-title">
						<div className="logo-container">
							<div className="logo-icon">
								<AppstoreOutlined />
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
					items={dashboardMenuConfig.topNav.map((item) => ({
						key: item.key === 'workspace' ? item.path : item.key,
						icon: item.icon,
						label: <Link to={item.path}>{item.label}</Link>,
					}))}
					onClick={handleMenuClick}
					className="mobile-menu"
				/>
			</Drawer>

			{shouldShowSidebar() && (
				<Sider
					trigger={null}
					collapsible
					collapsed={collapsed}
					className="dashboard-sider"
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
								<AppstoreOutlined />
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
								工作台
							</motion.div>
						)}
					</div>

					<div className="sider-content">
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

						<Menu
							mode="inline"
							selectedKeys={[location.pathname]}
							items={getSideMenuItems()}
							onClick={handleMenuClick}
							className="dashboard-menu"
						/>
					</div>

					<motion.div
						className="sider-footer"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.4 }}
					>
						<div className="footer-content">
							{!collapsed && (
								<div className="user-info">
									<Avatar
										src={user?.avatar_url}
										icon={<UserOutlined />}
										size="small"
									/>
									<span className="user-name">{user?.username || '用户'}</span>
								</div>
							)}
							<Button
								type="text"
								icon={<LogoutOutlined />}
								className="logout-btn"
								onClick={handleLogout}
								title="退出登录"
							/>
						</div>
					</motion.div>
				</Sider>
			)}

			<Layout>
				<Header className="dashboard-header">
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
								items={dashboardMenuConfig.topNav.map((item) => ({
									key: item.key,
									label: <Link to={item.path}>{item.label}</Link>,
								}))}
							/>
						</div>

						<div className="header-right">
							<Space size="middle">
								<Button
									type="text"
									icon={<BellOutlined />}
									className="notification-btn"
								/>
								<Dropdown
									menu={{ items: userMenuItems }}
									placement="bottomRight"
									arrow
								>
									<Avatar
										src={user?.avatar_url}
										icon={<UserOutlined />}
										className="user-avatar"
										style={{ cursor: 'pointer' }}
									/>
								</Dropdown>
							</Space>
						</div>
					</div>
				</Header>

				<Content className="dashboard-content">
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

export default DashboardLayout;
