import React, { useState } from 'react';
import { Form, FormItem, FormMode } from '@easy-page/core';
import { Select } from '@easy-page/pc';
import {
	Typography,
	Card,
	Button,
	Space,
	Divider,
	Alert,
	Input as AntInput,
	Tabs,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

// 模拟API请求
const mockApi = {
	// 获取省份列表
	getProvinces: async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return {
			success: true,
			data: [
				{ id: '1', name: '北京市' },
				{ id: '2', name: '上海市' },
				{ id: '3', name: '广东省' },
				{ id: '4', name: '江苏省' },
				{ id: '5', name: '浙江省' },
			],
		};
	},

	// 获取城市列表（根据省份ID）
	getCities: async (provinceId: string, keyword?: string, cityId?: string) => {
		await new Promise((resolve) => setTimeout(resolve, 800));
		const cityMap: Record<string, any[]> = {
			'1': [
				{ id: '101', name: '朝阳区' },
				{ id: '102', name: '海淀区' },
				{ id: '103', name: '西城区' },
				{ id: '104', name: '东城区' },
				{ id: '105', name: '丰台区' },
			],
			'2': [
				{ id: '201', name: '浦东新区' },
				{ id: '202', name: '黄浦区' },
				{ id: '203', name: '徐汇区' },
				{ id: '204', name: '长宁区' },
				{ id: '205', name: '静安区' },
			],
			'3': [
				{ id: '301', name: '广州市' },
				{ id: '302', name: '深圳市' },
				{ id: '303', name: '珠海市' },
				{ id: '304', name: '佛山市' },
				{ id: '305', name: '东莞市' },
			],
			'4': [
				{ id: '401', name: '南京市' },
				{ id: '402', name: '苏州市' },
				{ id: '403', name: '无锡市' },
				{ id: '404', name: '常州市' },
				{ id: '405', name: '徐州市' },
			],
			'5': [
				{ id: '501', name: '杭州市' },
				{ id: '502', name: '宁波市' },
				{ id: '503', name: '温州市' },
				{ id: '504', name: '嘉兴市' },
				{ id: '505', name: '湖州市' },
			],
		};

		let cities = cityMap[provinceId] || [];

		// 如果有搜索关键词，进行过滤
		if (keyword) {
			cities = cities.filter((city) =>
				city.name.toLowerCase().includes(keyword.toLowerCase())
			);
		}

		// 如果指定了城市ID，确保该城市在结果中（主要用于编辑模式）
		if (cityId) {
			const targetCity = cities.find((city) => city.id === cityId);
			if (!targetCity) {
				// 如果目标城市不在当前列表中，单独查找并添加
				const allCities = cityMap[provinceId] || [];
				const foundCity = allCities.find((city) => city.id === cityId);
				if (foundCity) {
					// 将目标城市添加到列表开头，确保它显示在最前面
					cities = [foundCity, ...cities];
				}
			}
		}

		return {
			success: true,
			data: cities,
		};
	},

	// 新增：根据城市ID查询城市详情（用于 searchedById 功能）
	getCityById: async (provinceId: string, cityId: string) => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		const cityMap: Record<string, any[]> = {
			'1': [
				{ id: '101', name: '朝阳区' },
				{ id: '102', name: '海淀区' },
				{ id: '103', name: '西城区' },
				{ id: '104', name: '东城区' },
				{ id: '105', name: '丰台区' },
			],
			'2': [
				{ id: '201', name: '浦东新区' },
				{ id: '202', name: '黄浦区' },
				{ id: '203', name: '徐汇区' },
				{ id: '204', name: '长宁区' },
				{ id: '205', name: '静安区' },
			],
			'3': [
				{ id: '301', name: '广州市' },
				{ id: '302', name: '深圳市' },
				{ id: '303', name: '珠海市' },
				{ id: '304', name: '佛山市' },
				{ id: '305', name: '东莞市' },
			],
			'4': [
				{ id: '401', name: '南京市' },
				{ id: '402', name: '苏州市' },
				{ id: '403', name: '无锡市' },
				{ id: '404', name: '常州市' },
				{ id: '405', name: '徐州市' },
			],
			'5': [
				{ id: '501', name: '杭州市' },
				{ id: '502', name: '宁波市' },
				{ id: '503', name: '温州市' },
				{ id: '504', name: '嘉兴市' },
				{ id: '505', name: '湖州市' },
			],
		};

		const cities = cityMap[provinceId] || [];
		const city = cities.find((city) => city.id === cityId);

		return {
			success: true,
			data: city || null,
		};
	},

	// 获取编辑详情
	getEditDetail: async (id: string) => {
		await new Promise((resolve) => setTimeout(resolve, 1500));
		return {
			success: true,
			data: {
				id: '123',
				province: '3', // 广东省
				city: '302', // 深圳市
				description: '这是一个编辑模式的示例数据',
			},
		};
	},
};

