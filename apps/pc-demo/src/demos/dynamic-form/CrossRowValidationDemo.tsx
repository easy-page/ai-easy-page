import React, { useState } from 'react';
import { Space, Card, Button, InputNumber, message, Alert } from 'antd';
import {
	Form,
	FormItem,
	useRowInfo,
	FormStore,
	ExtendedRowInfo,
} from '@easy-page/core';
import { DynamicForm } from '@easy-page/pc';

// 自定义券门槛范围组件
const ThresholdRangeInput: React.FC<{
	value?: { min: number; max: number | null };
	onChange?: (value: { min: number; max: number | null }) => void;
}> = ({ value, onChange }) => {
	const { isLast } = useRowInfo() || {};

	const handleMinChange = (min: number | null) => {
		onChange?.({ min: min || 0, max: value?.max || null });
	};

	const handleMaxChange = (max: number | null) => {
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
				disabled={true} // 最小值默认禁用，由系统自动设置
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

const CrossRowValidationDemo: React.FC = () => {
	const [tierCount] = useState(3); // 阶梯数量
	const MAX_TIERS = 10;

	const handleSubmit = async (values: any) => {
		console.log('跨行验证 Demo 提交:', values);
		message.success('配置提交成功！');
	};

	// 生成初始值
	const generateInitialValues = () => {
		const values: any = {};
		for (let i = 0; i < tierCount; i++) {
			values[`tier${i}_threshold`] =
				i === 0
					? { min: 0, max: 30 }
					: i === 1
					? { min: 30, max: 60 }
					: { min: 60, max: null };
			values[`tier${i}_maxSubsidy`] = i === 0 ? 2 : i === 1 ? 4 : 6;
		}
		return values;
	};

	return (
		<Card title="跨行验证功能演示 - 补贴阶梯配置" style={{ marginBottom: 24 }}>
			<Alert
				message="跨行验证功能说明"
				description="本 Demo 展示了 DynamicForm 的跨行验证功能，使用简洁的 validateEffects 配置方式实现验证影响关系"
				type="info"
				showIcon
				style={{ marginBottom: 16 }}
			/>

			<Form initialValues={generateInitialValues()} onSubmit={handleSubmit}>
				<div style={{ marginBottom: 16 }}>
					<DynamicForm
						id="subsidyTiers"
						maxRow={MAX_TIERS}
						minRow={1}
						containerType="grid-table"
						gridColumns={[2, 1]} // 券门槛列占2份，补贴要求列占1份
						headers={[
							<div
								key="threshold"
								style={{ fontWeight: 'bold', color: '#1890ff' }}
							>
								券门槛范围
							</div>,
							<div
								key="subsidy"
								style={{ fontWeight: 'bold', color: '#52c41a' }}
							>
								补贴要求
							</div>,
						]}
						rows={[
							{
								rowIndexs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
								fields: [
									<FormItem
										id="threshold"
										noLabel
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
													const { rowInfo, value, rowValue } = params;

													// 验证新的参数结构
													console.log('Effects handler 新参数结构:', {
														value,
														rowValue,
														rowInfo: rowInfo
															? {
																	currentRow: rowInfo.currentRow,
																	totalRows: rowInfo.totalRows,
																	isLast: rowInfo.isLast,
															  }
															: null,
													});

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
														try {
															return rowInfo.updateNextRow('threshold', {
																min: maxValue || 0,
																max: null,
															});
														} catch (error) {
															console.error('更新下一行数据时出错:', error);
															return {};
														}
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
										noLabel
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
										extra={({ currentRow }) => {
											// 显示当前行号
											return (
												<div
													style={{
														fontSize: '12px',
														color: '#666',
														marginTop: '4px',
													}}
												>
													第 {currentRow! + 1} 行
												</div>
											);
										}}
									>
										<InputNumber
											min={0}
											max={5000}
											precision={1}
											style={{ width: '100%' }}
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
				<h4>简洁的跨行验证功能详解:</h4>
				<ul>
					<li>
						<strong>validateEffects 配置:</strong>
						<ul>
							<li>
								<strong>同行影响:</strong> 通过 affectFields 指定影响同行的字段
							</li>
							<li>
								<strong>跨行影响:</strong> 通过 effectNextRow 或
								effectPreviousRow 指定影响其他行
							</li>
							<li>
								<strong>自动验证:</strong> 系统自动触发对应字段的验证逻辑
							</li>
							<li>
								<strong>简洁配置:</strong> 无需复杂的配置，直接定义影响关系
							</li>
						</ul>
					</li>
					<li>
						<strong>验证规则:</strong>
						<ul>
							<li>
								<strong>验证1:</strong> 补贴要求要比券门槛范围最大值小
							</li>
							<li>
								<strong>验证2:</strong> 补贴要求的下一行值要比上一行补贴要求值大
							</li>
						</ul>
					</li>
					<li>
						<strong>使用方式:</strong>
						<ul>
							<li>
								<strong>券门槛字段:</strong>{' '}
								变化时影响同行的补贴要求验证，同时自动更新下一行的最小值
							</li>
							<li>
								<strong>补贴要求字段:</strong> 变化时影响下一行的补贴要求验证
							</li>
						</ul>
					</li>
				</ul>

				<h4>简洁配置示例:</h4>
				<pre
					style={{
						backgroundColor: '#fff',
						padding: '8px',
						borderRadius: '4px',
					}}
				>
					{`// 券门槛字段配置 - 简洁！
validateEffects={[
  {
    affectFields: ['maxSubsidy'], // 影响同行的补贴要求验证
  },
  {
    affectFields: ['threshold'],
    effectNextRow: true, // 影响下一行的券门槛验证
  },
]}

// 补贴要求字段配置 - 简洁！
validateEffects={[
  {
    affectFields: ['maxSubsidy'],
    effectNextRow: true, // 影响下一行的补贴要求验证
  },
]}`}
				</pre>

				<h4>优势对比:</h4>
				<ul>
					<li>
						<strong>原来复杂方式:</strong>
						<ul>
							<li>需要手动组装字段名</li>
							<li>需要手动获取当前值</li>
							<li>需要复杂的 effects 配置</li>
						</ul>
					</li>
					<li>
						<strong>现在简洁方式:</strong>
						<ul>
							<li>直接定义影响关系，系统自动触发验证</li>
							<li>无需手动组装字段名，系统自动处理</li>
							<li>配置简单直观</li>
						</ul>
					</li>
				</ul>

				<h4>测试用例:</h4>
				<ul>
					<li>
						<strong>测试1 - 同行验证:</strong>
						<ul>
							<li>设置券门槛范围为 0-30</li>
							<li>设置补贴要求为 35</li>
							<li>修改券门槛最大值为 25</li>
							<li>
								预期：补贴要求应该显示错误 "补贴要求不能大于或等于券门槛最大值
								25"
							</li>
						</ul>
					</li>
					<li>
						<strong>测试2 - 跨行验证:</strong>
						<ul>
							<li>第一行补贴要求设置为 4</li>
							<li>第二行补贴要求设置为 3</li>
							<li>修改第一行补贴要求为 5</li>
							<li>
								预期：第二行应该显示错误 "补贴要求必须大于上一行的补贴要求 5"
							</li>
						</ul>
					</li>
					<li>
						<strong>测试3 - 联动效果:</strong>
						<ul>
							<li>修改第一行券门槛最大值为 50</li>
							<li>预期：第二行券门槛最小值自动更新为 50</li>
						</ul>
					</li>
				</ul>
			</div>
		</Card>
	);
};

export default CrossRowValidationDemo;

/*
超简洁的跨行验证使用方式：

1. 定义验证影响关系：
   validateEffects={[
     {
       affectFields: ['fieldName'], // 影响同行的字段
     },
     {
       affectFields: ['fieldName'],
       effectNextRow: true, // 影响下一行
       // 新增：handler 直接处理联动逻辑
       handler: ({ store, value, rowInfo, rowValue }) => {
         // value 是当前字段的值，无需手动获取
         // rowValue 是当前行的所有字段值
         // 返回要更新的字段值
         return {
           'nextField': newValue,
         };
       },
     },
   ]}

2. 定义验证规则：
   validate={[
     { required: true, message: '必填' },
     {
       validator: async (value, store, rowInfo) => {
         // 自定义验证逻辑
         return true; // 或返回错误消息
       },
       message: '验证失败',
     },
   ]}

3. 系统会自动处理：
   - 当前字段变化时，触发影响字段的验证
   - handler 直接接收当前字段的值，无需手动获取
   - 跨行验证时，自动计算正确的行号
   - 验证失败时，显示错误消息

这种方式比之前更简洁，用户完全不需要感知：
- 字段名的组装细节
- 手动获取当前值
- 复杂的配置逻辑

用户只需要关注：
- 我当前变化了，影响我行的那个字段验证方法
- 我当前变化了，会验证下一行的某些字段
- 我当前变化了，需要联动更新哪些字段（通过 handler）
*/
