import React, { useState } from 'react';
import { Form, FormItem, createFormStore, FormMode } from '@easy-page/core';
import { Input, Select } from '@easy-page/pc';
import { Button, Space, message, Card, Alert, Spin } from 'antd';

const StateManagementDemo: React.FC = () => {
	const [formData, setFormData] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	// 创建表单 Store
	const store = createFormStore('state-management-demo', {
		username: '',
		email: '',
		role: '',
		permissions: [],
	});

	const handleSubmit = async (values: any) => {
		console.log('状态管理表单提交:', values);
		setFormData(values);
		message.success('提交成功！');
	};

	// 模拟API请求
	const mockApi = {
		fetchUserDetail: async () => {
			setLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setLoading(false);
			return {
				success: true,
				data: {
					username: 'admin',
					email: 'admin@example.com',
					role: 'admin',
				},
			};
		},
		fetchPermissions: async (role: string) => {
			await new Promise((resolve) => setTimeout(resolve, 800));
			const permissionMap: Record<string, string[]> = {
				admin: ['read', 'write', 'delete', 'manage'],
				user: ['read', 'write'],
				guest: ['read'],
			};
			return {
				success: true,
				data: permissionMap[role] || [],
			};
		},
	};

	return (
		<div style={{ padding: '24px' }}>
			<Alert
				message="统一状态管理"
				description="基于 MobX 的响应式状态管理，将 effects、actions、apis 统一管理，支持请求依赖、并发控制、状态同步。"
				type="info"
				showIcon
				style={{ marginBottom: '24px' }}
			/>

			<Spin spinning={loading}>
				<Card title="状态管理演示" style={{ marginBottom: '24px' }}>
					<Form
						store={store}
						mode={FormMode.EDIT}
						initReqs={{
							userDetail: {
								req: async ({ store }) => {
									const result = await mockApi.fetchUserDetail();
									if (result.success) {
										// 设置表单初始值
										store.setValue('username', result.data.username);
										store.setValue('email', result.data.email);
										store.setValue('role', result.data.role);
									}
									return result;
								},
								mode: [FormMode.EDIT, FormMode.VIEW],
							},
							permissions: {
								req: async ({ store, effectedData }) => {
									const userDetail = effectedData?.userDetail;
									if (userDetail?.data?.role) {
										const result = await mockApi.fetchPermissions(
											userDetail.data.role
										);
										if (result.success) {
											store.setValue('permissions', result.data);
										}
										return result;
									}
									return { success: true, data: [] };
								},
								depends: ['userDetail'],
							},
						}}
						onSubmit={handleSubmit}
					>
						<FormItem
							id="username"
							label="用户名"
							required
							validate={[{ required: true, message: '请输入用户名' }]}
						>
							<Input placeholder="请输入用户名" />
						</FormItem>

						<FormItem
							id="email"
							label="邮箱"
							required
							validate={[
								{ required: true, message: '请输入邮箱' },
								{
									pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: '邮箱格式不正确',
								},
							]}
						>
							<Input placeholder="请输入邮箱" />
						</FormItem>

						<FormItem
							id="role"
							label="角色"
							required
							validate={[{ required: true, message: '请选择角色' }]}
							effects={[
								{
									effectedKeys: ['permissions'],
									handler: async ({ store }) => {
										const role = store.getValue('role');
										if (role) {
											const result = await mockApi.fetchPermissions(
												role as string
											);
											return {
												permissions: {
													fieldValue: result.data,
													fieldProps: {},
												},
											};
										}
										return {
											permissions: {
												fieldValue: [],
												fieldProps: {},
											},
										};
									},
								},
							]}
						>
							<Select
								placeholder="请选择角色"
								options={[
									{ label: '管理员', value: 'admin' },
									{ label: '普通用户', value: 'user' },
									{ label: '访客', value: 'guest' },
								]}
							/>
						</FormItem>

						<FormItem id="permissions" label="权限">
							<Select
								mode="multiple"
								placeholder="权限将根据角色自动设置"
								options={[
									{ label: '读取', value: 'read' },
									{ label: '写入', value: 'write' },
									{ label: '删除', value: 'delete' },
									{ label: '管理', value: 'manage' },
								]}
								disabled
							/>
						</FormItem>

						<Space style={{ marginTop: 16 }}>
							<Button type="primary" htmlType="submit">
								提交表单
							</Button>
							<Button htmlType="reset">重置表单</Button>
						</Space>
					</Form>
				</Card>
			</Spin>

			{formData && (
				<Card title="提交结果" type="inner">
					<pre
						style={{
							background: '#f5f5f5',
							padding: '12px',
							borderRadius: '4px',
						}}
					>
						{JSON.stringify(formData, null, 2)}
					</pre>
				</Card>
			)}
		</div>
	);
};

export default StateManagementDemo;
