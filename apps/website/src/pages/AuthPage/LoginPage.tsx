import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useService } from '@/infra';
import { AuthService } from '@/services/auth/authService';
import './AuthPage.less';

interface LoginFormData {
	username: string;
	password: string;
}

const LoginPage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// 使用服务
	const authService = useService(AuthService);

	const onFinish = async (values: LoginFormData) => {
		setLoading(true);
		try {
			const result = await authService.login(values);
			if (result.success) {
				message.success('登录成功！');
				navigate('/workspace');
			} else {
				message.error(result.message || '登录失败');
			}
		} catch (error) {
			message.error('登录失败，请稍后重试');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-container">
				<Card className="auth-card" title="登录 Easy Page">
					<Form
						name="login"
						onFinish={onFinish}
						autoComplete="off"
						size="large"
					>
						<Form.Item
							name="username"
							rules={[
								{ required: true, message: '请输入用户名！' },
								{ min: 3, message: '用户名至少3个字符！' },
							]}
						>
							<Input prefix={<UserOutlined />} placeholder="用户名" />
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

						<Form.Item>
							<Button type="primary" htmlType="submit" loading={loading} block>
								登录
							</Button>
						</Form.Item>
					</Form>

					<Divider>或者</Divider>

					<div className="auth-footer">
						<span>还没有账号？</span>
						<Link to="/register">立即注册</Link>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default LoginPage;
