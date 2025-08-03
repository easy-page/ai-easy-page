import React, { useState } from 'react';
import { Space, Card, Button, InputNumber, message } from 'antd';
import {
	Form,
	FormItem,
	useRowInfo,
	FormStore,
	ExtendedRowInfo,
	FormItemExtraParams,
} from '@easy-page/core';
import { DynamicForm } from '@easy-page/pc';

// 自定义券门槛范围组件
const ThresholdRangeInput: React.FC<{
	value?: { min: number; max: number | null };
	onChange?: (value: { min: number; max: number | null }) => void;
	minDisabled?: boolean; // 控制最小值是否禁用
}> = ({ value, onChange, minDisabled = false }) => {
	const rowInfo = useRowInfo();
	const { isLast } = rowInfo || {};

	// 调试信息
	console.log('ThresholdRangeInput render:', {
		value,
		minDisabled,
		rowInfo,
		isLast,
	});

	const handleMinChange = (min: number | null) => {
		console.log('ThresholdRangeInput handleMinChange:', { min, value });
		onChange?.({ min: min || 0, max: value?.max || null });
	};

	const handleMaxChange = (max: number | null) => {
		console.log('ThresholdRangeInput handleMaxChange:', { max, value });
		onChange?.({ min: value?.min || 0, max });
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
			<InputNumber
				min={0}
				precision={0}
				style={{ width: '80px' }}
				placeholder="最小值"
				value={value?.min}
				onChange={handleMinChange}
				disabled={minDisabled}
			/>
			<span style={{ color: '#666' }}>≤券门槛&lt;</span>

			{isLast ? (
				<span style={{ color: '#666' }}>不限</span>
			) : (
				<InputNumber
					min={0}
					precision={0}
					style={{ width: '80px' }}
					placeholder="最大值"
					value={value?.max}
					onChange={handleMaxChange}
					disabled={isLast}
				/>
			)}
		</div>
	);
};