// 创建模式演示
const CreateModeDemo: React.FC = () => {
	return (
		<Card title="创建模式演示" style={{ marginBottom: '24px' }}>
			<Alert
				message="创建模式功能"
				description="展示 Select 组件在创建模式下的功能：初始化远程加载、字段联动、远程搜索"
				type="info"
				showIcon
				style={{ marginBottom: '24px' }}
			/>

			<Form
				mode={FormMode.CREATE}
				onSubmit={async (values) => {
					console.log('创建模式表单提交:', values);
					alert(
						`创建模式提交成功！\n省份: ${values.province}\n城市: ${values.city}`
					);
				}}
			>
				<FormItem
					id="province"
					label="省份"
					required
					req={{
						handler: async () => {
							const result = await mockApi.getProvinces();
							return result;
						},
					}}
				>
					<Select
						id="province"
						placeholder="请选择省份"
						style={{ width: '100%' }}
					/>
				</FormItem>

				<FormItem
					id="city"
					label="城市"
					required
					req={{
						effectedBy: ['province'],
						handler: async ({ store, value, keyword }) => {
							const provinceId = value || store.getValue('province');

							if (!provinceId) {
								return { success: true, data: [] };
							}

							const result = await mockApi.getCities(provinceId, keyword);
							console.log(
								`🌍 [创建模式] 获取城市列表: ${provinceId}`,
								result.data
							);
							return result;
						},
					}}
				>
					<Select
						id="city"
						placeholder="请选择城市"
						remoteSearch={true}
						style={{ width: '100%' }}
					/>
				</FormItem>

				<FormItem id="description" label="描述">
					<AntInput.TextArea
						id="description"
						placeholder="请输入描述信息"
						rows={4}
					/>
				</FormItem>

				<Divider />

				<Space>
					<Button type="primary" htmlType="submit">
						提交表单
					</Button>
					<Button htmlType="reset">重置表单</Button>
				</Space>
			</Form>
		</Card>
	);
};

