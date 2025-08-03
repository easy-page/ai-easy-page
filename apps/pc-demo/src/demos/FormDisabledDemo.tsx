import React, { useState } from 'react';
import { Button, Space, Card, Tag, Radio } from 'antd';
import {
	Form,
	FormItem,
	createFormStore,
	useExternalStateListener,
} from '@easy-page/core';
import { Input } from '@easy-page/pc';

const FormDisabledDemo: React.FC = () => {
	// 创建外部的 store
	const [externalStore] = useState(() =>
		createFormStore({
			username: '',
			email: '',
			age: 18,
			phone: '',
			address: '',
		})
	);

	// 模拟表单模式状态
	const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>(
		'create'
	);

	// 模拟活动状态
	const [activityStatus, setActivityStatus] = useState('active');

	// 模拟用户权限状态
	const [userPermission, setUserPermission] = useState('admin');

	// 监听表单模式变化
	useExternalStateListener(externalStore, formMode, [
		{
			fields: ['username', 'email', 'age', 'phone', 'address'],
			handler: async (externalState, store) => {
				console.log('表单模式变化:', externalState);

				// 根据模式设置不同的禁用状态和默认值
				const isViewMode = externalState === 'view';
				const isEditMode = externalState === 'edit';

				if (isViewMode) {
					// 查看模式：所有字段禁用，设置默认值
					store.setDisabled(true);
					return {
						username: {
							fieldValue: '张三',
							fieldProps: { disabled: true },
						},
						email: {
							fieldValue: 'zhangsan@example.com',
							fieldProps: { disabled: true },
						},
						age: {
							fieldValue: 25,
							fieldProps: { disabled: true },
						},
						phone: {
							fieldValue: '13800138000',
							fieldProps: { disabled: true },
						},
						address: {
							fieldValue: '北京市朝阳区',
							fieldProps: { disabled: true },
						},
					};
				} else if (isEditMode) {
					// 编辑模式：部分字段禁用
					store.setDisabled(false);
					console.log('编辑模式：设置用户名禁用');
					return {
						username: {
							fieldValue: '张三',
							fieldProps: { disabled: true }, // 用户名编辑时不能修改
						},
						email: {
							fieldValue: 'zhangsan@example.com',
							fieldProps: { disabled: false },
						},
						age: {
							fieldValue: 25,
							fieldProps: { disabled: false },
						},
						phone: {
							fieldValue: '13800138000',
							fieldProps: { disabled: false },
						},
						address: {
							fieldValue: '北京市朝阳区',
							fieldProps: { disabled: false },
						},
					};
				} else {
					// 创建模式：所有字段可编辑
					store.setDisabled(false);
					return {
						username: {
							fieldValue: '',
							fieldProps: { disabled: false },
						},
						email: {
							fieldValue: '',
							fieldProps: { disabled: false },
						},
						age: {
							fieldValue: 18,
							fieldProps: { disabled: false },
						},
						phone: {
							fieldValue: '',
							fieldProps: { disabled: false },
						},
						address: {
							fieldValue: '',
							fieldProps: { disabled: false },
						},
					};
				}
			},
		},
	]);

	// 监听活动状态变化
	useExternalStateListener(externalStore, activityStatus, [
		{
			fields: ['age', 'phone'],
			handler: async (externalState, store) => {
				console.log('活动状态变化:', externalState);

				// 非活动期间，年龄字段禁用，手机号字段也受影响
				const isActive = externalState === 'active';
				const currentAge = store.getValue('age');
				const currentPhone = store.getValue('phone');

				return {
					age: {
						fieldValue: currentAge,
						fieldProps: {
							disabled: !isActive,
							placeholder: isActive ? '请输入年龄' : '活动已结束，年龄不可修改',
						},
					},
					phone: {
						fieldValue: currentPhone,
						fieldProps: {
							disabled: !isActive,
							placeholder: isActive
								? '请输入手机号'
								: '活动已结束，手机号不可修改',
						},
					},
				};
			},
		},
	]);

	// 监听用户权限变化
	useExternalStateListener(externalStore, userPermission, [
		{
			fields: ['email', 'address'],
			handler: async (externalState, store) => {
				console.log('用户权限变化:', externalState);

				// 只有管理员可以修改邮箱和地址
				const isAdmin = externalState === 'admin';
				const currentEmail = store.getValue('email');
				const currentAddress = store.getValue('address');

				return {
					email: {
						fieldValue: currentEmail,
						fieldProps: {
							disabled: !isAdmin,
							placeholder: isAdmin ? '请输入邮箱' : '权限不足，无法修改邮箱',
						},
					},
					address: {
						fieldValue: currentAddress,
						fieldProps: {
							disabled: !isAdmin,
							placeholder: isAdmin ? '请输入地址' : '权限不足，无法修改地址',
						},
					},
				};
			},
		},
	]);

	const handleSubmit = async (values: any, store: any) => {
		console.log('表单禁用状态提交:', values);
		console.log('Store 状态:', store.state);
	};

	return (
		<Card title="表单禁用状态控制示例" style={{ marginBottom: 24 }}>
			<div style={{ marginBottom: 16 }}>
				<h4>当前状态:</h4>
				<Space wrap>
					<Tag
						color={
							formMode === 'create'
								? 'green'
								: formMode === 'edit'
								? 'blue'
								: 'orange'
						}
					>
						表单模式:{' '}
						{formMode === 'create'
							? '创建'
							: formMode === 'edit'
							? '编辑'
							: '查看'}
					</Tag>
					<Tag color={activityStatus === 'active' ? 'green' : 'red'}>
						活动状态:{' '}
						{activityStatus === 'active' ? '活动进行中' : '活动已结束'}
					</Tag>
					<Tag color={userPermission === 'admin' ? 'gold' : 'default'}>
						用户权限: {userPermission === 'admin' ? '管理员' : '普通用户'}
					</Tag>
				</Space>
			</div>

			<Form store={externalStore} onSubmit={handleSubmit}>
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
					id="age"
					label="年龄"
					validate={[{ min: 1, max: 120, message: '年龄必须在1-120之间' }]}
				>
					<Input type="number" placeholder="请输入年龄" />
				</FormItem>

				<FormItem
					id="phone"
					label="手机号"
					validate={[
						{
							pattern: /^1[3-9]\d{9}$/,
							message: '手机号格式不正确',
						},
					]}
				>
					<Input placeholder="请输入手机号" />
				</FormItem>

				<FormItem
					id="address"
					label="地址"
					validate={[{ required: true, message: '请输入地址' }]}
				>
					<Input placeholder="请输入地址" />
				</FormItem>

				<Space>
					<Button type="primary" htmlType="submit">
						提交
					</Button>
					<Button
						onClick={() => {
							console.log('外部 Store 当前值:', externalStore.state.values);
							console.log('外部 Store 字段状态:', externalStore.state.fields);
						}}
					>
						查看 Store
					</Button>
				</Space>
			</Form>

			<div style={{ marginTop: 16 }}>
				<h4>状态控制:</h4>
				<Space direction="vertical" style={{ width: '100%' }}>
					<div>
						<h5>表单模式:</h5>
						<Radio.Group
							value={formMode}
							onChange={(e) => setFormMode(e.target.value)}
						>
							<Radio.Button value="create">创建模式</Radio.Button>
							<Radio.Button value="edit">编辑模式</Radio.Button>
							<Radio.Button value="view">查看模式</Radio.Button>
						</Radio.Group>
					</div>

					<div>
						<h5>活动状态:</h5>
						<Radio.Group
							value={activityStatus}
							onChange={(e) => setActivityStatus(e.target.value)}
						>
							<Radio.Button value="active">活动进行中</Radio.Button>
							<Radio.Button value="inactive">活动已结束</Radio.Button>
						</Radio.Group>
					</div>

					<div>
						<h5>用户权限:</h5>
						<Radio.Group
							value={userPermission}
							onChange={(e) => setUserPermission(e.target.value)}
						>
							<Radio.Button value="admin">管理员</Radio.Button>
							<Radio.Button value="user">普通用户</Radio.Button>
						</Radio.Group>
					</div>
				</Space>
			</div>

			<div
				style={{
					marginTop: 16,
					padding: 16,
					backgroundColor: '#f5f5f5',
					borderRadius: 6,
				}}
			>
				<h4>说明:</h4>
				<ul>
					<li>
						<strong>创建模式:</strong> 所有字段都可编辑
					</li>
					<li>
						<strong>编辑模式:</strong> 用户名不可修改，其他字段可编辑
					</li>
					<li>
						<strong>查看模式:</strong> 所有字段都禁用，显示默认值
					</li>
					<li>
						<strong>活动状态:</strong> 非活动期间年龄和手机号字段禁用
					</li>
					<li>
						<strong>用户权限:</strong> 只有管理员可以修改邮箱和地址
					</li>
				</ul>
				<p style={{ marginTop: 12, color: '#666' }}>
					<strong>测试建议:</strong>
				</p>
				<ul style={{ color: '#666' }}>
					<li>切换到"编辑模式"，观察用户名是否被禁用</li>
					<li>切换到"活动已结束"，观察年龄和手机号是否被禁用</li>
					<li>切换到"普通用户"，观察邮箱和地址是否被禁用</li>
					<li>组合不同状态，观察字段的禁用效果</li>
				</ul>
			</div>
		</Card>
	);
};

export default FormDisabledDemo;
