import * as React from 'react';
import { Spin, Button, Card } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const SpinExample: React.FC = () => {
	const [loading, setLoading] = React.useState(false);
	const [spinning, setSpinning] = React.useState(false);

	const showLoading = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	};

	const showSpinning = () => {
		setSpinning(true);
		setTimeout(() => {
			setSpinning(false);
		}, 3000);
	};

	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

	return (
		<div style={{ padding: '16px' }}>
			<div style={{ marginBottom: '24px' }}>
				<h4>基础加载</h4>
				<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
					<Spin />
					<Spin size="small" />
					<Spin size="large" />
				</div>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>自定义图标</h4>
				<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
					<Spin indicator={antIcon} />
					<Spin indicator={antIcon} size="small" />
					<Spin indicator={antIcon} size="large" />
				</div>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>加载状态</h4>
				<Button onClick={showLoading} loading={loading}>
					{loading ? '加载中...' : '点击加载'}
				</Button>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>容器加载</h4>
				<Spin spinning={spinning}>
					<Card title="内容卡片" style={{ width: 300 }}>
						<p>这是卡片的内容</p>
						<p>当点击按钮时，整个卡片会显示加载状态</p>
						<Button onClick={showSpinning}>
							开始加载
						</Button>
					</Card>
				</Spin>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>不同大小</h4>
				<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
					<Spin size="small" />
					<Spin />
					<Spin size="large" />
				</div>
			</div>
			
			<div style={{ marginBottom: '24px' }}>
				<h4>提示文字</h4>
				<Spin tip="加载中...">
					<div style={{ padding: '50px', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '4px' }}>
						内容区域
					</div>
				</Spin>
			</div>
		</div>
	);
};

export default SpinExample; 