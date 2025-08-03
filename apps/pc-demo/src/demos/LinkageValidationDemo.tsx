import React from 'react';
import { Button, Space, Card } from 'antd';
import { Form, FormItem } from '@easy-page/core';
import { Input } from '@easy-page/pc';

const LinkageValidationDemo: React.FC = () => {
	const handleSubmit = async (values: any, _store: any) => {
		console.log('联动验证表单提交:', values);
	};

	return (
		<Card title="联动验证示例" style={{ marginBottom: 24 }}>
			<Form
				initialValues={{
					password: '',
					confirmPassword: '',
					email: '',
					confirmEmail: '',
					startDate: '',
					endDate: '',
					minValue: '',
					maxValue: '',
				}}
				onSubmit={handleSubmit}
			>
				<FormItem
					id="password"
					label="密码"
					required
					validate={[
						{ required: true, message: '请输入密码' },
						{ min: 6, message: '密码至少6位' },
						{
							pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
							message: '密码必须包含大小写字母和数字',
						},
					]}
				>
					<Input type="password" placeholder="请输入密码" />
				</FormItem>

				<FormItem
					id="confirmPassword"
					label="确认密码"
					required
					validate={[
						{ required: true, message: '请确认密码' },
						{
							validator: (params: {
								value: any;
								store: any;
								rowInfo?: any;
								rowValues: any;
							}) => {
								const { value, store } = params;
								const password = store.getValue('password');
								return value === password || '两次输入的密码不一致';
							},
						},
					]}
				>
					<Input type="password" placeholder="请确认密码" />
				</FormItem>

				<FormItem
					id="email"
					label="邮箱"
					required
					validate={[
						{ required: true, message: '请输入邮箱' },
						{
							pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: '邮箱格式不正确',
						},
					]}
				>
					<Input placeholder="请输入邮箱" />
				</FormItem>

				<FormItem
					id="confirmEmail"
					label="确认邮箱"
					required
					validate={[
						{ required: true, message: '请确认邮箱' },
						{
							validator: (params: {
								value: any;
								store: any;
								rowInfo?: any;
								rowValues: any;
							}) => {
								const { value, store } = params;
								const email = store.getValue('email');
								return value === email || '两次输入的邮箱不一致';
							},
						},
					]}
				>
					<Input placeholder="请确认邮箱" />
				</FormItem>

				<FormItem
					id="startDate"
					label="开始日期"
					required
					validate={[
						{ required: true, message: '请选择开始日期' },
						{
							validator: (params: {
								value: any;
								store: any;
								rowInfo?: any;
								rowValues: any;
							}) => {
								const { value, store } = params;
								const endDate = store.getValue('endDate');
								if (
									endDate &&
									value &&
									typeof value === 'string' &&
									typeof endDate === 'string' &&
									new Date(value) >= new Date(endDate)
								) {
									return '开始日期必须早于结束日期';
								}
								return true;
							},
						},
					]}
				>
					<Input type="date" placeholder="请选择开始日期" />
				</FormItem>

				<FormItem
					id="endDate"
					label="结束日期"
					required
					validate={[
						{ required: true, message: '请选择结束日期' },
						{
							validator: (params: {
								value: any;
								store: any;
								rowInfo?: any;
								rowValues: any;
							}) => {
								const { value, store } = params;
								const startDate = store.getValue('startDate');
								if (
									startDate &&
									value &&
									typeof value === 'string' &&
									typeof startDate === 'string' &&
									new Date(value) <= new Date(startDate)
								) {
									return '结束日期必须晚于开始日期';
								}
								return true;
							},
						},
					]}
				>
					<Input type="date" placeholder="请选择结束日期" />
				</FormItem>

				<FormItem
					id="minValue"
					label="最小值"
					required
					validate={[
						{ required: true, message: '请输入最小值' },
						{ min: 0, message: '最小值不能为负数' },
						{
							validator: (params: {
								value: any;
								store: any;
								rowInfo?: any;
								rowValues: any;
							}) => {
								const { value, store } = params;
								const maxValue = store.getValue('maxValue');
								if (maxValue && Number(value) >= Number(maxValue)) {
									return '最小值必须小于最大值';
								}
								return true;
							},
						},
					]}
				>
					<Input type="number" placeholder="请输入最小值" />
				</FormItem>

				<FormItem
					id="maxValue"
					label="最大值"
					required
					validate={[
						{ required: true, message: '请输入最大值' },
						{ min: 0, message: '最大值不能为负数' },
						{
							validator: (params: {
								value: any;
								store: any;
								rowInfo?: any;
								rowValues: any;
							}) => {
								const { value, store } = params;
								const minValue = store.getValue('minValue');
								if (minValue && Number(value) <= Number(minValue)) {
									return '最大值必须大于最小值';
								}
								return true;
							},
						},
					]}
				>
					<Input type="number" placeholder="请输入最大值" />
				</FormItem>

				<Space>
					<Button type="primary" htmlType="submit">
						提交
					</Button>
					<Button>重置</Button>
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
				<h4>联动验证说明:</h4>
				<ul>
					<li>
						<strong>密码确认:</strong> 确认密码必须与密码一致
					</li>
					<li>
						<strong>邮箱确认:</strong> 确认邮箱必须与邮箱一致
					</li>
					<li>
						<strong>日期范围:</strong>{' '}
						开始日期必须早于结束日期，结束日期必须晚于开始日期
					</li>
					<li>
						<strong>数值范围:</strong>{' '}
						最小值必须小于最大值，最大值必须大于最小值
					</li>
					<li>
						<strong>实时验证:</strong> 当相关字段值变化时，会实时触发联动验证
					</li>
					<li>
						<strong>自定义验证器:</strong> 使用 validator
						函数实现复杂的联动验证逻辑
					</li>
				</ul>
			</div>
		</Card>
	);
};

export default LinkageValidationDemo;
