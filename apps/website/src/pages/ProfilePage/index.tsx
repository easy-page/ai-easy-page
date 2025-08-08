import React, { useState } from 'react';
import {
	Form,
	Input,
	Button,
	Card,
	message,
	Tabs,
	Avatar,
	Upload,
	Space,
	Typography,
	Divider,
	Row,
	Col,
} from 'antd';
import {
	UserOutlined,
	LockOutlined,
	MailOutlined,
	CameraOutlined,
	SaveOutlined,
	KeyOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import './index.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);
	const { user, authService } = useAuth();

	const [profileForm] = Form.useForm();
	const [passwordForm] = Form.useForm();

	// 个人信息修改
	const onProfileFinish = async (values: any) => {
		setLoading(true);
		try {
			const result = await authService.updateUserInfo(values);
			if (result.success) {
				message.success('个人信息修改成功！');
			} else {
				message.error(result.message || '修改失败');
			}
		} catch (error) {
			message.error('修改失败，请稍后重试');
		} finally {
			setLoading(false);
		}
	};

	// 密码修改
	const onPasswordFinish = async (values: any) => {
		setPasswordLoading(true);
		try {
			const result = await authService.changePassword({
				old_password: values.oldPassword,
				new_password: values.newPassword,
			});
			if (result.success) {
				message.success('密码修改成功！');
				passwordForm.resetFields();
			} else {
				message.error(result.message || '密码修改失败');
			}
		} catch (error) {
			message.error('密码修改失败，请稍后重试');
		} finally {
			setPasswordLoading(false);
		}
	};

	return (
		<div className="profile-page">
			<div className="profile-header">
				<Title level={2}>个人资料</Title>
				<Text type="secondary">管理您的个人信息和账户安全</Text>
			</div>

			<div className="profile-content">
				<Row gutter={[24, 24]}>
					{/* 左侧：头像和基本信息 */}
					<Col xs={24} lg={8}>
						<Card title="基本信息">
							<div className="avatar-section">
								<Avatar
									size={80}
									icon={<UserOutlined />}
									src={user?.avatar_url}
									style={{ marginBottom: 16 }}
								/>
								<Upload
									name="avatar"
									listType="picture-card"
									className="avatar-uploader"
									showUploadList={false}
									beforeUpload={() => false}
								>
									<Button icon={<CameraOutlined />} size="small">
										更换头像
									</Button>
								</Upload>
							</div>
							<Divider />
							<Space
								direction="vertical"
								size="middle"
								style={{ width: '100%' }}
							>
								<div>
									<Text strong>用户名：</Text>
									<Text>{user?.username}</Text>
								</div>
								<div>
									<Text strong>英文名：</Text>
									<Text>{user?.english_name}</Text>
								</div>
								<div>
									<Text strong>邮箱：</Text>
									<Text>{user?.email || '未设置'}</Text>
								</div>
								<div>
									<Text strong>手机：</Text>
									<Text>{user?.phone || '未设置'}</Text>
								</div>
								<div>
									<Text strong>注册时间：</Text>
									<Text>
										{new Date(user?.created_at || '').toLocaleDateString()}
									</Text>
								</div>
							</Space>
						</Card>
					</Col>

					{/* 右侧：表单区域 */}
					<Col xs={24} lg={16}>
						<Card>
							<Tabs defaultActiveKey="profile">
								<TabPane
									tab={
										<span>
											<UserOutlined />
											个人信息
										</span>
									}
									key="profile"
								>
									<Form
										form={profileForm}
										layout="vertical"
										onFinish={onProfileFinish}
										initialValues={{
											english_name: user?.english_name || '',
											email: user?.email || '',
											phone: user?.phone || '',
										}}
									>
										<Form.Item
											label="英文名"
											name="english_name"
											rules={[
												{ required: true, message: '请输入英文名！' },
												{ min: 2, message: '英文名至少2个字符！' },
											]}
										>
											<Input
												prefix={<UserOutlined />}
												placeholder="请输入英文名"
											/>
										</Form.Item>

										<Form.Item
											label="邮箱"
											name="email"
											rules={[
												{ type: 'email', message: '请输入有效的邮箱地址！' },
											]}
										>
											<Input
												prefix={<MailOutlined />}
												placeholder="请输入邮箱（可选）"
											/>
										</Form.Item>

										<Form.Item
											label="手机号码"
											name="phone"
											rules={[
												{ min: 10, max: 11, message: '请输入有效的手机号码！' },
											]}
										>
											<Input
												prefix={<UserOutlined />}
												placeholder="请输入手机号码（可选）"
											/>
										</Form.Item>

										<Form.Item>
											<Button
												type="primary"
												htmlType="submit"
												loading={loading}
												icon={<SaveOutlined />}
											>
												保存修改
											</Button>
										</Form.Item>
									</Form>
								</TabPane>

								<TabPane
									tab={
										<span>
											<KeyOutlined />
											修改密码
										</span>
									}
									key="password"
								>
									<Form
										form={passwordForm}
										layout="vertical"
										onFinish={onPasswordFinish}
									>
										<Form.Item
											label="当前密码"
											name="oldPassword"
											rules={[
												{ required: true, message: '请输入当前密码！' },
												{ min: 6, message: '密码至少6个字符！' },
											]}
										>
											<Input.Password
												prefix={<LockOutlined />}
												placeholder="请输入当前密码"
											/>
										</Form.Item>

										<Form.Item
											label="新密码"
											name="newPassword"
											rules={[
												{ required: true, message: '请输入新密码！' },
												{ min: 6, message: '密码至少6个字符！' },
											]}
										>
											<Input.Password
												prefix={<LockOutlined />}
												placeholder="请输入新密码"
											/>
										</Form.Item>

										<Form.Item
											label="确认新密码"
											name="confirmPassword"
											dependencies={['newPassword']}
											rules={[
												{ required: true, message: '请确认新密码！' },
												({ getFieldValue }) => ({
													validator(_, value) {
														if (
															!value ||
															getFieldValue('newPassword') === value
														) {
															return Promise.resolve();
														}
														return Promise.reject(
															new Error('两次输入的密码不一致！')
														);
													},
												}),
											]}
										>
											<Input.Password
												prefix={<LockOutlined />}
												placeholder="请确认新密码"
											/>
										</Form.Item>

										<Form.Item>
											<Button
												type="primary"
												htmlType="submit"
												loading={passwordLoading}
												icon={<KeyOutlined />}
											>
												修改密码
											</Button>
										</Form.Item>
									</Form>
								</TabPane>
							</Tabs>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default ProfilePage;
