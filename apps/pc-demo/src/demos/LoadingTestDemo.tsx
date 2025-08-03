import React from 'react';
import { Form, FormItem, FormMode } from '@easy-page/core';
import { Select, Input } from '@easy-page/pc';

// 自定义 Loading 组件
const CustomLoading: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background: 'rgba(24, 144, 255, 0.1)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: 1000,
			backdropFilter: 'blur(4px)',
		}}
	>
		<div
			style={{
				padding: '20px 30px',
				background: 'linear-gradient(135deg, #1890ff, #722ed1)',
				color: 'white',
				borderRadius: '12px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: '12px',
				boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)',
			}}
		>
			<div
				style={{
					width: '24px',
					height: '24px',
					border: '2px solid rgba(255, 255, 255, 0.3)',
					borderTop: '2px solid white',
					borderRadius: '50%',
					animation: 'spin 1s linear infinite',
				}}
			></div>
			<div style={{ fontSize: '14px', fontWeight: '600' }}>
				正在加载数据，请稍候...
			</div>
		</div>
	</div>
);

const LoadingTestDemo: React.FC = () => {
	// 模拟API请求
	const mockApi = {
		// 获取用户详情
		getUserDetail: async () => {
			await new Promise((resolve) => setTimeout(resolve, 5000)); // 5秒延迟
			return {
				success: true,
				data: {
					id: '1',
					name: '张三',
					email: 'zhangsan@example.com',
					phone: '13800138000',
				},
			};
		},

		// 获取城市列表
		getCities: async () => {
			await new Promise((resolve) => setTimeout(resolve, 3000)); // 3秒延迟
			return {
				success: true,
				data: [
					{ id: '101', name: '朝阳区' },
					{ id: '102', name: '海淀区' },
					{ id: '103', name: '西城区' },
				],
			};
		},
	};

	return (
		<div style={{ padding: '20px' }}>
			<h2>Loading 效果测试</h2>
			<div
				style={{
					marginBottom: '20px',
					padding: '12px 16px',
					background: '#f6ffed',
					border: '1px solid #b7eb8f',
					borderRadius: '6px',
					fontSize: '14px',
				}}
			>
				<strong>💡 测试说明：</strong>
				<ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
					<li>页面加载时会显示 5 秒的 loading 效果</li>
					<li>选择省份后会显示 3 秒的 loading 效果</li>
					<li>可以对比默认 loading 和自定义 loading 的效果</li>
				</ul>
			</div>

			{/* 默认 Loading */}
			<div style={{ marginBottom: '40px' }}>
				<h3>默认 Loading 效果</h3>
				<Form
					mode={FormMode.EDIT}
					initReqs={{
						userDetail: {
							req: async () => {
								const result = await mockApi.getUserDetail();
								return result;
							},
							mode: [FormMode.EDIT],
						},
					}}
				>
					<FormItem id="userId" label="用户ID">
						<Input placeholder="用户ID" />
					</FormItem>

					<FormItem id="userName" label="用户名">
						<Input placeholder="用户名" />
					</FormItem>

					<FormItem id="email" label="邮箱">
						<Input placeholder="邮箱" />
					</FormItem>
				</Form>
			</div>

			{/* 自定义 Loading */}
			<div style={{ marginBottom: '40px' }}>
				<h3>自定义 Loading 效果</h3>
				<Form
					mode={FormMode.EDIT}
					loadingComponent={<CustomLoading />}
					initReqs={{
						userDetail: {
							req: async () => {
								const result = await mockApi.getUserDetail();
								return result;
							},
							mode: [FormMode.EDIT],
						},
					}}
				>
					<FormItem id="customUserId" label="用户ID">
						<Input placeholder="用户ID" />
					</FormItem>

					<FormItem id="customUserName" label="用户名">
						<Input placeholder="用户名" />
					</FormItem>

					<FormItem id="customEmail" label="邮箱">
						<Input placeholder="邮箱" />
					</FormItem>
				</Form>
			</div>

			{/* 联动 Loading 测试 */}
			<div>
				<h3>联动 Loading 测试</h3>
				<Form mode={FormMode.CREATE}>
					<FormItem id="province" label="省份" required>
						<Select
							options={[
								{ value: '1', label: '北京' },
								{ value: '2', label: '上海' },
								{ value: '3', label: '广州' },
							]}
							placeholder="请选择省份"
						/>
					</FormItem>

					<FormItem
						id="city"
						label="城市"
						required
						req={{
							effectedBy: ['province'],
							handler: async () => {
								const result = await mockApi.getCities();
								return result;
							},
						}}
					>
						<Select options={[]} placeholder="请选择城市" />
					</FormItem>
				</Form>
			</div>
		</div>
	);
};

export default LoadingTestDemo;
