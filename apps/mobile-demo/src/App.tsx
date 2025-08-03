import React from 'react';
import { Button, Space, Card, List } from 'antd-mobile';
import { Form, FormItem } from '@easy-page/core';
import { Input } from '@easy-page/mobile';

const App: React.FC = () => {
	const handleSubmit = async (values: any, store: any) => {
		console.log('表单提交:', values);
		console.log('Store 状态:', store.state);
	};

	return (
		<div style={{ padding: 16 }}>
			<h1>Easy Page 表单框架 - Mobile Demo</h1>

			<Card title="基础表单">
				<Form
					initialValues={{
						username: '',
						email: '',
						phone: '',
					}}
					onSubmit={handleSubmit}
				>
					<List>
						<FormItem
							id="username"
							label="用户名"
							required
							validate={[
								{ required: true, message: '请输入用户名' },
								{ min: 2, message: '用户名至少2个字符' },
							]}
						>
							<Input placeholder="请输入用户名" />
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
							id="phone"
							label="手机号"
							validate={[
								{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
							]}
						>
							<Input placeholder="请输入手机号" />
						</FormItem>
					</List>

					<Space
						style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
					>
						<Button type="submit" color="primary">
							提交
						</Button>
						<Button>重置</Button>
					</Space>
				</Form>
			</Card>
		</div>
	);
};

export default App;
