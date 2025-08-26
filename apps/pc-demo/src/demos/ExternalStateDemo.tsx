import React, { useState } from 'react';
import { Button, Space, Card, Tag } from 'antd';
import {
	Form,
	FormItem,
	createFormStore,
	useExternalStateListener,
} from '@easy-page/core';
import { Input } from '@easy-page/pc';

const ExternalStateDemo: React.FC = () => {
	// 创建外部的 store
	const [externalStore] = useState(() =>
		createFormStore('external-store', {
			username: 'external-user',
			email: 'external@example.com',
			age: 25,
			phone: '',
		})
	);

	// 模拟外部状态
	const [userInfo, setUserInfo] = useState({
		userId: 'user-001',
		userType: 'vip',
		activityStatus: 'active',
		region: 'china',
	});

	// 模拟活动状态
	const [activityStatus, setActivityStatus] = useState('active');

	// 为外部 store 添加自定义验证规则
	React.useEffect(() => {
		const validator = externalStore.getValidator();
		validator.addRule('customPhone', async (value, _rule, _store) => {
			if (!value) return { valid: true, field: '' };
			const phoneRegex = /^1[3-9]\d{9}$/;
			if (!phoneRegex.test(value as string)) {
				return {
					valid: false,
					message: '手机号格式不正确',
					field: '',
				};
			}
			return { valid: true, field: '' };
		});
	}, [externalStore]);

	// 使用外部状态监听
	useExternalStateListener(externalStore, userInfo, [
		{
			fields: ['username', 'email'],
			handler: async (externalState, _store) => {
				console.log('用户信息变化:', externalState);

				// 根据用户类型设置不同的默认值
				const isVip = externalState.userType === 'vip';
				const region = externalState.region;

				return {
					username: {
						fieldValue: `${externalState.userId}-${isVip ? 'VIP' : 'NORMAL'}`,
						fieldProps: { disabled: isVip }, // VIP 用户不能修改用户名
					},
					email: {
						fieldValue: `${externalState.userId}@${region}.com`,
						fieldProps: { placeholder: `请输入${region}邮箱` },
					},
				};
			},
			condition: (externalState) =>
				externalState.userType && externalState.region,
		},
	]);

	// 监听活动状态变化
	useExternalStateListener(externalStore, activityStatus, [
		{
			fields: ['age'],
			handler: async (externalState, store) => {
				console.log('活动状态变化:', externalState);

				// 根据活动状态调整年龄限制
				const currentAge = store.getValue('age') as number;
				let newAge = currentAge;

				if (externalState === 'active') {
					// 活动期间，年龄限制放宽
					newAge = Math.max(currentAge || 18, 16);
				} else if (externalState === 'inactive') {
					// 非活动期间，年龄限制收紧
					newAge = Math.max(currentAge || 18, 21);
				}

				return {
					age: {
						fieldValue: newAge,
						fieldProps: {
							min: externalState === 'active' ? 16 : 21,
							max: 100,
							placeholder: `活动期间年龄限制: ${
								externalState === 'active' ? '16+' : '21+'
							}`,
						},
					},
				};
			},
		},
	]);

	const handleSubmit = async (values: any, store: any) => {
		console.log('外部状态表单提交:', values);
		console.log('Store 状态:', store.state);
	};

	return (
		<Card title="外部状态监听示例" style={{ marginBottom: 24 }}>
			<div style={{ marginBottom: 16 }}>
				<h4>当前外部状态:</h4>
				<Space wrap>
					<Tag color="blue">用户ID: {userInfo.userId}</Tag>
					<Tag color={userInfo.userType === 'vip' ? 'gold' : 'default'}>
						用户类型: {userInfo.userType}
					</Tag>
					<Tag color={activityStatus === 'active' ? 'green' : 'red'}>
						活动状态: {activityStatus}
					</Tag>
					<Tag color="purple">地区: {userInfo.region}</Tag>
				</Space>
			</div>

			<Form store={externalStore} onSubmit={handleSubmit}>
				<FormItem
					id="username"
					label="用户名 (外部 Store)"
					required
					validate={[{ required: true, message: '请输入用户名' }]}
				>
					<Input placeholder="请输入用户名" />
				</FormItem>

				<FormItem
					id="phone"
					label="手机号 (自定义验证)"
					validate={[
						{
							validator: (params: {
								value: any;
								store: any;
								rowInfo?: any;
								rowValues: any;
							}) => {
								const { value, store } = params;
								const validator = store.getValidator();
								const customRule = validator.getCustomRule('customPhone');
								if (customRule) {
									return customRule(value, {}, store).then((result: any) => {
										return result.valid || result.message || '验证失败';
									});
								}
								return true;
							},
						},
					]}
				>
					<Input placeholder="请输入手机号" />
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
						查看外部 Store
					</Button>
					<Button
						onClick={async () => {
							// 外部验证示例
							const results = await externalStore.validateAll();
							console.log('外部验证结果:', results);
							if (results.length === 0) {
								alert('所有字段验证通过！');
							} else {
								alert(`验证失败: ${results.map((r) => r.message).join(', ')}`);
							}
						}}
					>
						外部验证
					</Button>
					<Button
						onClick={() => {
							// 外部设置值示例
							externalStore.setValue('username', 'new-external-user');
							externalStore.setValue('phone', '13800138000');
							console.log('已设置新值');
						}}
					>
						外部设置值
					</Button>
				</Space>
			</Form>

			<div style={{ marginTop: 16 }}>
				<h4>外部状态控制:</h4>
				<Space wrap>
					<Button
						onClick={() => {
							setUserInfo((prev) => ({
								...prev,
								userType: prev.userType === 'vip' ? 'normal' : 'vip',
							}));
						}}
					>
						切换用户类型
					</Button>
					<Button
						onClick={() => {
							setUserInfo((prev) => ({
								...prev,
								region: prev.region === 'china' ? 'usa' : 'china',
							}));
						}}
					>
						切换地区
					</Button>
					<Button
						onClick={() => {
							setActivityStatus((prev) =>
								prev === 'active' ? 'inactive' : 'active'
							);
						}}
					>
						切换活动状态
					</Button>
				</Space>
			</div>
		</Card>
	);
};

export default ExternalStateDemo;
