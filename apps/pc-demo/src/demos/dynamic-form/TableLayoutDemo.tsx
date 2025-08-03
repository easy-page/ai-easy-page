import React from 'react';
import { Space, Card, Button, message } from 'antd';
import { Form, FormItem } from '@easy-page/core';
import { Input, Select, DynamicForm } from '@easy-page/pc';

const TableLayoutDemo: React.FC = () => {
	const handleSimpleSubmit = async (values: any) => {
		console.log('简单动态表单提交:', values);
		message.success('提交成功！');
	};

	return (
		<Card title="DynamicForm组件 - 表格布局示例" style={{ marginBottom: 24 }}>
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
					rows={[
						{
							rowIndexs: [1, 2, 3, 4, 5],
							fields: [
								<FormItem
									id="name"
									label="姓名"
									required
									validate={[{ required: true, message: '请输入姓名' }]}
								>
									<Input placeholder="请输入姓名" />
								</FormItem>,
								<FormItem
									id="email"
									label="邮箱"
									validate={[
										{
											pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
											message: '邮箱格式不正确',
										},
									]}
								>
									<Input placeholder="请输入邮箱" />
								</FormItem>,
								<FormItem id="role" label="角色">
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
				<h4>表格布局功能说明:</h4>
				<ul>
					<li>
						<strong>表格展示:</strong> 以表格形式展示动态表单
					</li>
					<li>
						<strong>列自动生成:</strong> 根据字段配置自动生成表格列
					</li>
					<li>
						<strong>操作列:</strong> 自动添加操作列，包含删除按钮
					</li>
					<li>
						<strong>序号列:</strong> 自动添加序号列
					</li>
					<li>
						<strong>字段验证:</strong> 支持完整的表单验证功能
					</li>
				</ul>
			</div>
		</Card>
	);
};

export default TableLayoutDemo;
