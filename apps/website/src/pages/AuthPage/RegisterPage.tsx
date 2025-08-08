import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useService } from '@/infra';
import { AuthService } from '@/services/auth/authService';
import './AuthPage.less';

interface RegisterFormData {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
	nickname?: string;
}

const RegisterPage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// 使用服务
	const authService = useService(AuthService);

	const onFinish = async (values: RegisterFormData) => {
		setLoading(true);
		try {
			const { confirmPassword, ...registerData } = values;
			const result = await authService.register(registerData);
			if (result.success) {
				message.success('注册成功！请登录');
				navigate('/login');
			} else {
				message.error(result.message || '注册失败');
			}
		} catch (error) {
			message.error('注册失败，请稍后重试');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-container">
				<Card className="auth-card" title="注册 Easy Page">
					<Form
						name="register"
						onFinish={onFinish}
						autoComplete="off"
						size="large"
					>
						<Form.Item
							name="username"
							rules={[
								{ required: true, message: '请输入用户名！' },
								{ min: 3, message: '用户名至少3个字符！' },
								{
									pattern: /^[a-zA-Z0-9_]+$/,
									message: '用户名只能包含字母、数字和下划线！',
								},
							]}
						>
							<Input prefix={<UserOutlined />} placeholder="用户名" />
						</Form.Item>

						<Form.Item
							name="email"
							rules={[
								{ required: true, message: '请输入邮箱！' },
								{ type: 'email', message: '请输入有效的邮箱地址！' },
							]}
						>
							<Input prefix={<MailOutlined />} placeholder="邮箱" />
						</Form.Item>

						<Form.Item
							name="nickname"
							rules={[{ max: 20, message: '昵称不能超过20个字符！' }]}
						>
							<Input prefix={<UserOutlined />} placeholder="昵称（可选）" />
						</Form.Item>

						<Form.Item
							name="password"
							rules={[
								{ required: true, message: '请输入密码！' },
								{ min: 6, message: '密码至少6个字符！' },
							]}
						>
							<Input.Password prefix={<LockOutlined />} placeholder="密码" />
						</Form.Item>

						<Form.Item
							name="confirmPassword"
							dependencies={['password']}
							rules={[
								{ required: true, message: '请确认密码！' },
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue('password') === value) {
											return Promise.resolve();
										}
										return Promise.reject(new Error('两次输入的密码不一致！'));
									},
								}),
							]}
						>
							<Input.Password
								prefix={<LockOutlined />}
								placeholder="确认密码"
							/>
						</Form.Item>

						<Form.Item>
							<Button type="primary" htmlType="submit" loading={loading} block>
								注册
							</Button>
						</Form.Item>
					</Form>

					<Divider>或者</Divider>

					<div className="auth-footer">
						<span>已有账号？</span>
						<Link to="/login">立即登录</Link>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default RegisterPage;
