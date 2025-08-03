import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';
import ApiPage from './pages/ApiPage';

const App: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<MainLayout />}>
				<Route index element={<HomePage />} />
				<Route path="guide/*" element={<GuidePage />} />
				<Route path="api/*" element={<ApiPage />} />
			</Route>
		</Routes>
	);
};

export default App;
