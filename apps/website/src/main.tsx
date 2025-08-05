import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import './styles/index.less';

// 黑色主题配置
const darkTheme = {
	token: {
		colorBgContainer: 'rgba(15, 15, 15, 0.8)',
		colorBgElevated: 'rgba(15, 15, 15, 0.9)',
		colorBgLayout: '#0a0a0a',
		colorBgSpotlight: 'rgba(15, 15, 15, 0.95)',
		colorBgMask: 'rgba(0, 0, 0, 0.8)',
		colorBorder: 'rgba(0, 255, 255, 0.3)',
		colorBorderSecondary: 'rgba(0, 255, 255, 0.2)',
		colorPrimary: '#00ffff',
		colorPrimaryHover: '#00cccc',
		colorPrimaryActive: '#009999',
		colorText: '#ffffff',
		colorTextSecondary: 'rgba(255, 255, 255, 0.8)',
		colorTextTertiary: 'rgba(255, 255, 255, 0.6)',
		colorTextQuaternary: 'rgba(255, 255, 255, 0.4)',
		colorFill: 'rgba(0, 255, 255, 0.1)',
		colorFillSecondary: 'rgba(0, 255, 255, 0.05)',
		colorFillTertiary: 'rgba(0, 255, 255, 0.02)',
		colorFillQuaternary: 'rgba(0, 255, 255, 0.01)',
		borderRadius: 6,
		borderRadiusLG: 8,
		borderRadiusSM: 4,
		boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
		boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.3)',
	},
};

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ConfigProvider locale={zhCN} theme={darkTheme}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ConfigProvider>
	</React.StrictMode>
);
