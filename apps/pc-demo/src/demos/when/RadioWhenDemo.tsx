import React from 'react';
import { Card, Space, Button } from 'antd';
import { Form, FormItem, When } from '@easy-page/core';
import { Input, RadioGroup, Select } from '@easy-page/pc';

const RadioWhenDemo: React.FC = () => {
	const handleSubmit = async (values: any, _store: any) => {
		console.log('单选框条件显示表单提交:', values);
	};

	return (
		<Card title="单选框条件显示示例" style={{ marginBottom: 24 }}>
			<Form
				initialValues={{
					option: '',
					field1: '',
					field2: '',
					field3: '',
					field4: '',
					field5: '',
				}}
				onSubmit={handleSubmit}
			>
				<FormItem
					id="option"
					label="选择选项"
					required
					validate={[{ required: true, message: '请选择一个选项' }]}
				>
					<RadioGroup
						options={[
							{ label: '选项A', value: 'A' },
							{ label: '选项B', value: 'B' },
						]}
					/>
				</FormItem>

				{/* 当选择选项A时，显示字段1、2、3 */}
				<When
					effectedBy={['option']}
					show={({ effectedValues }) => {
						const option = effectedValues.option;
						return option === 'A';
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

				{/* 当选择选项B时，显示字段4、5 */}
				<When
					effectedBy={['option']}
					show={({ effectedValues }) => {
						const option = effectedValues.option;
						return option === 'B';
					}}
				>
					<Space direction="vertical" style={{ width: '100%' }}>
						<FormItem id="field4" label="字段4">
							<Input placeholder="请输入字段4" />
						</FormItem>
						<FormItem id="field5" label="字段5">
							<Select
								placeholder="请选择字段5"
								options={[
									{ label: '选项4', value: '4' },
									{ label: '选项5', value: '5' },
								]}
							/>
						</FormItem>
					</Space>
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

export default RadioWhenDemo;
