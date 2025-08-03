import React, { useState } from 'react';
import { Card, Alert, Tabs, Typography, Button, Space } from 'antd';

const { Text, Paragraph } = Typography;

const ConfigModeDemo: React.FC = () => {
	const [activeMode, setActiveMode] = useState('jsx');

	const jsxCode = `// JSX 声明式开发模式
<Form onSubmit={handleSubmit}>
  <FormItem id="username" label="用户名" required>
    <Input placeholder="请输入用户名" />
  </FormItem>
  <FormItem id="email" label="邮箱">
    <Input placeholder="请输入邮箱" />
  </FormItem>
  <FormItem
    id="role"
    label="角色"
    effects={[{
      effectedKeys: ['permissions'],
      handler: async ({ store }) => {
        const role = store.getValue('role');
        const permissions = await fetchPermissions(role);
        return {
          permissions: { fieldValue: permissions }
        };
      }
    }]}
  >
    <Select options={roleOptions} />
  </FormItem>
</Form>`;

	const jsonCode = `// JSON 配置驱动模式
const formConfig = {
  fields: [
    {
      id: 'username',
      label: '用户名',
      type: 'input',
      required: true,
      props: { placeholder: '请输入用户名' },
      validate: [{ required: true, message: '请输入用户名' }],
    },
    {
      id: 'email',
      label: '邮箱',
      type: 'input',
      props: { placeholder: '请输入邮箱' },
      validate: [{
        pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
        message: '邮箱格式不正确'
      }],
    },
    {
      id: 'role',
      label: '角色',
      type: 'select',
      props: { options: roleOptions },
      effects: [
        {
          effectedKeys: ['permissions'],
          handler: 'handleRoleChange',
        },
      ],
    },
  ],
  handlers: {
    handleRoleChange: async ({ store }) => {
      const role = store.getValue('role');
      const permissions = await fetchPermissions(role);
      return {
        permissions: { fieldValue: permissions }
      };
    },
  },
};

<ConfigurableForm config={formConfig} onSubmit={handleSubmit} />`;

	const tabItems = [
		{
			key: 'jsx',
			label: 'JSX 声明式',
			children: (
				<div>
					<Alert
						message="JSX 声明式开发"
						description="适合开发阶段，提供完整的类型检查和 IDE 支持，开发体验友好。"
						type="success"
						showIcon
						style={{ marginBottom: '16px' }}
					/>
					<pre
						style={{
							background: '#f5f5f5',
							padding: '12px',
							borderRadius: '4px',
							overflow: 'auto',
						}}
					>
						{jsxCode}
					</pre>
				</div>
			),
		},
		{
			key: 'json',
			label: 'JSON 配置',
			children: (
				<div>
					<Alert
						message="JSON 配置驱动"
						description="适合运行时动态生成表单，支持配置的远程下发和动态渲染。"
						type="warning"
						showIcon
						style={{ marginBottom: '16px' }}
					/>
					<pre
						style={{
							background: '#f5f5f5',
							padding: '12px',
							borderRadius: '4px',
							overflow: 'auto',
						}}
					>
						{jsonCode}
					</pre>
				</div>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<Alert
				message="开发配置双模式"
				description="既支持 JSX 声明式开发，也支持 JSON 配置驱动。可实现表单配置的动态下发和渲染。"
				type="info"
				showIcon
				style={{ marginBottom: '24px' }}
			/>

			<Card title="开发模式对比" style={{ marginBottom: '24px' }}>
				<Tabs
					activeKey={activeMode}
					onChange={setActiveMode}
					items={tabItems}
				/>
			</Card>

			<Card title="模式特点对比" type="inner">
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '24px',
					}}
				>
					<div>
						<Paragraph>
							<Text strong>JSX 声明式模式优势:</Text>
						</Paragraph>
						<ul style={{ paddingLeft: '20px' }}>
							<li>完整的 TypeScript 类型检查</li>
							<li>IDE 智能提示和自动补全</li>
							<li>编译时错误检查</li>
							<li>更好的开发体验</li>
							<li>组件复用和抽象</li>
						</ul>
					</div>
					<div>
						<Paragraph>
							<Text strong>JSON 配置模式优势:</Text>
						</Paragraph>
						<ul style={{ paddingLeft: '20px' }}>
							<li>支持动态配置下发</li>
							<li>运行时表单生成</li>
							<li>配置可视化编辑</li>
							<li>跨平台配置共享</li>
							<li>业务人员可配置</li>
						</ul>
					</div>
				</div>

				<div style={{ marginTop: '24px' }}>
					<Paragraph>
						<Text strong>使用建议:</Text>
					</Paragraph>
					<ul style={{ paddingLeft: '20px' }}>
						<li>
							<Text strong>开发阶段:</Text> 推荐使用 JSX
							声明式模式，获得更好的开发体验
						</li>
						<li>
							<Text strong>动态场景:</Text> 使用 JSON
							配置模式，支持运行时动态生成表单
						</li>
						<li>
							<Text strong>混合使用:</Text> 可以在同一个项目中混合使用两种模式
						</li>
					</ul>
				</div>
			</Card>
		</div>
	);
};

export default ConfigModeDemo;
