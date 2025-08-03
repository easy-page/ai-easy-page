import React from 'react';
import { Card, Space, Button } from 'antd';
import { Form, FormItem, When } from '@easy-page/core';
import { Input, Select } from '@easy-page/pc';

const SelectWhenDemo: React.FC = () => {
	const handleSubmit = async (values: any, _store: any) => {
		console.log('下拉框条件显示表单提交:', values);
	};

	return (
		<Card title="下拉框条件显示示例" style={{ marginBottom: 24 }}>
			<Form
				initialValues={{
					option: '',
					field1: '',
					field2: '',
					field3: '',
					field4: '',
				}}
				onSubmit={handleSubmit}
			>
				<FormItem
					id="option"
					label="选择选项"
					required
					validate={[{ required: true, message: '请选择一个选项' }]}
				>
					<Select
						placeholder="请选择选项"
						options={[
							{ label: '选项A', value: 'A' },
							{ label: '选项B', value: 'B' },
							{ label: '选项C', value: 'C' },
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

				{/* 当选择选项B时，显示字段1、2、3、4 */}
				<When
					effectedBy={['option']}
					show={({ effectedValues }) => {
						const option = effectedValues.option;
						return option === 'B';
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
					</Space>
				</When>

				{/* 当选择选项C时，显示字段1、2 */}
				<When
					effectedBy={['option']}
					show={({ effectedValues }) => {
						const option = effectedValues.option;
						return option === 'C';
					}}
				>
					<Space direction="vertical" style={{ width: '100%' }}>
						<FormItem id="field1" label="字段1">
							<Input placeholder="请输入字段1" />
						</FormItem>
						<FormItem id="field2" label="字段2">
							<Input placeholder="请输入字段2" />
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

export default SelectWhenDemo;
