import React, { useState } from 'react';
import { Card, Alert, Button, Space, Switch, Typography, Divider } from 'antd';

const { Text, Paragraph } = Typography;

const StateControlDemo: React.FC = () => {
	const [globalDisabled, setGlobalDisabled] = useState(false);
	const [fieldDisabled, setFieldDisabled] = useState({
		username: false,
		email: false,
		phone: false,
	});
	const [activityStatus, setActivityStatus] = useState<
		'active' | 'maintenance'
	>('active');

	const handleFieldDisableChange = (field: string, disabled: boolean) => {
		setFieldDisabled((prev) => ({
			...prev,
			[field]: disabled,
		}));
	};

	return (
		<div style={{ padding: '24px' }}>
			<Alert
				message="灵活状态控制"
				description="支持全局禁用状态、字段级别状态控制、外部状态联动，适应各种业务场景的状态管理需求。"
				type="info"
				showIcon
				style={{ marginBottom: '24px' }}
			/>

			<Card title="状态控制演示" style={{ marginBottom: '24px' }}>
				<div style={{ marginBottom: '24px' }}>
					<Paragraph>
						<Text strong>全局状态控制:</Text>
					</Paragraph>
					<Space>
						<Text>全局禁用:</Text>
						<Switch
							checked={globalDisabled}
							onChange={setGlobalDisabled}
							checkedChildren="禁用"
							unCheckedChildren="启用"
						/>
					</Space>
				</div>

				<Divider />

				<div style={{ marginBottom: '24px' }}>
					<Paragraph>
						<Text strong>字段级别控制:</Text>
					</Paragraph>
					<Space direction="vertical">
						<Space>
							<Text>用户名字段:</Text>
							<Switch
								checked={fieldDisabled.username}
								onChange={(checked) =>
									handleFieldDisableChange('username', checked)
								}
								disabled={globalDisabled}
							/>
						</Space>
						<Space>
							<Text>邮箱字段:</Text>
							<Switch
								checked={fieldDisabled.email}
								onChange={(checked) =>
									handleFieldDisableChange('email', checked)
								}
								disabled={globalDisabled}
							/>
						</Space>
						<Space>
							<Text>手机字段:</Text>
							<Switch
								checked={fieldDisabled.phone}
								onChange={(checked) =>
									handleFieldDisableChange('phone', checked)
								}
								disabled={globalDisabled}
							/>
						</Space>
					</Space>
				</div>

				<Divider />

				<div style={{ marginBottom: '24px' }}>
					<Paragraph>
						<Text strong>外部状态联动:</Text>
					</Paragraph>
					<Space>
						<Text>系统状态:</Text>
						<Button
							type={activityStatus === 'active' ? 'primary' : 'default'}
							onClick={() => setActivityStatus('active')}
						>
							正常运行
						</Button>
						<Button
							type={activityStatus === 'maintenance' ? 'primary' : 'default'}
							onClick={() => setActivityStatus('maintenance')}
						>
							维护模式
						</Button>
					</Space>
				</div>

				<div style={{ marginBottom: '24px' }}>
					<Paragraph>
						<Text strong>模拟表单状态:</Text>
					</Paragraph>
					<div
						style={{
							padding: '16px',
							background: '#f5f5f5',
							borderRadius: '4px',
							opacity:
								globalDisabled || activityStatus === 'maintenance' ? 0.6 : 1,
						}}
					>
						<Space direction="vertical" style={{ width: '100%' }}>
							<div>
								<Text>用户名: </Text>
								<input
									placeholder="请输入用户名"
									disabled={
										globalDisabled ||
										fieldDisabled.username ||
										activityStatus === 'maintenance'
									}
									style={{ marginLeft: '8px', padding: '4px 8px' }}
								/>
							</div>
							<div>
								<Text>邮箱: </Text>
								<input
									placeholder="请输入邮箱"
									disabled={
										globalDisabled ||
										fieldDisabled.email ||
										activityStatus === 'maintenance'
									}
									style={{ marginLeft: '8px', padding: '4px 8px' }}
								/>
							</div>
							<div>
								<Text>手机: </Text>
								<input
									placeholder="请输入手机号"
									disabled={
										globalDisabled ||
										fieldDisabled.phone ||
										activityStatus === 'maintenance'
									}
									style={{ marginLeft: '8px', padding: '4px 8px' }}
								/>
							</div>
						</Space>
					</div>
				</div>
			</Card>

			<Card title="状态控制特性" type="inner">
				<ul style={{ paddingLeft: '20px' }}>
					<li>
						<Text strong>全局禁用状态:</Text>{' '}
						一键禁用整个表单，适用于加载、提交等场景
					</li>
					<li>
						<Text strong>字段级别状态:</Text> 精确控制单个字段的禁用状态
					</li>
					<li>
						<Text strong>外部状态联动:</Text> 根据外部系统状态自动调整表单状态
					</li>
					<li>
						<Text strong>条件禁用:</Text> 基于业务逻辑的条件性禁用控制
					</li>
					<li>
						<Text strong>状态继承:</Text> 子字段自动继承父级的禁用状态
					</li>
				</ul>
			</Card>
		</div>
	);
};

export default StateControlDemo;