// 编辑模式演示
const EditModeDemo: React.FC = () => {
	const [editId] = useState('123'); // 模拟编辑ID

	return (
		<Card title="编辑模式演示">
			<Alert
				message="编辑模式功能"
				description="展示 Select 组件在编辑模式下的功能：详情加载、选项回填、ID查询"
				type="success"
				showIcon
				style={{ marginBottom: '24px' }}
			/>

			<Form
				mode={FormMode.EDIT}
				initReqs={{
					detail: {
						req: async ({ store }) => {
							console.log('📋 [编辑模式] 开始加载详情数据');
							const result = await mockApi.getEditDetail(editId);

							if (result.success && result.data) {
								// 先设置省份值，这会触发城市字段的请求
								store.setValue('province', result.data.province);

								// 等待一下，确保省份字段的请求完成
								await new Promise((resolve) => setTimeout(resolve, 200));

								// 然后设置城市值
								store.setValue('city', result.data.city);
								store.setValue('description', result.data.description);

								console.log('📋 [编辑模式] 设置表单初始值:', result.data);

								// 等待一下，确保所有请求完成
								await new Promise((resolve) => setTimeout(resolve, 100));
							}

							return result;
						},
					},
				}}
				onSubmit={async (values) => {
					console.log('编辑模式表单提交:', values);
					alert(
						`编辑模式提交成功！\n省份: ${values.province}\n城市: ${values.city}`
					);
				}}
			>
				<FormItem
					id="province"
					label="省份"
					required
					req={{
						handler: async () => {
							const result = await mockApi.getProvinces();
							return result;
						},
					}}
				>
					<Select
						id="province"
						placeholder="请选择省份"
						style={{ width: '100%' }}
					/>
				</FormItem>

				<FormItem
					id="city"
					label="城市"
					required
					req={{
						effectedBy: ['province'],
						handler: async ({ store, value, keyword }) => {
							const provinceId = value || store.getValue('province');

							if (!provinceId) {
								return { success: true, data: [] };
							}

							// 获取默认的城市列表
							const result = await mockApi.getCities(provinceId, keyword);
							console.log(
								`🌍 [城市字段] 获取城市列表: ${provinceId}`,
								result.data
							);
							return result;
						},
						// 新增：根据城市ID查询城市详情（用于编辑模式）
						searchedById: async ({ store, value }) => {
							const provinceId = store.getValue('province');
							const cityId = value;

							if (!provinceId || !cityId) {
								return { success: true, data: null };
							}

							// 使用专门的 API 查询城市详情
							const result = await mockApi.getCityById(
								provinceId as string,
								cityId as string
							);
							console.log(`🔍 [城市字段] 查询选中城市: ${cityId}`, result.data);
							return result;
						},
					}}
				>
					<Select
						id="city"
						placeholder="请选择城市"
						remoteSearch={true}
						style={{ width: '100%' }}
					/>
				</FormItem>

				<FormItem id="description" label="描述">
					<AntInput.TextArea
						id="description"
						placeholder="请输入描述信息"
						rows={4}
					/>
				</FormItem>

				<Divider />

				<Space>
					<Button type="primary" htmlType="submit">
						提交表单
					</Button>
					<Button htmlType="reset">重置表单</Button>
				</Space>
			</Form>
		</Card>
	);
};

const SelectDemo: React.FC = () => {
	return (
		<div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
			<Title level={2}>Select 组件演示</Title>

			<Alert
				message="功能说明"
				description={
					<div>
						<Paragraph>
							<Text strong>创建模式：</Text>
							展示 Select 组件的基础功能：初始化远程加载、字段联动、远程搜索
						</Paragraph>
						<Paragraph>
							<Text strong>编辑模式：</Text>
							展示 Select
							组件在编辑场景下的功能：详情加载、选项回填、ID查询确保选项存在
						</Paragraph>
					</div>
				}
				type="info"
				showIcon
				style={{ marginBottom: '24px' }}
			/>

			<Tabs
				defaultActiveKey="create"
				items={[
					{
						key: 'create',
						label: '创建模式',
						children: <CreateModeDemo />,
					},
					{
						key: 'edit',
						label: '编辑模式',
						children: <EditModeDemo />,
					},
				]}
			/>

			<Card title="技术实现说明" style={{ marginTop: '24px' }}>
				<Paragraph>
					<Text strong>1. 创建模式：</Text>
					省份字段在表单初始化时自动触发请求，城市字段依赖省份变化自动加载
				</Paragraph>
				<Paragraph>
					<Text strong>2. 编辑模式：</Text>
					通过 initReqs.detail 加载详情数据并设置表单初始值，使用 searchedById
					查询选中项详情
				</Paragraph>
				<Paragraph>
					<Text strong>3. 远程搜索：</Text>
					Select 组件设置 remoteSearch={true}，支持关键词搜索
				</Paragraph>
				<Paragraph>
					<Text strong>4. searchedById 功能：</Text>
					新增 searchedById
					属性，在编辑模式下自动查询选中项的详细信息，与默认选项合并显示。
					使用专门的 getCityById API 进行精确查询。
				</Paragraph>
			</Card>
		</div>
	);
};

export default SelectDemo;
