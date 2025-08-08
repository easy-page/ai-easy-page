import '@/ui/components/CodeOfSemi';
import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';
import ApiPage from './pages/ApiPage';
import PlaygroundPage from './pages/PlaygroundPage';
import LoginPage from './pages/AuthPage/LoginPage';
import RegisterPage from './pages/AuthPage/RegisterPage';
import WorkspacePage from './pages/WorkspacePage';
import ProfilePage from './pages/ProfilePage';
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
						<Route path="/" element={<MainLayout />}>
							<Route index element={<HomePage />} />
							<Route path="guide/*" element={<GuidePage />} />
							<Route path="api/*" element={<ApiPage />} />
							<Route path="playground" element={<PlaygroundPage />} />
							<Route
								path="workspace"
								element={
									<AuthGuard>
										<WorkspacePage />
									</AuthGuard>
								}
							/>
							<Route
								path="profile"
								element={
									<AuthGuard>
										<ProfilePage />
									</AuthGuard>
								}
							/>
						</Route>
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
