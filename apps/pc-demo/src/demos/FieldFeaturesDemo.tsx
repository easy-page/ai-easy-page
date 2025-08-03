import React from 'react';
import { Button, Space, Card, Tag } from 'antd';
import { Form, FormItem } from '@easy-page/core';
import { Input, Select } from '@easy-page/pc';

const FieldFeaturesDemo: React.FC = () => {
	const handleSubmit = async (values: any, _store: any) => {
		console.log('字段特性表单提交:', values);
	};

	return (
		<Card title="字段特性展示" style={{ marginBottom: 24 }}>
			<Form
				initialValues={{
					username: '',
					email: '',
					userType: '',
					age: 18,
					password: '',
					confirmPassword: '',
				}}
				onSubmit={handleSubmit}
			>
				<FormItem
					id="username"
					label="用户名"
					required
					validate={[
						{ required: true, message: '请输入用户名' },
						{ min: 2, message: '用户名至少2个字符' },
					]}
					extra="用户名将用于登录，建议使用英文和数字组合"
					tips="用户名一旦设置，后续修改需要联系管理员"
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
					extra={({ store }) => {
						const userType = store.getValue('userType');
						return userType === 'vip' ? (
							<Tag color="gold">VIP用户邮箱将收到专属优惠信息</Tag>
						) : (
							'普通用户邮箱'
						);
					}}
					tips="邮箱将用于接收系统通知"
				>
					<Input placeholder="请输入邮箱" />
				</FormItem>

				<FormItem
					id="userType"
					label="用户类型"
					required
					validate={[{ required: true, message: '请选择用户类型' }]}
					extra="选择用户类型将影响后续的权限和功能"
				>
					<Select
						placeholder="请选择用户类型"
						options={[
							{ label: '普通用户', value: 'normal' },
							{ label: 'VIP用户', value: 'vip' },
							{ label: '企业用户', value: 'enterprise' },
						]}
					/>
				</FormItem>

				<FormItem
					id="age"
					label="年龄"
					validate={[{ min: 1, max: 120, message: '年龄必须在1-120之间' }]}
					extra={({ store }) => {
						const age = store.getValue('age') as number;
						if (age < 18) {
							return <Tag color="orange">未成年用户，部分功能受限</Tag>;
						} else if (age >= 60) {
							return <Tag color="blue">老年用户，享受特殊关怀服务</Tag>;
						}
						return '成年用户，享受完整功能';
					}}
					tips="年龄将影响用户权限和功能"
				>
					<Input type="number" placeholder="请输入年龄" />
				</FormItem>

				<FormItem
					id="password"
					label="密码"
					required
					validate={[
						{ required: true, message: '请输入密码' },
						{ min: 6, message: '密码至少6位' },
					]}
					extra="密码必须包含字母和数字，建议使用特殊字符"
					tips="密码强度越高，账户越安全"
				>
					<Input type="password" placeholder="请输入密码" />
				</FormItem>

				<FormItem
					id="confirmPassword"
					label="确认密码"
					required
					validate={[
						{ required: true, message: '请确认密码' },
						{
							validator: (params: {
								value: any;
								store: any;
								rowInfo?: any;
								rowValues: any;
							}) => {
								const { value, store } = params;
								const password = store.getValue('password');
								return value === password || '两次输入的密码不一致';
							},
						},
					]}
					extra={({ store }) => {
						const password = store.getValue('password');
						const confirmPassword = store.getValue('confirmPassword');
						if (confirmPassword && password !== confirmPassword) {
							return <Tag color="red">密码不一致</Tag>;
						}
						if (confirmPassword && password === confirmPassword) {
							return <Tag color="green">密码一致</Tag>;
						}
						return '请再次输入密码';
					}}
				>
					<Input type="password" placeholder="请确认密码" />
				</FormItem>

				<Space>
					<Button type="primary" htmlType="submit">
						提交
					</Button>
					<Button>重置</Button>
				</Space>
			</Form>
		</Card>
	);
};

export default FieldFeaturesDemo;
