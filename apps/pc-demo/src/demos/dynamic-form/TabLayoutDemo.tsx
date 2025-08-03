import React from 'react';
import { Space, Card, Button, InputNumber, message } from 'antd';
import { Form, FormItem } from '@easy-page/core';
import { Input, DynamicForm, TextArea } from '@easy-page/pc';
import { toJS } from 'mobx';

const TabLayoutDemo: React.FC = () => {
	const handleSimpleSubmit = async (values: any) => {
		console.log('简单动态表单提交:', toJS(values));
		message.success('提交成功！');
	};

	return (
		<Card title="DynamicForm组件 - Tab布局示例" style={{ marginBottom: 24 }}>
			<Form
				initialValues={{
					baseInfos: [
						{
							name: '张三',
							desc: '这是第一个用户',
							age: 25,
						},
					],
				}}
				onSubmit={handleSimpleSubmit}
			>
				<DynamicForm
					id="baseInfos"
					maxRow={4}
					minRow={1}
					containerType="tab"
					rows={[
						{
							rowIndexs: [1, 2],
							fields: [
								<FormItem
									id="name"
									label="姓名"
									required
									validate={[{ required: true, message: '请输入姓名' }]}
								>
									<Input placeholder="请输入姓名" />
								</FormItem>,
								<FormItem id="desc" label="描述">
									<TextArea placeholder="请输入描述" />
								</FormItem>,
							],
						},
						{
							rowIndexs: [3],
							restAll: true,
							fields: [
								<FormItem
									id="age"
									label="年龄"
									validate={[
										{ min: 1, max: 120, message: '年龄必须在1-120之间' },
									]}
								>
									<InputNumber
										min={1}
										max={120}
										placeholder="请输入年龄"
										style={{ width: '100%' }}
									/>
								</FormItem>,
							],
						},
					]}
				/>

				<Space style={{ marginTop: 16 }}>
					<Button type="primary" htmlType="submit">
						提交
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
				<h4>Tab布局功能说明:</h4>
				<ul>
					<li>
						<strong>行配置:</strong> rowIndexs指定哪些行使用相同的字段配置
					</li>
					<li>
						<strong>restAll:</strong> 剩余所有行都使用该配置
					</li>
					<li>
						<strong>字段唯一性:</strong> 自动为字段添加索引前缀确保唯一性
					</li>
					<li>
						<strong>数据存储:</strong> 所有数据存储在baseInfos数组下
					</li>
					<li>
						<strong>添加删除:</strong> 支持动态添加和删除表单
					</li>
				</ul>
			</div>
		</Card>
	);
};

export default TabLayoutDemo;
