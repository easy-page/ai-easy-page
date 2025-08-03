import React, { useState } from 'react';
import { Tabs, Button } from 'antd';
import {
	CodeOutlined,
	PlayCircleOutlined,
	GithubOutlined,
} from '@ant-design/icons';
import CodeHighlight from './CodeHighlight';

interface DemoContainerProps {
	sourceCode: string;
	sourceFile: string;
	githubUrl?: string;
	children: React.ReactNode;
	highlights?: string[];
}

const DemoContainer: React.FC<DemoContainerProps> = ({
	sourceCode,
	sourceFile,
	githubUrl,
	children,
	highlights = [],
}) => {
	const [activeTab, setActiveTab] = useState('demo');

	const handleViewSource = () => {
		if (githubUrl) {
			window.open(githubUrl, '_blank');
		}
	};

	const tabItems = [
		{
			key: 'demo',
			label: (
				<span
					style={{
						color: activeTab === 'demo' ? '#1890ff' : '#8c8c8c',
						fontWeight: activeTab === 'demo' ? 'bold' : 'normal',
					}}
				>
					<PlayCircleOutlined style={{ marginRight: '8px' }} />
					运行效果
				</span>
			),
			children: <div className="demo-preview">{children}</div>,
		},
		{
			key: 'code',
			label: (
				<span
					style={{
						color: activeTab === 'code' ? '#1890ff' : '#8c8c8c',
						fontWeight: activeTab === 'code' ? 'bold' : 'normal',
					}}
				>
					<CodeOutlined style={{ marginRight: '8px' }} />
					示例代码
				</span>
			),
			children: (
				<div
					className="demo-code"
					style={{
						height: '635px',
						overflow: 'auto',
						border: '1px solid #7ECEF6',
						padding: '16px',
						borderRadius: '6px',
					}}
				>
					<CodeHighlight language="tsx">{sourceCode}</CodeHighlight>
				</div>
			),
		},
	];

	return (
		<div className="demo-container">
			<Tabs
				activeKey={activeTab}
				onChange={setActiveTab}
				items={tabItems}
				tabBarExtraContent={
					githubUrl && (
						<Button
							type="primary"
							icon={<GithubOutlined />}
							onClick={handleViewSource}
							size="small"
							style={{
								background: '#1890ff',
								borderColor: '#1890ff',
								borderRadius: '6px',
							}}
						>
							查看源码
						</Button>
					)
				}
				style={
					{
						'--ant-primary-color': '#1890ff',
					} as React.CSSProperties
				}
				className="demo-tabs"
			/>
			<style>{`
				.demo-container .demo-tabs .ant-tabs-tab {
					border: none !important;
					background: transparent !important;
				}
				.demo-container .demo-tabs .ant-tabs-tab-active {
					border-bottom: 2px solid #1890ff !important;
					background: transparent !important;
				}
				.demo-container .demo-tabs .ant-tabs-nav {
					border-bottom: none !important;
					background: transparent !important;
				}
				.demo-container .demo-tabs .ant-tabs-nav::before {
					border-bottom: none !important;
				}
				.demo-container .demo-tabs .ant-tabs-content-holder {
					border: none !important;
					background: transparent !important;
				}
				.demo-container .demo-tabs .ant-tabs-tabpane {
					background: transparent !important;
				}
				.demo-container .demo-tabs .ant-tabs-ink-bar {
					background: #1890ff !important;
				}
			`}</style>
		</div>
	);
};

export default DemoContainer;
