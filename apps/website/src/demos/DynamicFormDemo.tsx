import React, { useState } from 'react';
import { Form, FormItem } from '@easy-page/core';
import { DynamicForm, Input, Select, TextArea } from '@easy-page/pc';
import { Button, Space, message, Card, InputNumber } from 'antd';
import 'antd/dist/reset.css';
import '@easy-page/core/dist/style.css';
const DynamicFormDemo: React.FC = () => {
	const [formData, setFormData] = useState<any>(null);

	const handleSimpleSubmit = async (values: any) => {
		console.log('动态表单提交:', values);
		setFormData(values);
		message.success('提交成功！');
	};

	return (
		<div style={{ padding: '24px' }}>
			<Card title="动态表单演示" style={{ marginBottom: '24px' }}>
				<Form
					initialValues={{
						userInfos: [
							{
								name: '李四',
								email: 'lisi@example.com',
								role: 'admin',
							},
						],
					}}
					onSubmit={handleSimpleSubmit}
				>
					<DynamicForm
						id="userInfos"
						maxRow={5}
						minRow={1}
						containerType="table"
						headers={['姓名', '邮箱', '角色']}
						rows={[
							{
								rowIndexs: [1, 2],
								fields: [
									<FormItem
										id="name"
										label="姓名"
										noLabel
										required
										validate={[{ required: true, message: '请输入姓名' }]}
									>
										<Input placeholder="请输入姓名" />
									</FormItem>,
									<FormItem
										id="email"
										label="邮箱"
										noLabel
										validate={[
											{
												pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
												message: '邮箱格式不正确',
											},
										]}
									>
										<Input placeholder="请输入邮箱" />
									</FormItem>,
									<FormItem id="role" noLabel label="角色">
										<Select
											placeholder="请选择角色"
											options={[
												{ label: '管理员', value: 'admin' },
												{ label: '用户', value: 'user' },
												{ label: '访客', value: 'guest' },
											]}
										/>
									</FormItem>,
								],
							},
							{
								rowIndexs: [3],

								rowSpan: [2, 3],
								fields: [
									<FormItem
										id="name"
										label="姓名"
										noLabel
										required
										effects={[]}
										extra={<div>暂不统计</div>}
										validate={[{ required: true, message: '请输入姓名' }]}
									>
										<Input placeholder="请输入姓名" />
									</FormItem>,
									<div>暂不统计</div>,
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

export default DynamicFormDemo;
