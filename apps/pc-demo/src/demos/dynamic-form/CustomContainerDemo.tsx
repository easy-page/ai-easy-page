import React from 'react';
import { Space, Card, Button, message } from 'antd';
import { Form, FormItem } from '@easy-page/core';
import { Input, DynamicForm, TextArea } from '@easy-page/pc';

const CustomContainerDemo: React.FC = () => {
	const handleSimpleSubmit = async (values: any) => {
		console.log('简单动态表单提交:', values);
		message.success('提交成功！');
	};

	return (
		<Card title="DynamicForm组件 - 自定义容器示例" style={{ marginBottom: 24 }}>
			<Form
				initialValues={{
					customInfos: [
						{
							title: '自定义标题',
							content: '自定义内容',
						},
					],
				}}
				onSubmit={handleSimpleSubmit}
			>
				<DynamicForm
					id="customInfos"
					maxRow={3}
					minRow={1}
					customContainer={({
						onAdd,
						onDelete,
						value,
						canAdd,
						canDelete,
						renderFields,
					}: any) => {
						return (
							<div>
								{value.map((_: any, index: number) => (
									<div
										key={index}
										style={{
											border: '1px solid #d9d9d9',
											borderRadius: '6px',
											padding: '16px',
											marginBottom: '16px',
											backgroundColor: '#fafafa',
										}}
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												marginBottom: '12px',
											}}
										>
											<h4 style={{ margin: 0 }}>自定义表单 {index + 1}</h4>
											{canDelete(index) && (
												<Button
													type="text"
													danger
													size="small"
													onClick={() => onDelete(index)}
												>
													删除
												</Button>
											)}
										</div>
										<div style={{ display: 'flex', gap: '16px' }}>
											{renderFields(index, <div style={{ flex: 1 }} />)}
										</div>
									</div>
								))}
								{canAdd && (
									<div style={{ textAlign: 'center' }}>
										<Button type="dashed" onClick={onAdd}>
											添加自定义表单
										</Button>
									</div>
								)}
							</div>
						);
					}}
					rows={[
						{
							rowIndexs: [1, 2, 3],
							fields: [
								<FormItem
									id="title"
									label="标题"
									required
									validate={[{ required: true, message: '请输入标题' }]}
								>
									<Input placeholder="请输入标题" />
								</FormItem>,
								<FormItem id="content" label="内容">
									<TextArea placeholder="请输入内容" />
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
				<h4>自定义容器功能说明:</h4>
				<ul>
					<li>
						<strong>完全自定义:</strong> 可以完全自定义容器的渲染方式
					</li>
					<li>
						<strong>灵活布局:</strong> 支持任意布局和样式
					</li>
					<li>
						<strong>状态管理:</strong> 自动处理添加、删除、验证等状态
					</li>
					<li>
						<strong>字段渲染:</strong> 自动处理字段的唯一性和渲染
					</li>
					<li>
						<strong>数据同步:</strong> 与Form组件完美集成
					</li>
				</ul>
			</div>
		</Card>
	);
};

export default CustomContainerDemo;
