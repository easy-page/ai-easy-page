import React, { useState } from 'react';
import { Card, Alert, Select, Switch, Typography, Space, Divider } from 'antd';

const { Text, Paragraph } = Typography;

const VisibilityControlDemo: React.FC = () => {
	const [userType, setUserType] = useState<string>('');
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [region, setRegion] = useState<string>('');

	// 模拟 When 组件的显示逻辑
	const shouldShowVipFields = userType === 'vip';
	const shouldShowAdminFields = userType === 'admin';
	const shouldShowAdvancedFields = showAdvanced;
	const shouldShowRegionFields = region === 'china';

	return (
		<div style={{ padding: '24px' }}>
			<Alert
				message="智能显隐控制"
				description="When 组件支持精准的依赖监听，Container 组件支持容器级别显隐，动态表单支持行级别显隐控制。"
				type="info"
				showIcon
				style={{ marginBottom: '24px' }}
			/>

			<Card title="显隐控制演示" style={{ marginBottom: '24px' }}>
				<div style={{ marginBottom: '24px' }}>
					<Paragraph>
						<Text strong>控制字段:</Text>
					</Paragraph>
					<Space wrap>
						<div>
							<Text>用户类型: </Text>
							<Select
								style={{ width: 120 }}
								placeholder="选择类型"
								value={userType}
								onChange={setUserType}
								options={[
									{ label: '普通用户', value: 'normal' },
									{ label: 'VIP用户', value: 'vip' },
									{ label: '管理员', value: 'admin' },
								]}
							/>
						</div>
						<div>
							<Text>显示高级设置: </Text>
							<Switch checked={showAdvanced} onChange={setShowAdvanced} />
						</div>
						<div>
							<Text>地区: </Text>
							<Select
								style={{ width: 120 }}
								placeholder="选择地区"
								value={region}
								onChange={setRegion}
								options={[
									{ label: '中国', value: 'china' },
									{ label: '美国', value: 'usa' },
									{ label: '日本', value: 'japan' },
								]}
							/>
						</div>
					</Space>
				</div>

				<Divider />

				<div style={{ marginBottom: '24px' }}>
					<Paragraph>
						<Text strong>条件显示的字段:</Text>
					</Paragraph>

					<div
						style={{
							padding: '16px',
							background: '#f5f5f5',
							borderRadius: '4px',
							minHeight: '200px',
						}}
					>
						{/* 基础字段 - 始终显示 */}
						<div style={{ marginBottom: '12px' }}>
							<Text>用户名: </Text>
							<input
								placeholder="请输入用户名"
								style={{ marginLeft: '8px', padding: '4px 8px' }}
							/>
						</div>

						{/* VIP 用户专属字段 */}
						{shouldShowVipFields && (
							<div
								style={{
									marginBottom: '12px',
									padding: '8px',
									background: '#fff7e6',
									borderRadius: '4px',
									border: '1px solid #ffd591',
								}}
							>
								<Text strong style={{ color: '#fa8c16' }}>
									VIP 专属字段:
								</Text>
								<div style={{ marginTop: '8px' }}>
									<Text>VIP 等级: </Text>
									<select style={{ marginLeft: '8px', padding: '4px 8px' }}>
										<option>黄金会员</option>
										<option>白金会员</option>
										<option>钻石会员</option>
									</select>
								</div>
								<div style={{ marginTop: '8px' }}>
									<Text>专属折扣: </Text>
									<input
										placeholder="请输入折扣"
										style={{ marginLeft: '8px', padding: '4px 8px' }}
									/>
								</div>
							</div>
						)}

						{/* 管理员专属字段 */}
						{shouldShowAdminFields && (
							<div
								style={{
									marginBottom: '12px',
									padding: '8px',
									background: '#f6ffed',
									borderRadius: '4px',
									border: '1px solid #b7eb8f',
								}}
							>
								<Text strong style={{ color: '#52c41a' }}>
									管理员专属字段:
								</Text>
								<div style={{ marginTop: '8px' }}>
									<Text>管理权限: </Text>
									<select style={{ marginLeft: '8px', padding: '4px 8px' }}>
										<option>用户管理</option>
										<option>系统管理</option>
										<option>超级管理员</option>
									</select>
								</div>
								<div style={{ marginTop: '8px' }}>
									<Text>操作日志: </Text>
									<input
										placeholder="操作记录"
										style={{ marginLeft: '8px', padding: '4px 8px' }}
									/>
								</div>
							</div>
						)}

						{/* 高级设置字段 */}
						{shouldShowAdvancedFields && (
							<div
								style={{
									marginBottom: '12px',
									padding: '8px',
									background: '#f0f5ff',
									borderRadius: '4px',
									border: '1px solid #adc6ff',
								}}
							>
								<Text strong style={{ color: '#1890ff' }}>
									高级设置:
								</Text>
								<div style={{ marginTop: '8px' }}>
									<Text>API 密钥: </Text>
									<input
										type="password"
										placeholder="请输入API密钥"
										style={{ marginLeft: '8px', padding: '4px 8px' }}
									/>
								</div>
								<div style={{ marginTop: '8px' }}>
									<Text>回调地址: </Text>
									<input
										placeholder="请输入回调地址"
										style={{ marginLeft: '8px', padding: '4px 8px' }}
									/>
								</div>
							</div>
						)}

						{/* 地区相关字段 */}
						{shouldShowRegionFields && (
							<div
								style={{
									marginBottom: '12px',
									padding: '8px',
									background: '#fff1f0',
									borderRadius: '4px',
									border: '1px solid #ffccc7',
								}}
							>
								<Text strong style={{ color: '#ff4d4f' }}>
									中国地区字段:
								</Text>
								<div style={{ marginTop: '8px' }}>
									<Text>身份证号: </Text>
									<input
										placeholder="请输入身份证号"
										style={{ marginLeft: '8px', padding: '4px 8px' }}
									/>
								</div>
								<div style={{ marginTop: '8px' }}>
									<Text>手机号: </Text>
									<input
										placeholder="请输入手机号"
										style={{ marginLeft: '8px', padding: '4px 8px' }}
									/>
								</div>
							</div>
						)}

						{!shouldShowVipFields &&
							!shouldShowAdminFields &&
							!shouldShowAdvancedFields &&
							!shouldShowRegionFields && (
								<div
									style={{
										textAlign: 'center',
										color: '#999',
										padding: '40px 0',
										fontStyle: 'italic',
									}}
								>
									请选择用户类型或开启高级设置来查看条件字段
								</div>
							)}
					</div>
				</div>
			</Card>

			<Card title="显隐控制特性" type="inner">
				<ul style={{ paddingLeft: '20px' }}>
					<li>
						<Text strong>When 组件:</Text>{' '}
						精准的依赖监听，只在相关字段变化时重新计算
					</li>
					<li>
						<Text strong>Container 组件:</Text>{' '}
						容器级别的显隐控制，可以控制整个区域
					</li>
					<li>
						<Text strong>动态表单:</Text> 支持行级别的显隐控制，灵活的表单结构
					</li>
					<li>
						<Text strong>性能优化:</Text> 智能的依赖收集，避免不必要的重新渲染
					</li>
					<li>
						<Text strong>嵌套支持:</Text> 支持多层嵌套的条件显示逻辑
					</li>
				</ul>
			</Card>
		</div>
	);
};

export default VisibilityControlDemo;
