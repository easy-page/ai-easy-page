import React from 'react';
import { Form, FormItem, FormMode } from '@easy-page/core';
import { Select, Input } from '@easy-page/pc';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

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

const RequestManagementDemo: React.FC = () => {
	// 模拟API请求
	const mockApi = {
		// 获取城市列表
		getCities: async (provinceId?: string) => {
			await new Promise((resolve) => setTimeout(resolve, 3000)); // 模拟网络延迟 - 3秒

			if (!provinceId) {
				return {
					success: true,
					data: [
						{ id: '1', name: '北京' },
						{ id: '2', name: '上海' },
						{ id: '3', name: '广州' },
						{ id: '4', name: '深圳' },
					],
				};
			}

			// 根据省份ID返回不同的城市
			const cityMap: Record<string, any[]> = {
				'1': [
					{ id: '101', name: '朝阳区' },
					{ id: '102', name: '海淀区' },
					{ id: '103', name: '西城区' },
				],
				'2': [
					{ id: '201', name: '浦东新区' },
					{ id: '202', name: '黄浦区' },
					{ id: '203', name: '徐汇区' },
				],
				'3': [
					{ id: '301', name: '天河区' },
					{ id: '302', name: '越秀区' },
					{ id: '303', name: '海珠区' },
				],
			};

			return {
				success: true,
				data: cityMap[provinceId] || [],
			};
		},

		// 获取用户详情
		getUserDetail: async (userId?: string) => {
			await new Promise((resolve) => setTimeout(resolve, 2500)); // 2.5秒

			return {
				success: true,
				data: {
					id: userId || '1',
					name: '张三',
					email: 'zhangsan@example.com',
					phone: '13800138000',
					department: '技术部',
					role: '开发工程师',
				},
			};
		},

		// 获取系统配置
		getSystemConfig: async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000)); // 2秒

			return {
				success: true,
				data: {
					features: {
						advancedMode: true,
						autoSave: false,
						notifications: true,
					},
					limits: {
						maxFileSize: 10 * 1024 * 1024,
						maxUploadCount: 5,
					},
				},
			};
		},
	};

	return (
		<div style={{ padding: '20px', maxWidth: 1200, margin: '0 auto' }}>
			<div style={{ marginBottom: '32px' }}>
				<Title level={1}>表单请求管理示例</Title>
				<Paragraph style={{ fontSize: '16px', color: '#666' }}>
					展示 Easy Page
					表单框架的请求管理功能，包括初始化请求、字段请求、并发控制、loading
					状态等特性。
				</Paragraph>
			</div>

			<div
				style={{
					marginBottom: '32px',
					padding: '16px 20px',
					background: '#f6ffed',
					border: '1px solid #b7eb8f',
					borderRadius: '8px',
					fontSize: '14px',
				}}
			>
				<strong>💡 测试说明：</strong>
				<ul style={{ margin: '12px 0 0 20px', padding: 0 }}>
					<li>页面加载时会自动触发初始化请求，显示 loading 效果</li>
					<li>创建模式：2秒 loading（系统配置请求）</li>
					<li>编辑模式：2.5秒 + 2秒 loading（用户详情 + 系统配置请求）</li>
					<li>查看模式：2.5秒 loading（用户详情请求）</li>
					<li>城市联动：选择省份后显示3秒 loading（城市列表请求）</li>
				</ul>
			</div>

			{/* 创建模式 */}
			<Card title="创建模式（默认 Loading）" style={{ marginBottom: '32px' }}>
				<Form
					mode={FormMode.CREATE}
					initReqs={{
						systemConfig: {
							req: async () => {
								const result = await mockApi.getSystemConfig();
								return result;
							},
							mode: [FormMode.CREATE, FormMode.EDIT],
						},
					}}
				>
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
							handler: async ({ store }) => {
								const provinceId = store.getValue('province');
								const result = await mockApi.getCities(provinceId as string);
								return result;
							},
						}}
					>
						<Select options={[]} placeholder="请选择城市" />
					</FormItem>

					<FormItem id="name" label="姓名" required>
						<Input placeholder="请输入姓名" />
					</FormItem>
				</Form>
			</Card>

			{/* 编辑模式 */}
			<Card title="编辑模式（自定义 Loading）" style={{ marginBottom: '32px' }}>
				<Form
					mode={FormMode.EDIT}
					loadingComponent={<CustomLoading />}
					initReqs={{
						userDetail: {
							req: async () => {
								const result = await mockApi.getUserDetail('123');
								return result;
							},
							mode: [FormMode.EDIT, FormMode.VIEW],
						},
						systemConfig: {
							req: async () => {
								const result = await mockApi.getSystemConfig();
								return result;
							},
							mode: [FormMode.CREATE, FormMode.EDIT],
							depends: ['userDetail'],
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
			</Card>

			{/* 查看模式 */}
			<Card title="查看模式（函数式 Loading）">
				<Form
					mode={FormMode.VIEW}
					loadingComponent={() => (
						<div
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								background: 'rgba(255, 193, 7, 0.1)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								zIndex: 1000,
							}}
						>
							<div
								style={{
									padding: '16px 24px',
									background: '#ffc107',
									color: '#333',
									borderRadius: '8px',
									fontSize: '14px',
									fontWeight: '600',
								}}
							>
								🔄 数据加载中...
							</div>
						</div>
					)}
					initReqs={{
						userDetail: {
							req: async () => {
								const result = await mockApi.getUserDetail('456');
								return result;
							},
							mode: [FormMode.EDIT, FormMode.VIEW],
						},
					}}
				>
					<FormItem id="viewUserId" label="用户ID">
						<Input placeholder="用户ID" />
					</FormItem>

					<FormItem id="viewUserName" label="用户名">
						<Input placeholder="用户名" />
					</FormItem>

					<FormItem id="viewEmail" label="邮箱">
						<Input placeholder="邮箱" />
					</FormItem>
				</Form>
			</Card>
		</div>
	);
};

export default RequestManagementDemo;
