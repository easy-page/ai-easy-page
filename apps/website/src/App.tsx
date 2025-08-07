import '@/pages/PlaygroundPage/AiChat/ui/components/CodeOfSemi';
import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';
import ApiPage from './pages/ApiPage';
import PlaygroundPage from './pages/PlaygroundPage';
import { FrameworkRoot } from './pages/PlaygroundPage/AiChat/infra';
import { JarvisThemeProvider, Theme } from './pages/PlaygroundPage/theme';
import { useFrameworkProvider } from './pages/PlaygroundPage/AiChat/hooks/useFrameworkProvider';
import { AgnoServer } from './pages/PlaygroundPage/AiChat/providers/agno';

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
					defaultTheme={Theme.Yellow}
					storageKey="jarvis-ui-theme"
				>
					<Routes>
						<Route path="/" element={<MainLayout />}>
							<Route index element={<HomePage />} />
							<Route path="guide/*" element={<GuidePage />} />
							<Route path="api/*" element={<ApiPage />} />
							<Route path="playground" element={<PlaygroundPage />} />
						</Route>
					</Routes>
					{/* <SlateEditorExample /> */}
				</JarvisThemeProvider>
			</FrameworkRoot>
		</Suspense>
	);
};

export default App;
