import React, { useState } from 'react';
import {
	Space,
	Card,
	Button,
	InputNumber,
	Select,
	TimePicker,
	message,
} from 'antd';
import {
	Form,
	FormItem,
	useRowInfo,
	FormStore,
	ExtendedRowInfo,
} from '@easy-page/core';
import { DynamicForm } from '@easy-page/pc';

// 时间范围输入组件
const TimeRangeInput: React.FC<{
	value?: { start: string; end: string };
	onChange?: (value: { start: string; end: string }) => void;
}> = ({ value, onChange }) => {
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
			<TimePicker
				placeholder="开始时间"
				onChange={(time) => {
					onChange?.({
						start: time?.format('HH:mm') || '',
						end: value?.end || '',
					});
				}}
				format="HH:mm"
			/>
			<span style={{ color: '#666' }}>→</span>
			<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
				<TimePicker
					placeholder="结束时间"
					onChange={(time) => {
						onChange?.({
							start: value?.start || '',
							end: time?.format('HH:mm') || '',
						});
					}}
					format="HH:mm"
				/>
				<span style={{ color: '#999', fontSize: '14px' }}>ⓘ</span>
			</div>
		</div>
	);
};

// 补贴范围输入组件
const SubsidyRangeInput: React.FC<{
	value?: { min: number; max: number };
	onChange?: (value: { min: number; max: number }) => void;
}> = ({ value, onChange }) => {
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
			<InputNumber
				min={0.5}
				max={20}
				step={0.5}
				precision={1}
				style={{ width: '80px' }}
				placeholder="0.5"
				value={value?.min}
				onChange={(min) => {
					onChange?.({ min: min || 0.5, max: value?.max || 20 });
				}}
			/>
			<span style={{ color: '#666' }}>~</span>
			<InputNumber
				min={0.5}
				max={20}
				step={0.5}
				precision={1}
				style={{ width: '80px' }}
				placeholder="20"
				value={value?.max}
				onChange={(max) => {
					onChange?.({ min: value?.min || 0.5, max: max || 20 });
				}}
			/>
		</div>
	);
};

