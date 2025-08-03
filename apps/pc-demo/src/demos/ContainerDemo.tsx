import React from 'react';
import { Card, Button, Space } from 'antd';
import { FormItem, Form } from '@easy-page/core';
import { Container, Input, Select } from '@easy-page/pc';

const ContainerDemo: React.FC = () => {
	const handleSubmit = async (values: any) => {
		console.log('提交的值:', values);
	};

	return (
		<Card title="Container 容器组件演示" style={{ marginBottom: 24 }}>
			<Form initialValues={{ field3: 'show' }} onSubmit={handleSubmit}>
				{/* 控制字段 */}
				<FormItem id="field3" label="控制字段">
					<Select
						placeholder="选择显示/隐藏"
						options={[
							{ label: '显示容器', value: 'show' },
							{ label: '隐藏容器', value: 'hide' },
						]}
					/>
				</FormItem>

				{/* 卡片容器 - 垂直布局 */}
				<Container
					containerType="Card"
					layout="vertical"
					title="卡片容器 - 垂直布局"
					titleType="h1"
					effectedBy={['field3']}
					show={({ effectedValues }) => effectedValues.field3 === 'show'}
					style={{ marginBottom: 16 }}
				>
					<FormItem id="field1" label="字段1">
						<Input placeholder="请输入字段1" />
					</FormItem>
					<FormItem id="field2" label="字段2">
						<Input placeholder="请输入字段2" />
					</FormItem>
				</Container>

				{/* 有边框容器 - 水平布局 */}
				<Container
					containerType="Bordered"
					layout="horizontal"
					title="有边框容器 - 水平布局"
					titleType="h2"
					effectedBy={['field3']}
					show={({ effectedValues }) => effectedValues.field3 === 'show'}
					style={{ marginBottom: 16 }}
				>
					<FormItem id="field4" label="字段4">
						<Input placeholder="请输入字段4" />
					</FormItem>
					<FormItem id="field5" label="字段5">
						<Input placeholder="请输入字段5" />
					</FormItem>
				</Container>

				{/* 自定义容器 */}
				<Container
					customContainer={({ children }) => (
						<div
							style={{
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								color: 'white',
								padding: '20px',
								borderRadius: '12px',
								marginBottom: 16,
							}}
						>
							{children}
						</div>
					)}
					title="自定义容器 - 渐变背景"
					titleType="h3"
					effectedBy={['field3']}
					show={({ effectedValues }) => effectedValues.field3 === 'show'}
				>
					<FormItem id="field6" label="字段6">
						<Input placeholder="请输入字段6" />
					</FormItem>
					<FormItem id="field7" label="字段7">
						<Input placeholder="请输入字段7" />
					</FormItem>
				</Container>

				{/* 不同标题级别演示 */}
				<Container
					containerType="Bordered"
					layout="vertical"
					title="不同标题级别演示"
					titleType="h4"
					effectedBy={['field3']}
					show={({ effectedValues }) => effectedValues.field3 === 'show'}
					style={{ marginBottom: 16 }}
				>
					<FormItem id="field8" label="字段8">
						<Input placeholder="请输入字段8" />
					</FormItem>
				</Container>

				<Space>
					<Button type="primary" htmlType="submit">
						提交
					</Button>
					<Button onClick={() => console.log('查看配置')}>查看配置</Button>
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
				<h4>Container 容器组件功能说明:</h4>
				<ul>
					<li>
						<strong>条件渲染:</strong> 基于 When
						组件实现，支持根据字段值控制容器显示/隐藏
					</li>
					<li>
						<strong>容器类型:</strong> 支持 Card（卡片）和
						Bordered（有边框）两种类型
					</li>
					<li>
						<strong>布局方式:</strong> 支持 horizontal（水平）和
						vertical（垂直）布局
					</li>
					<li>
						<strong>标题样式:</strong> 支持 h1、h2、h3、h4 四种标题级别，h2
						默认带左侧竖线
					</li>
					<li>
						<strong>自定义容器:</strong>{' '}
						支持传入自定义容器函数，实现完全自定义的容器样式
					</li>
					<li>
						<strong>响应式:</strong> 当控制字段值改变时，容器会自动显示或隐藏
					</li>
				</ul>

				<h4>使用示例:</h4>
				<pre style={{ backgroundColor: '#fff', padding: 12, borderRadius: 4 }}>
					{`<Container
  containerType="Card"
  layout="vertical"
  title="标题"
  titleType="h2"
  effectedBy={['field3']}
  show={({ effectedValues }) => effectedValues.field3 === 'show'}
>
  <FormItem id="field1" label="字段1">
    <Input placeholder="请输入" />
  </FormItem>
</Container>`}
				</pre>
			</div>
		</Card>
	);
};

export default ContainerDemo;
