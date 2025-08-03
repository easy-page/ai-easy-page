import React, { useState } from 'react';
import { Form, FormItem, FormStore } from '@easy-page/core';
import { Select, Input } from '@easy-page/pc';
import { Button, Space, message, Card, Alert } from 'antd';

const LinkageDemo: React.FC = () => {
	const [formData, setFormData] = useState<any>(null);

	const handleSubmit = async (values: any) => {
		console.log('联动表单提交:', values);
		setFormData(values);
		message.success('提交成功！');
	};

	// 模拟省份城市数据
	const provinceData = [
		{ label: '北京', value: 'beijing' },
		{ label: '上海', value: 'shanghai' },
		{ label: '广东', value: 'guangdong' },
	];

	const cityData: Record<string, Array<{ label: string; value: string }>> = {
		beijing: [
			{ label: '朝阳区', value: 'chaoyang' },
			{ label: '海淀区', value: 'haidian' },
		],
		shanghai: [
			{ label: '浦东新区', value: 'pudong' },
			{ label: '黄浦区', value: 'huangpu' },
		],
		guangdong: [
			{ label: '广州市', value: 'guangzhou' },
			{ label: '深圳市', value: 'shenzhen' },
		],
	};

	return (
		<div style={{ padding: '24px' }}>
			<Alert
				message="联动机制说明"
				description="Effects（副作用）配置在变化的字段上，Actions（动作）配置在被影响的字段上。支持多级联动、条件联动、异步数据处理。"
				type="info"
				showIcon
				style={{ marginBottom: '24px' }}
			/>

			<Card title="字段联动演示" style={{ marginBottom: '24px' }}>
				<Form
					initialValues={{
						country: '',
						province: '',
						city: '',
						district: '',
					}}
					onSubmit={handleSubmit}
				>
					<FormItem
						id="country"
						label="国家"
						effects={[
							{
								effectedKeys: ['province', 'city', 'district'],
								handler: async (params: {
									store: FormStore;
									rowInfo?: any;
									value: any;
									rowValue: any;
								}) => {
									const { store } = params;
									const country = store.getValue('country');
									console.log('国家变化:', country);

									// 模拟异步操作
									await new Promise((resolve) => setTimeout(resolve, 500));

									return {
										province: { fieldValue: '', fieldProps: {} },
										city: { fieldValue: '', fieldProps: {} },
										district: { fieldValue: '', fieldProps: {} },
									};
								},
							},
						]}
					>
						<Select
							placeholder="请选择国家"
							options={[
								{ label: '中国', value: 'china' },
								{ label: '美国', value: 'usa' },
								{ label: '日本', value: 'japan' },
							]}
						/>
					</FormItem>

					<FormItem
						id="province"
						label="省份"
						effects={[
							{
								effectedKeys: ['city', 'district'],
								handler: async (params: {
									store: FormStore;
									rowInfo?: any;
									value: any;
									rowValue: any;
								}) => {
									const { store } = params;
									const province = store.getValue('province');
									console.log('省份变化:', province);

									return {
										city: { fieldValue: '', fieldProps: {} },
										district: { fieldValue: '', fieldProps: {} },
									};
								},
							},
						]}
						actions={[
							{
								effectedBy: ['country'],
								handler: async (params: {
									store: FormStore;
									rowInfo?: any;
									value: any;
									rowValue: any;
								}) => {
									const { store } = params;
									const country = store.getValue('country');

									if (country === 'china') {
										return {
											fieldValue: '',
											fieldProps: {
												options: provinceData,
												placeholder: '请选择省份',
												disabled: false,
											},
										};
									}

									return {
										fieldValue: '',
										fieldProps: {
											options: [],
											placeholder: '请先选择国家',
											disabled: true,
										},
									};
								},
							},
						]}
					>
						<Select placeholder="请选择省份" options={[]} />
					</FormItem>

					<FormItem
						id="city"
						label="城市"
						actions={[
							{
								effectedBy: ['province'],
								handler: async (params: {
									store: FormStore;
									rowInfo?: any;
									value: any;
									rowValue: any;
								}) => {
									const { store } = params;
									const province = store.getValue('province');

									if (province && cityData[province]) {
										return {
											fieldValue: '',
											fieldProps: {
												options: cityData[province],
												placeholder: '请选择城市',
												disabled: false,
											},
										};
									}

									return {
										fieldValue: '',
										fieldProps: {
											options: [],
											placeholder: '请先选择省份',
											disabled: true,
										},
									};
								},
							},
						]}
					>
						<Select placeholder="请选择城市" options={[]} />
					</FormItem>

					<FormItem id="district" label="区县">
						<Input placeholder="请输入区县" />
					</FormItem>

					<Space style={{ marginTop: 16 }}>
						<Button type="primary" htmlType="submit">
							提交表单
						</Button>
						<Button htmlType="reset">重置表单</Button>
					</Space>
				</Form>
			</Card>

			{formData && (
				<Card title="提交结果" type="inner">
					<pre
						style={{
							background: '#f5f5f5',
							padding: '12px',
							borderRadius: '4px',
						}}
					>
						{JSON.stringify(formData, null, 2)}
					</pre>
				</Card>
			)}
		</div>
	);
};

export default LinkageDemo;
