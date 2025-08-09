import '@/ui/components/CodeOfSemi';
import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';
import ApiPage from './pages/ApiPage';
import PlaygroundPage from './pages/PlaygroundPage';
import LoginPage from './pages/AuthPage/LoginPage';
import RegisterPage from './pages/AuthPage/RegisterPage';
import WorkspacePage from './pages/WorkspacePage';
import ProjectsPage from './pages/WorkspacePage/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TemplatesPage from './pages/WorkspacePage/TemplatesPage';
import ProfilePage from './pages/ProfilePage';
import TeamPage from './pages/TeamPage';
import AuthGuard from './components/AuthGuard';
import { JarvisThemeProvider, Theme } from './pages/PlaygroundPage/theme';
import { useFrameworkProvider } from './hooks/useFrameworkProvider';
import { AgnoServer } from './providers/agno';
import { FrameworkRoot } from './infra';
const App: React.FC = () => {
	const frameworkProvider = useFrameworkProvider(new AgnoServer());

	if (!frameworkProvider) {
		return <></>;
	}

	// return <AppendSqsCouponStepOne/>

	return (
		<Suspense>
			<FrameworkRoot framework={frameworkProvider}>
				<JarvisThemeProvider
					defaultTheme={Theme.Dark}
					storageKey="jarvis-ui-theme"
				>
					<Routes>
						{/* 登录前的路由 - 使用MainLayout */}
						<Route path="/" element={<MainLayout />}>
							<Route index element={<HomePage />} />
							<Route path="guide/*" element={<GuidePage />} />
							<Route path="api/*" element={<ApiPage />} />
							<Route path="playground" element={<PlaygroundPage />} />
						</Route>

						{/* 登录后的路由 - 使用DashboardLayout */}
						<Route
							path="/dashboard"
							element={
								<AuthGuard>
									<DashboardLayout />
								</AuthGuard>
							}
						>
							<Route path="workspace" element={<WorkspacePage />} />
							<Route path="workspace/projects" element={<ProjectsPage />} />
							<Route
								path="workspace/projects/:projectId"
								element={<ProjectDetailPage />}
							/>
							<Route path="workspace/templates" element={<TemplatesPage />} />
							<Route path="profile" element={<ProfilePage />} />
							<Route path="team" element={<TeamPage />} />
						</Route>

						{/* 认证页面 */}
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
					</Routes>
					{/* <SlateEditorExample /> */}
				</JarvisThemeProvider>
			</FrameworkRoot>
		</Suspense>
	);
};

export default App;
