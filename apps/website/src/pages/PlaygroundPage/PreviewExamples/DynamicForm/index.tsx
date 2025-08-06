import * as React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Input, Select, DynamicForm } from '@easy-page/pc';
import { Button } from 'antd';

interface DynamicFormExampleProps {
	isFormComponent?: boolean;
}

const DynamicFormExample: React.FC<DynamicFormExampleProps> = ({
	isFormComponent = true,
}) => {
	const handleSubmit = (values: any) => {
		console.log('提交的数据:', values);
		alert(JSON.stringify(values, null, 2));
	};

	const dynamicFormContent = (
		<DynamicForm
			id="userInfos"
			maxRow={5}
			minRow={1}
			containerType="table"
			headers={['姓名', '邮箱']}
			rows={[
				{
					rowIndexs: [1, 2, 3, 4, 5],
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
					],
				},
			]}
		/>
	);

	return (
		<div style={{ padding: '16px' }}>
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
				onSubmit={handleSubmit}
			>
				{dynamicFormContent}
				<FormItem id="submit">
					<Button type="primary" htmlType="submit">
						提交
					</Button>
				</FormItem>
			</Form>
		</div>
	);
};

export default DynamicFormExample;
