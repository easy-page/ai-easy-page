import React, { useState } from 'react';
import { Space, Card, Button, InputNumber, message, Alert } from 'antd';
import { Form, FormItem, When } from '@easy-page/core';
import { DynamicForm, Input, Select } from '@easy-page/pc';

const WhenDemo: React.FC = () => {
	const [tierCount] = useState(3); // 阶梯数量
	const MAX_TIERS = 10;

	const handleSubmit = async (values: any) => {
		console.log('When 组件 Demo 提交:', values);
		message.success('配置提交成功！');
	};

	// 生成初始值
	const generateInitialValues = () => {
		const values: any = {};
		for (let i = 0; i < tierCount; i++) {
			values[`tier${i}_userType`] = i === 0 ? 'vip' : 'normal';
			values[`tier${i}_threshold`] = i === 0 ? 100 : i === 1 ? 200 : 300;
			values[`tier${i}_maxSubsidy`] = i === 0 ? 50 : i === 1 ? 100 : 150;
			values[`tier${i}_vipDiscount`] = i === 0 ? 0.8 : i === 1 ? 0.7 : 0.6;
			values[`tier${i}_specialNote`] = i === 0 ? 'VIP专属优惠' : '';
		}
		return values;
	};

	return (
		<Card title="When 组件演示 - 条件渲染功能" style={{ marginBottom: 24 }}>
			<Alert
				message="When 组件功能说明"
				description="本 Demo 展示了 When 组件的条件渲染功能，可以根据表单状态和行信息动态显示或隐藏字段"
				type="info"
				showIcon
				style={{ marginBottom: 16 }}
			/>

			<Form initialValues={generateInitialValues()} onSubmit={handleSubmit}>
				<div style={{ marginBottom: 16 }}>
					<DynamicForm
						id="conditionalTiers"
						maxRow={MAX_TIERS}
						minRow={1}
						containerType="grid-table"
						gridColumns={[1, 1, 1, 1]} // 4列布局
						headers={[
							<div
								key="userType"
								style={{ fontWeight: 'bold', color: '#1890ff' }}
							>
								用户类型
							</div>,
							<div
								key="threshold"
								style={{ fontWeight: 'bold', color: '#52c41a' }}
							>
								门槛金额
							</div>,
							<div
								key="subsidy"
								style={{ fontWeight: 'bold', color: '#fa8c16' }}
							>
								补贴金额
							</div>,
							<div key="extra" style={{ fontWeight: 'bold', color: '#722ed1' }}>
								额外配置
							</div>,
						]}
						rows={[
							{
								rowIndexs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
								fields: [
									<FormItem
										key="userType"
										id="userType"
										noLabel
										validate={[{ required: true, message: '请选择用户类型' }]}
									>
										<Select
											placeholder="请选择用户类型"
											options={[
												{ label: '普通用户', value: 'normal' },
												{ label: 'VIP用户', value: 'vip' },
												{ label: '企业用户', value: 'enterprise' },
											]}
										/>
									</FormItem>,
									<FormItem
										key="threshold"
										id="threshold"
										noLabel
										validate={[
											{ required: true, message: '请输入门槛金额' },
											{ min: 0, message: '门槛金额不能为负数' },
										]}
									>
										<InputNumber
											min={0}
											precision={0}
											style={{ width: '100%' }}
											placeholder="请输入门槛金额"
										/>
									</FormItem>,
									<FormItem
										key="maxSubsidy"
										id="maxSubsidy"
										noLabel
										validate={[
											{ required: true, message: '请输入补贴金额' },
											{ min: 0, message: '补贴金额不能为负数' },
										]}
									>
										<InputNumber
											min={0}
											precision={0}
											style={{ width: '100%' }}
											placeholder="请输入补贴金额"
										/>
									</FormItem>,
									<div
										key="extra"
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: '8px',
										}}
									>
										{/* 条件1：只有 VIP 用户才显示折扣配置 */}
										<When
											effectedBy={['userType']}
											show={({ effectedValues, rowInfo }) => {
												if (!rowInfo) return false;
												const userType = effectedValues.userType;
												return userType === 'vip';
											}}
										>
											<FormItem
												id="vipDiscount"
												noLabel
												validate={[
													{ required: true, message: '请输入VIP折扣' },
													{ min: 0.1, max: 1, message: '折扣必须在0.1-1之间' },
												]}
											>
												<InputNumber
													min={0.1}
													max={1}
													step={0.1}
													precision={1}
													style={{ width: '100%' }}
													placeholder="VIP折扣"
												/>
											</FormItem>
										</When>

										{/* 条件2：只有企业用户才显示特殊备注 */}
										<When
											effectedBy={['userType']}
											show={({ effectedValues, rowInfo }) => {
												if (!rowInfo) return false;
												const userType = effectedValues.userType;
												return userType === 'enterprise';
											}}
										>
											<FormItem
												id="specialNote"
												noLabel
												validate={[
													{ required: true, message: '请输入特殊备注' },
												]}
											>
												<Input
													style={{ width: '100%' }}
													placeholder="特殊备注"
												/>
											</FormItem>
										</When>

										{/* 条件3：只有第一行才显示高级配置 */}
										<When
											show={({ rowInfo }) => {
												return rowInfo?.currentRow === 0;
											}}
										>
											<FormItem
												id="advancedConfig"
												noLabel
												validate={[
													{ required: true, message: '请输入高级配置' },
												]}
											>
												<Input
													style={{ width: '100%' }}
													placeholder="高级配置（仅第一行）"
												/>
											</FormItem>
										</When>

										{/* 条件4：只有最后一行才显示总结配置 */}
										<When
											show={({ rowInfo }) => {
												return rowInfo?.isLast === true;
											}}
										>
											<FormItem
												id="summaryConfig"
												noLabel
												validate={[
													{ required: true, message: '请输入总结配置' },
												]}
											>
												<Input
													style={{ width: '100%' }}
													placeholder="总结配置（仅最后一行）"
												/>
											</FormItem>
										</When>

										{/* 条件5：补贴金额大于100时才显示额外奖励 */}
										<When
											effectedBy={['maxSubsidy']}
											show={({ effectedValues, rowInfo }) => {
												if (!rowInfo) return false;
												const maxSubsidy = effectedValues.maxSubsidy;
												return (
													typeof maxSubsidy === 'number' && maxSubsidy > 100
												);
											}}
										>
											<FormItem
												id="extraReward"
												noLabel
												validate={[
													{ required: true, message: '请输入额外奖励' },
												]}
											>
												<Input
													style={{ width: '100%' }}
													placeholder="额外奖励（补贴>100时显示）"
												/>
											</FormItem>
										</When>
									</div>,
								],
							},
						]}
					/>
				</div>

				<Space>
					<Button type="primary" htmlType="submit">
						提交
					</Button>
					<Button onClick={() => console.log('当前阶梯数量:', tierCount)}>
						查看配置
					</Button>
				</Space>
			</Form>

			<div
				style={{
					marginTop: 16,
					padding: 16,
					backgroundColor: '#f5f5f5',
					borderRadius: 6,
				}}
			>
				<h4>When 组件功能详解:</h4>
				<ul>
					<li>
						<strong>条件渲染:</strong> 根据表单状态和行信息动态显示或隐藏字段
					</li>
					<li>
						<strong>用户类型条件:</strong>
						<ul>
							<li>VIP用户：显示折扣配置字段</li>
							<li>企业用户：显示特殊备注字段</li>
							<li>普通用户：不显示额外字段</li>
						</ul>
					</li>
					<li>
						<strong>行位置条件:</strong>
						<ul>
							<li>第一行：显示高级配置字段</li>
							<li>最后一行：显示总结配置字段</li>
						</ul>
					</li>
					<li>
						<strong>数值条件:</strong>
						<ul>
							<li>补贴金额大于100：显示额外奖励字段</li>
						</ul>
					</li>
					<li>
						<strong>组合条件:</strong> 可以组合多个条件实现复杂的显示逻辑
					</li>
				</ul>

				<h4>使用方式:</h4>
				<pre
					style={{
						backgroundColor: '#fff',
						padding: '8px',
						borderRadius: '4px',
					}}
				>
					{`// 基本用法
<When show={({ store, rowInfo }) => boolean}>
  <FormItem>...</FormItem>
</When>

// 根据用户类型显示
<When show={({ store, rowInfo }) => {
  const userType = store.getValue(\`\${rowInfo.currentRow}_userType\`);
  return userType === 'vip';
}}>
  <FormItem>VIP专属字段</FormItem>
</When>

// 根据行位置显示
<When show={({ rowInfo }) => rowInfo?.currentRow === 0}>
  <FormItem>仅第一行显示</FormItem>
</When>

// 根据数值条件显示
<When show={({ store, rowInfo }) => {
  const value = store.getValue(\`\${rowInfo.currentRow}_fieldName\`);
  return typeof value === 'number' && value > 100;
}}>
  <FormItem>条件字段</FormItem>
</When>`}
				</pre>

				<h4>测试用例:</h4>
				<ul>
					<li>
						<strong>测试1 - 用户类型切换:</strong>
						<ul>
							<li>将第一行用户类型改为"VIP用户"</li>
							<li>预期：显示VIP折扣配置字段</li>
							<li>将用户类型改为"企业用户"</li>
							<li>预期：显示特殊备注字段</li>
						</ul>
					</li>
					<li>
						<strong>测试2 - 数值条件:</strong>
						<ul>
							<li>将任意行的补贴金额设置为150</li>
							<li>预期：显示额外奖励字段</li>
							<li>将补贴金额改为50</li>
							<li>预期：隐藏额外奖励字段</li>
						</ul>
					</li>
					<li>
						<strong>测试3 - 行位置条件:</strong>
						<ul>
							<li>第一行应该显示高级配置字段</li>
							<li>最后一行应该显示总结配置字段</li>
							<li>中间行不应该显示这两个字段</li>
						</ul>
					</li>
				</ul>
			</div>
		</Card>
	);
};

export default WhenDemo;
