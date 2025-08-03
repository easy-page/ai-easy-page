import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DemoShowcase from './demos';
import RequestManagementDemo from './demos/RequestManagementDemo';

const App: React.FC = () => {
	return (
		<Router>
			<div>
				<nav
					style={{
						padding: '16px 24px',
						background: '#f0f2f5',
						borderBottom: '1px solid #d9d9d9',
						marginBottom: '24px',
					}}
				>
					<div
						style={{
							maxWidth: 1200,
							margin: '0 auto',
							display: 'flex',
							gap: '24px',
						}}
					>
						<Link
							to="/"
							style={{
								textDecoration: 'none',
								color: '#1890ff',
								fontSize: '16px',
								fontWeight: '500',
							}}
						>
							所有 Demo
						</Link>
						<Link
							to="/loading-demo"
							style={{
								textDecoration: 'none',
								color: '#1890ff',
								fontSize: '16px',
								fontWeight: '500',
							}}
						>
							请求管理 Demo
						</Link>
					</div>
				</nav>

				<Routes>
					<Route path="/" element={<DemoShowcase />} />
					<Route path="/loading-demo" element={<RequestManagementDemo />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
