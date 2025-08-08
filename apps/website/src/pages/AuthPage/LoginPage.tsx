import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Divider } from 'antd';
import {
	UserOutlined,
	LockOutlined,
	MailOutlined,
	RocketOutlined,
	CodeOutlined,
	ThunderboltOutlined,
	SafetyOutlined,
} from '@ant-design/icons';
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
			{/* 科技感装饰元素 */}
			<div className="tech-elements">
				<div className="tech-circle"></div>
				<div className="tech-circle"></div>
				<div className="tech-circle"></div>
				<div className="tech-circle"></div>
				<div className="tech-line"></div>
				<div className="tech-line"></div>
			</div>

			<div className="auth-layout">
				{/* 左侧介绍区域 */}
				<div className="intro-section">
					<div className="intro-content">
						<div className="logo-section">
							<div className="logo">Easy Page</div>
							<div className="tagline">下一代动态表单构建框架</div>
						</div>

						<div className="features">
							<div className="feature-item">
								<div className="feature-icon">
									<RocketOutlined />
								</div>
								<div className="feature-text">
									<div className="feature-title">快速构建</div>
									<div className="feature-desc">
										通过配置快速生成复杂的动态表单
									</div>
								</div>
							</div>

							<div className="feature-item">
								<div className="feature-icon">
									<CodeOutlined />
								</div>
								<div className="feature-text">
									<div className="feature-title">高度可定制</div>
									<div className="feature-desc">
										支持自定义组件、验证规则和样式
									</div>
								</div>
							</div>

							<div className="feature-item">
								<div className="feature-icon">
									<ThunderboltOutlined />
								</div>
								<div className="feature-text">
									<div className="feature-title">动态交互</div>
									<div className="feature-desc">
										支持条件显示、联动验证等高级功能
									</div>
								</div>
							</div>

							<div className="feature-item">
								<div className="feature-icon">
									<SafetyOutlined />
								</div>
								<div className="feature-text">
									<div className="feature-title">类型安全</div>
									<div className="feature-desc">
										完整的TypeScript支持，开发体验更佳
									</div>
								</div>
							</div>
						</div>

						<div className="stats">
							<div className="stat-item">
								<div className="stat-number">25+</div>
								<div className="stat-label">内置组件</div>
							</div>
							<div className="stat-item">
								<div className="stat-number">100%</div>
								<div className="stat-label">类型安全</div>
							</div>
							<div className="stat-item">
								<div className="stat-number">∞</div>
								<div className="stat-label">扩展性</div>
							</div>
						</div>
					</div>
				</div>

				{/* 右侧表单区域 */}
				<div className="form-section">
					<div className="auth-container">
						<Card className="auth-card" title="登录">
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
									<Input.Password
										prefix={<LockOutlined />}
										placeholder="密码"
									/>
								</Form.Item>

								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										loading={loading}
										block
									>
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
			</div>
		</div>
	);
};

export default LoginPage;