const SubsidyTierTableDemo: React.FC = () => {
	const [tierCount] = useState(2); // 阶梯数量
	const MAX_TIERS = 10;

	const handleSubmit = async (values: any) => {
		console.log('商家补贴阶梯配置提交:', values);
		message.success('配置提交成功！');
	};

	// 生成初始值
	const generateInitialValues = () => {
		const values: any = {};
		// 为 DynamicForm 设置初始值，确保有两行数据
		values.subsidyTiers = [
			{ threshold: { min: 0, max: 30 }, maxSubsidy: 2 },
			{ threshold: { min: 30, max: null }, maxSubsidy: 4 },
		];
		return values;
	};

	return (
		<Card title="商家最高补贴要求配置 - 表格布局" style={{ marginBottom: 24 }}>
			<Form initialValues={generateInitialValues()} onSubmit={handleSubmit}>
				<div style={{ marginBottom: 16 }}>
					{/* 使用 TableContainer 的 DynamicForm */}
					<DynamicForm
						id="subsidyTiers"
						maxRow={MAX_TIERS}
						minRow={1}
						containerType="table"
						rows={[
							{
								rowIndexs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
								fields: [
									<FormItem
										id="threshold"
										label="券门槛 (元)"
										required
										validate={[{ required: true, message: '请输入券门槛范围' }]}
										// 简洁的验证影响配置
										validateEffects={[
											{
												affectFields: ['maxSubsidy'], // 影响同行的补贴要求验证
											},
											{
												affectFields: ['threshold'],
												effectNextRow: true, // 影响下一行的券门槛验证
											},
										]}
										// 使用 effects 来处理联动：当当前行的最大值变化时，影响下一行
										effects={[
											{
												handler: async (params: {
													store: FormStore;
													rowInfo?: ExtendedRowInfo;
													value: any;
													rowValue: any;
												}) => {
													const { rowInfo, value } = params;

													if (!rowInfo) return {};

													// 如果不是最后一行，则影响下一行
													if (!rowInfo.isLast) {
														// 直接使用value参数，不需要再从store获取
														const currentThreshold = value;

														// 类型安全处理
														const maxValue =
															typeof currentThreshold === 'object' &&
															currentThreshold &&
															'max' in currentThreshold
																? (
																		currentThreshold as {
																			min: number;
																			max: number | null;
																		}
																  ).max
																: 0;

														// 使用 updateNextRow 方法更新下一行数据
														return rowInfo.updateNextRow('threshold', {
															min: maxValue || 0,
															max: null,
														});
													}

													return {};
												},
											},
										]}
									>
										<ThresholdRangeInput />
									</FormItem>,
									<FormItem
										id="maxSubsidy"
										label="商家最高补贴要求 (元)"
										required
										validate={[
											{ required: true, message: '请输入补贴要求' },
											{ min: 0, message: '补贴要求不能为负数' },
											{ max: 5000, message: '补贴要求不能超过5000' },
											// 验证1：补贴要求要比券门槛范围最大值小
											{
												validator: async (params: {
													value: any;
													store: FormStore;
													rowInfo?: ExtendedRowInfo;
													rowValues: any;
												}) => {
													const { value, rowValues } = params;
													if (typeof value !== 'number') return true;

													const threshold = rowValues.threshold;

													if (
														threshold &&
														typeof threshold === 'object' &&
														'max' in threshold &&
														threshold.max !== null &&
														typeof threshold.max === 'number'
													) {
														if (value >= threshold.max) {
															return `补贴要求不能大于或等于券门槛最大值 ${threshold.max}`;
														}
													}

													return true;
												},
												message: '补贴要求不能大于或等于券门槛最大值',
											},
											// 验证2：补贴要求的下一行值要比上一行补贴要求值大
											{
												validator: async (params: {
													value: any;
													store: FormStore;
													rowInfo?: ExtendedRowInfo;
													rowValues: any;
												}) => {
													const { value, rowInfo } = params;
													if (!rowInfo || typeof value !== 'number')
														return true;

													const currentRow = rowInfo.currentRow;

													// 如果不是第一行，需要验证递增性
													if (currentRow > 0) {
														const prevSubsidy = rowInfo.getRowValues(
															-1,
															'maxSubsidy'
														);

														if (
															typeof prevSubsidy === 'number' &&
															value <= prevSubsidy
														) {
															return `补贴要求必须大于上一行的补贴要求 ${prevSubsidy}`;
														}
													}

													return true;
												},
												message: '补贴要求必须大于上一行的补贴要求',
											},
										]}
										// 当前变化，会影响下一行的验证
										validateEffects={[
											{
												affectFields: ['maxSubsidy'],
												effectNextRow: true, // 影响下一行的补贴要求验证
											},
										]}
										extra={({ fieldValue }: FormItemExtraParams) => {
											// 如果值大于10，显示高风险警告
											if (typeof fieldValue === 'number' && fieldValue > 10) {
												return (
													<div
														style={{
															fontSize: '12px',
															color: '#ff4d4f',
															marginTop: '4px',
														}}
													>
														触发高风险商补预警,如需继续,请先申请商补高风险配置权限
													</div>
												);
											}
											return null;
										}}
									>
										<InputNumber
											min={0}
											max={5000}
											precision={1}
											style={{
												width: '100%',
												borderColor: '#ff4d4f', // 红色边框
												boxShadow: '0 0 0 2px rgba(255, 77, 79, 0.2)', // 红色阴影
											}}
											placeholder="请输入补贴要求"
										/>
									</FormItem>,
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
				<h4>表格布局功能说明:</h4>
				<ul>
					<li>
						<strong>表格展示:</strong> 以表格形式展示补贴阶梯配置，更加直观
					</li>
					<li>
						<strong>自动列生成:</strong>{' '}
						根据字段配置自动生成表格列，包含序号、券门槛、补贴要求、操作列
					</li>
					<li>
						<strong>阶梯配置:</strong> 支持最多10个补贴阶梯配置
					</li>
					<li>
						<strong>券门槛:</strong>{' '}
						每个阶梯设置券门槛范围，最后一个阶梯为"不限"
					</li>
					<li>
						<strong>补贴要求:</strong> 设置商家最高补贴要求，支持一位小数
					</li>
					<li>
						<strong>跨行验证:</strong>{' '}
						新增跨行验证功能，确保补贴要求符合业务规则
					</li>
					<li>
						<strong>验证规则:</strong> 自动验证阶梯连续性和补贴递增性
					</li>
					<li>
						<strong>风险预警:</strong> 当补贴要求过高时显示风险警告
					</li>
					<li>
						<strong>动态管理:</strong> 支持添加和删除阶梯，操作按钮在表格行中
					</li>
					<li>
						<strong>联动效果:</strong> 当前行的最大值自动设置为下一行的最小值
					</li>
					<li>
						<strong>简洁配置:</strong> 使用 validateEffects 简洁配置跨行验证关系
					</li>
				</ul>

				<h4>跨行验证功能:</h4>
				<ul>
					<li>
						<strong>验证1:</strong> 补贴要求要比券门槛范围最大值小
					</li>
					<li>
						<strong>验证2:</strong> 补贴要求的下一行值要比上一行补贴要求值大
					</li>
					<li>
						<strong>自动触发:</strong> 通过 validateEffects 配置自动触发验证
					</li>
				</ul>
			</div>
		</Card>
	);
};

export default SubsidyTierTableDemo;
