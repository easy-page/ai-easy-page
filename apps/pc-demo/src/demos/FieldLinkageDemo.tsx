import React from 'react';
import { Button, Space, Card } from 'antd';
import { Form, FormItem, FormStore } from '@easy-page/core';
import { Select } from '@easy-page/pc';

const FieldLinkageDemo: React.FC = () => {
	const handleSubmit = async (values: any, _store: any) => {
		console.log('字段联动表单提交:', values);
	};

	return (
		<Card title="字段联动示例" style={{ marginBottom: 24 }}>
			<Form
				initialValues={{
					country: '',
					province: '',
					city: '',
					district: '',
					productType: '',
					productModel: '',
					productVersion: '',
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
							handler: async ({ store }) => {
								const province = store.getValue('province');
								console.log('省份变化:', province);

								await new Promise((resolve) => setTimeout(resolve, 300));

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
							handler: async ({ store }) => {
								const country = store.getValue('country');
								console.log('省份被国家影响:', country);

								await new Promise((resolve) => setTimeout(resolve, 200));

								// 根据国家设置省份选项
								const provinceOptions =
									country === 'china'
										? [
												{ label: '北京', value: 'beijing' },
												{ label: '上海', value: 'shanghai' },
												{ label: '广东', value: 'guangdong' },
										  ]
										: country === 'usa'
										? [
												{ label: '加利福尼亚', value: 'california' },
												{ label: '纽约', value: 'newyork' },
												{ label: '德克萨斯', value: 'texas' },
										  ]
										: [];

								return {
									fieldValue: '',
									fieldProps: {
										options: provinceOptions,
										placeholder: `请选择${country === 'china' ? '省份' : '州'}`,
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
					effects={[
						{
							effectedKeys: ['district'],
							handler: async ({ store }) => {
								const city = store.getValue('city');
								console.log('城市变化:', city);

								await new Promise((resolve) => setTimeout(resolve, 200));

								return {
									district: { fieldValue: '', fieldProps: {} },
								};
							},
						},
					]}
					actions={[
						{
							effectedBy: ['province'],
							handler: async ({ store }) => {
								const province = store.getValue('province');
								console.log('城市被省份影响:', province);

								await new Promise((resolve) => setTimeout(resolve, 150));

								// 根据省份设置城市选项
								const cityOptions =
									province === 'beijing'
										? [
												{ label: '朝阳区', value: 'chaoyang' },
												{ label: '海淀区', value: 'haidian' },
												{ label: '西城区', value: 'xicheng' },
										  ]
										: province === 'shanghai'
										? [
												{ label: '浦东新区', value: 'pudong' },
												{ label: '黄浦区', value: 'huangpu' },
												{ label: '静安区', value: 'jingan' },
										  ]
										: [];

								return {
									fieldValue: '',
									fieldProps: {
										options: cityOptions,
										placeholder: '请选择城市',
									},
								};
							},
						},
					]}
				>
					<Select placeholder="请选择城市" options={[]} />
				</FormItem>

				<FormItem
					id="district"
					label="区县"
					actions={[
						{
							effectedBy: ['city'],
							handler: async ({ store }) => {
								const city = store.getValue('city');
								console.log('区县被城市影响:', city);

								await new Promise((resolve) => setTimeout(resolve, 100));

								// 根据城市设置区县选项
								const districtOptions =
									city === 'chaoyang'
										? [
												{ label: '三里屯街道', value: 'sanlitun' },
												{ label: '建外街道', value: 'jianwai' },
										  ]
										: city === 'haidian'
										? [
												{ label: '中关村街道', value: 'zhongguancun' },
												{ label: '学院路街道', value: 'xueyuanlu' },
										  ]
										: city === 'xicheng'
										? [
												{ label: '西长安街街道', value: 'xichanganjie' },
												{ label: '金融街街道', value: 'jinrongjie' },
												{ label: '什刹海街道', value: 'shichahai' },
										  ]
										: [];

								return {
									fieldValue: '',
									fieldProps: {
										options: districtOptions,
										placeholder: '请选择区县',
									},
								};
							},
						},
					]}
				>
					<Select placeholder="请选择区县" options={[]} />
				</FormItem>

				<div
					style={{
						margin: '16px 0',
						borderTop: '1px solid #f0f0f0',
						paddingTop: '16px',
					}}
				>
					<h4>产品信息联动</h4>
				</div>

				<FormItem
					id="productType"
					label="产品类型"
					effects={[
						{
							effectedKeys: ['productModel', 'productVersion'],
							handler: async ({ store }) => {
								const productType = store.getValue('productType');
								console.log('产品类型变化:', productType);

								await new Promise((resolve) => setTimeout(resolve, 300));

								return {
									productModel: { fieldValue: '', fieldProps: {} },
									productVersion: { fieldValue: '', fieldProps: {} },
								};
							},
						},
					]}
				>
					<Select
						placeholder="请选择产品类型"
						options={[
							{ label: '手机', value: 'phone' },
							{ label: '电脑', value: 'computer' },
							{ label: '平板', value: 'tablet' },
						]}
					/>
				</FormItem>

				<FormItem
					id="productModel"
					label="产品型号"
					effects={[
						{
							effectedKeys: ['productVersion'],
							handler: async ({ store }) => {
								const productModel = store.getValue('productModel');
								console.log('产品型号变化:', productModel);

								await new Promise((resolve) => setTimeout(resolve, 200));

								return {
									productVersion: { fieldValue: '', fieldProps: {} },
								};
							},
						},
					]}
					actions={[
						{
							effectedBy: ['productType'],
							handler: async ({ store }) => {
								const productType = store.getValue('productType');
								console.log('产品型号被产品类型影响:', productType);

								await new Promise((resolve) => setTimeout(resolve, 150));

								// 根据产品类型设置型号选项
								const modelOptions =
									productType === 'phone'
										? [
												{ label: 'iPhone 15', value: 'iphone15' },
												{ label: 'iPhone 14', value: 'iphone14' },
												{ label: 'iPhone 13', value: 'iphone13' },
										  ]
										: productType === 'computer'
										? [
												{ label: 'MacBook Pro', value: 'macbook-pro' },
												{ label: 'MacBook Air', value: 'macbook-air' },
												{ label: 'iMac', value: 'imac' },
										  ]
										: productType === 'tablet'
										? [
												{ label: 'iPad Pro', value: 'ipad-pro' },
												{ label: 'iPad Air', value: 'ipad-air' },
												{ label: 'iPad', value: 'ipad' },
										  ]
										: [];

								return {
									fieldValue: '',
									fieldProps: {
										options: modelOptions,
										placeholder: '请选择产品型号',
									},
								};
							},
						},
					]}
				>
					<Select placeholder="请选择产品型号" options={[]} />
				</FormItem>

				<FormItem
					id="productVersion"
					label="产品版本"
					actions={[
						{
							effectedBy: ['productModel'],
							handler: async ({ store }) => {
								const productModel = store.getValue('productModel');
								console.log('产品版本被产品型号影响:', productModel);

								await new Promise((resolve) => setTimeout(resolve, 120));

								// 根据型号设置版本选项
								const versionOptions =
									productModel === 'iphone15'
										? [
												{ label: '128G', value: '128g' },
												{ label: '256G', value: '256g' },
												{ label: '512G', value: '512g' },
										  ]
										: productModel === 'macbook-pro'
										? [
												{ label: 'M3', value: 'm3' },
												{ label: 'M2', value: 'm2' },
												{ label: 'M1', value: 'm1' },
										  ]
										: productModel === 'ipad-pro'
										? [
												{ label: '11寸', value: '11' },
												{ label: '13寸', value: '13' },
										  ]
										: [];

								return {
									fieldValue: '',
									fieldProps: {
										options: versionOptions,
										placeholder: '请选择产品版本',
									},
								};
							},
						},
					]}
				>
					<Select placeholder="请选择产品版本" options={[]} />
				</FormItem>

				<Space>
					<Button type="primary" htmlType="submit">
						提交
					</Button>
				</Space>
			</Form>
		</Card>
	);
};

export default FieldLinkageDemo;