const MergedCellTableDemo: React.FC = () => {
	const handleSubmit = async (values: any) => {
		console.log('补贴条件配置提交:', values);
		message.success('配置提交成功！');
	};

	// 生成初始值
	const generateInitialValues = () => {
		const values: any = {};
		// 为 DynamicForm 设置初始值
		values.subsidyConditions = [
			{
				audience: '门店新客',
				merchantSubsidy: { min: 0.5, max: 20 },
				bdSubsidy: { min: 0.5, max: 20 },
				agentSubsidy: { min: 0.5, max: 20 },
			},
			{
				allDay: true,
				merchantSubsidy: { min: 0.5, max: 20 },
				bdSubsidy: { min: 0.5, max: 20 },
				agentSubsidy: { min: 0.5, max: 20 },
			},
			{
				timeSlot: { start: '09:00', end: '12:00' },
				merchantSubsidy: { min: 0.5, max: 20 },
				bdSubsidy: { min: 0.5, max: 20 },
				agentSubsidy: { min: 0.5, max: 20 },
			},
			{
				timeSlot: { start: '14:00', end: '18:00' },
				merchantSubsidy: { min: 0.5, max: 20 },
				bdSubsidy: { min: 0.5, max: 20 },
				agentSubsidy: { min: 0.5, max: 20 },
			},
		];
		return values;
	};

	return (
		<Card title="补贴条件② - Table 容器合并单元格" style={{ marginBottom: 24 }}>
			<Form initialValues={generateInitialValues()} onSubmit={handleSubmit}>
				<div style={{ marginBottom: 16 }}>
					{/* 使用 TableContainer 的 DynamicForm */}
					<DynamicForm
						id="subsidyConditions"
						maxRow={5}
						minRow={1}
						containerType="table"
						headers={[
							'人群',
							'商家补贴 (元)',
							'BD补贴 (元)',
							'代理商CM补贴 (元)',
						]}
						rows={[
							{
								rowIndexs: [1], // 第一行：人群配置
								fields: [
									<FormItem
										id="audience"
										label="人群"
										required
										validate={[{ required: true, message: '请选择人群' }]}
									>
										<Select
											placeholder="请选择人群"
											options={[
												{ label: '门店新客', value: '门店新客' },
												{ label: '老客户', value: '老客户' },
												{ label: 'VIP客户', value: 'VIP客户' },
											]}
										/>
									</FormItem>,
									<FormItem
										id="merchantSubsidy"
										label="商家补贴"
										required
										validate={[
											{ required: true, message: '请输入商家补贴范围' },
										]}
									>
										<SubsidyRangeInput />
									</FormItem>,
									<FormItem
										id="bdSubsidy"
										label="BD补贴"
										required
										validate={[{ required: true, message: '请输入BD补贴范围' }]}
									>
										<SubsidyRangeInput />
									</FormItem>,
									<FormItem
										id="agentSubsidy"
										label="代理商CM补贴"
										required
										validate={[
											{ required: true, message: '请输入代理商CM补贴范围' },
										]}
									>
										<SubsidyRangeInput />
									</FormItem>,
								],
							},
							{
								rowIndexs: [2], // 第二行：全天配置
								fields: [
									<FormItem
										id="allDay"
										label="全天"
										required
										validate={[{ required: true, message: '请选择全天配置' }]}
									>
										<Select
											placeholder="请选择全天配置"
											options={[
												{ label: '是', value: true },
												{ label: '否', value: false },
											]}
										/>
									</FormItem>,
									<FormItem
										id="merchantSubsidy"
										label="商家补贴"
										required
										validate={[
											{ required: true, message: '请输入商家补贴范围' },
										]}
									>
										<SubsidyRangeInput />
									</FormItem>,
									<FormItem
										id="bdSubsidy"
										label="BD补贴"
										required
										validate={[{ required: true, message: '请输入BD补贴范围' }]}
									>
										<SubsidyRangeInput />
									</FormItem>,
									<FormItem
										id="agentSubsidy"
										label="代理商CM补贴"
										required
										validate={[
											{ required: true, message: '请输入代理商CM补贴范围' },
										]}
									>
										<SubsidyRangeInput />
									</FormItem>,
								],
							},
							{
								rowIndexs: [3], // 第三行：时段1配置
								fields: [
									<FormItem
										id="timeSlot"
										label="时段1"
										required
										validate={[{ required: true, message: '请选择时段' }]}
									>
										<TimeRangeInput />
									</FormItem>,
									<FormItem
										id="merchantSubsidy"
										label="商家补贴"
										required
										validate={[
											{ required: true, message: '请输入商家补贴范围' },
										]}
									>
										<SubsidyRangeInput />
									</FormItem>,
									<FormItem
										id="bdSubsidy"
										label="BD补贴"
										required
										validate={[{ required: true, message: '请输入BD补贴范围' }]}
									>
										<SubsidyRangeInput />
									</FormItem>,
									<FormItem
										id="agentSubsidy"
										label="代理商CM补贴"
										required
										validate={[
											{ required: true, message: '请输入代理商CM补贴范围' },
										]}
									>
										<SubsidyRangeInput />
									</FormItem>,
								],
							},
							{
								rowIndexs: [4], // 第四行：时段2配置，使用合并单元格
								fields: [
									<FormItem
										id="timeSlot"
										label="时段2"
										required
										validate={[{ required: true, message: '请选择时段' }]}
									>
										<TimeRangeInput />
									</FormItem>,
									<FormItem id="mergedEffect" label="合并效果">
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '8px',
												color: '#666',
												fontSize: '14px',
											}}
										>
											<span>对已添加的所有时段生效</span>
										</div>
									</FormItem>,
								],
								rowSpan: [2, 4], // 从第2列到第3列合并，展示第2个字段
							},
						]}
					/>
				</div>

				<Space>
					<Button type="primary" htmlType="submit">
						提交
					</Button>
					<Button onClick={() => console.log('查看配置')}>查看配置</Button>
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
				<h4>Table 容器合并单元格功能说明:</h4>
				<ul>
					<li>
						<strong>表格布局:</strong> 使用 Ant Design Table 组件实现表格效果
					</li>
					<li>
						<strong>合并单元格:</strong> 通过 rowSpan 配置实现单元格合并效果
					</li>
					<li>
						<strong>rowSpan 配置:</strong> [2, 3]
						表示从第2列到第3列合并，展示第2个字段
					</li>
					<li>
						<strong>onCell 属性:</strong> 使用 Ant Design Table 的 onCell
						属性实现合并
					</li>
					<li>
						<strong>补贴范围:</strong> 支持 0.5~20 范围，支持 0.5 结尾的一位小数
					</li>
					<li>
						<strong>时间选择:</strong> 支持时间段配置，包含开始和结束时间
					</li>
					<li>
						<strong>人群选择:</strong> 支持不同人群类型的配置
					</li>
					<li>
						<strong>动态管理:</strong> 支持添加和删除时段配置
					</li>
				</ul>

				<h4>Table 容器合并单元格实现原理:</h4>
				<ul>
					<li>
						<strong>onCell 回调:</strong> 通过 onCell 属性为每个单元格设置
						rowSpan
					</li>
					<li>
						<strong>rowSpan 计算:</strong> 根据 rowSpan 配置计算合并的单元格数量
					</li>
					<li>
						<strong>字段隐藏:</strong> 合并范围内的其他字段设置 rowSpan: 0
						来隐藏
					</li>
					<li>
						<strong>Ant Design 原生支持:</strong> 利用 Ant Design Table
						的原生合并单元格能力
					</li>
				</ul>
			</div>
		</Card>
	);
};

export default MergedCellTableDemo;
