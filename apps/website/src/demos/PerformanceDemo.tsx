import React, { useState, useEffect } from 'react';
import { Card, Alert, Button, Space, Progress, Typography } from 'antd';

const { Text, Paragraph } = Typography;

const PerformanceDemo: React.FC = () => {
	const [renderCount, setRenderCount] = useState(0);
	const [updateCount, setUpdateCount] = useState(0);
	const [performance, setPerformance] = useState({
		renderTime: 0,
		updateTime: 0,
		memoryUsage: 0,
	});

	useEffect(() => {
		setRenderCount((prev) => prev + 1);
		const startTime = performance.now();

		// 模拟渲染时间计算
		setTimeout(() => {
			const endTime = performance.now();
			setPerformance((prev) => ({
				...prev,
				renderTime: endTime - startTime,
				memoryUsage: Math.random() * 50 + 10, // 模拟内存使用
			}));
		}, 0);
	}, []);

	const handleUpdate = () => {
		const startTime = performance.now();
		setUpdateCount((prev) => prev + 1);

		setTimeout(() => {
			const endTime = performance.now();
			setPerformance((prev) => ({
				...prev,
				updateTime: endTime - startTime,
			}));
		}, 0);
	};

	return (
		<div style={{ padding: '24px' }}>
			<Alert
				message="高性能精准渲染"
				description="基于 MobX 的响应式更新，只更新变化的字段。调度中心控制并发执行，条件触发避免不必要计算。"
				type="info"
				showIcon
				style={{ marginBottom: '24px' }}
			/>

			<Card title="性能监控演示" style={{ marginBottom: '24px' }}>
				<div style={{ marginBottom: '24px' }}>
					<Space direction="vertical" style={{ width: '100%' }}>
						<div>
							<Text strong>渲染次数: </Text>
							<Text type="success">{renderCount}</Text>
						</div>
						<div>
							<Text strong>更新次数: </Text>
							<Text type="warning">{updateCount}</Text>
						</div>
						<div>
							<Text strong>渲染时间: </Text>
							<Text>{performance.renderTime.toFixed(2)}ms</Text>
						</div>
						<div>
							<Text strong>更新时间: </Text>
							<Text>{performance.updateTime.toFixed(2)}ms</Text>
						</div>
					</Space>
				</div>

				<div style={{ marginBottom: '24px' }}>
					<Paragraph>
						<Text strong>内存使用情况:</Text>
					</Paragraph>
					<Progress
						percent={performance.memoryUsage}
						status={performance.memoryUsage > 80 ? 'exception' : 'active'}
						format={(percent) => `${percent?.toFixed(1)}MB`}
					/>
				</div>

				<Space>
					<Button type="primary" onClick={handleUpdate}>
						触发更新
					</Button>
					<Button onClick={() => setRenderCount(0)}>重置计数</Button>
				</Space>
			</Card>

			<Card title="性能优化特性" type="inner">
				<ul style={{ paddingLeft: '20px' }}>
					<li>
						<Text strong>MobX 响应式更新:</Text> 只更新变化的字段，避免全量渲染
					</li>
					<li>
						<Text strong>调度中心控制:</Text> 统一管理并发请求，避免资源竞争
					</li>
					<li>
						<Text strong>条件触发:</Text> 只在必要时触发计算，减少不必要的开销
					</li>
					<li>
						<Text strong>内存管理:</Text> 自动清理无用状态，防止内存泄漏
					</li>
				</ul>
			</Card>
		</div>
	);
};

export default PerformanceDemo;
