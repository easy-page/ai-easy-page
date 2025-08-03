import React from 'react';
import { Card, Space, Button } from 'antd';
import { Form, FormItem, When } from '@easy-page/core';
import { Input, CheckboxGroup, Select } from '@easy-page/pc';

const CheckboxWhenDemo: React.FC = () => {
	const handleSubmit = async (values: any, _store: any) => {
		console.log('多选框条件显示表单提交:', values);
	};

	return (
		<Card title="多选框条件显示示例" style={{ marginBottom: 24 }}>
			<Form
				initialValues={{
					options: [],
					field1: '',
					field2: '',
					field3: '',
					field4: '',
				}}
				onSubmit={handleSubmit}
			>
				<FormItem
					id="options"
					label="选择选项"
					required
					validate={[{ required: true, message: '请至少选择一个选项' }]}
				>
					<CheckboxGroup
						options={[
							{ label: '选项1', value: '1' },
							{ label: '选项2', value: '2' },
							{ label: '选项3', value: '3' },
							{ label: '选项4', value: '4' },
						]}
					/>
				</FormItem>

				{/* 当选择至少一个多选框时，显示字段1、2、3 */}
				<When
					effectedBy={['options']}
					show={({ effectedValues }) => {
						const options = effectedValues.options || [];
						return Array.isArray(options) && options.length >= 1;
					}}
				>
					<Space direction="vertical" style={{ width: '100%' }}>
						<FormItem id="field1" label="字段1">
							<Input placeholder="请输入字段1" />
						</FormItem>
						<FormItem id="field2" label="字段2">
							<Input placeholder="请输入字段2" />
						</FormItem>
						<FormItem id="field3" label="字段3">
							<Select
								placeholder="请选择字段3"
								options={[
									{ label: '选项1', value: '1' },
									{ label: '选项2', value: '2' },
									{ label: '选项3', value: '3' },
								]}
							/>
						</FormItem>
					</Space>
				</When>

				{/* 当选择至少两个多选框时，额外显示字段4 */}
				<When
					effectedBy={['options']}
					show={({ effectedValues }) => {
						const options = effectedValues.options || [];
						return Array.isArray(options) && options.length >= 2;
					}}
				>
					<FormItem id="field4" label="字段4">
						<Select
							placeholder="请选择字段4"
							options={[
								{ label: '选项1', value: '1' },
								{ label: '选项2', value: '2' },
								{ label: '选项3', value: '3' },
								{ label: '选项4', value: '4' },
							]}
						/>
					</FormItem>
				</When>

				<FormItem id="submit">
					<Button type="primary" htmlType="submit">
						提交
					</Button>
				</FormItem>
			</Form>
		</Card>
	);
};

export default CheckboxWhenDemo;
