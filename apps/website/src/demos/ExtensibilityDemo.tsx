import React from 'react';
import { Card, Alert, Typography, Tabs, Space, Tag } from 'antd';

const { Text, Paragraph, Title } = Typography;

const ExtensibilityDemo: React.FC = () => {
	const tabItems = [
		{
			key: 'pc',
			label: 'PC 端适配',
			children: (
				<div>
					<Paragraph>
						<Text strong>Ant Design 适配示例:</Text>
					</Paragraph>
					<pre
						style={{
							background: '#f5f5f5',
							padding: '12px',
							borderRadius: '4px',
						}}
					>
						{`// packages/easy-page-pc - Ant Design 适配
export const Input: React.FC<InputProps> = ({ id, ...props }) => {
  const { store } = useFormContext();
  const value = store.getValue(id);

  return (
    <AntInput
      {...props}
      value={value}
      onChange={(e) => store.setValue(id, e.target.value)}
    />
  );
};`}
					</pre>
				</div>
			),
		},
		{
			key: 'mobile',
			label: 'Mobile 端适配',
			children: (
				<div>
					<Paragraph>
						<Text strong>Ant Design Mobile 适配示例:</Text>
					</Paragraph>
					<pre
						style={{
							background: '#f5f5f5',
							padding: '12px',
							borderRadius: '4px',
						}}
					>
						{`// packages/easy-page-mobile - Ant Design Mobile 适配
export const Input: React.FC<InputProps> = ({ id, ...props }) => {
  const { store } = useFormContext();
  const value = store.getValue(id);

  return (
    <AntMobileInput
      {...props}
      value={value}
      onChange={(value) => store.setValue(id, value)}
    />
  );
};`}
					</pre>
				</div>
			),
		},
		{
			key: 'custom',
			label: '自定义组件',
			children: (
				<div>
					<Paragraph>
						<Text strong>自定义验证器扩展:</Text>
					</Paragraph>
					<pre
						style={{
							background: '#f5f5f5',
							padding: '12px',
							borderRadius: '4px',
						}}
					>
						{`const validator = new FormValidator();
validator.addRule('customPhone', async (value, rule, store) => {
  const phoneRegex = /^1[3-9]\\d{9}$/;
  if (!phoneRegex.test(value)) {
    return { valid: false, message: '手机号格式不正确' };
  }
  return { valid: true };
});

// 使用自定义验证器
<FormItem
  id="phone"
  validate={[{ customPhone: true, message: '请输入正确的手机号' }]}
>
  <Input placeholder="请输入手机号" />
</FormItem>`}
					</pre>
				</div>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<Alert
				message="超强扩展性"
				description="核心逻辑与 UI 库解耦，可轻松适配任意组件库。支持多端适配（PC、Mobile），自定义验证器和组件，插件化的设计理念。"
				type="info"
				showIcon
				style={{ marginBottom: '24px' }}
			/>

			<Card title="扩展性演示" style={{ marginBottom: '24px' }}>
				<div style={{ marginBottom: '24px' }}>
					<Title level={4}>支持的平台和组件库</Title>
					<Space wrap>
						<Tag color="blue">Ant Design (PC)</Tag>
						<Tag color="green">Ant Design Mobile</Tag>
						<Tag color="orange">Element Plus</Tag>
						<Tag color="purple">Arco Design</Tag>
						<Tag color="cyan">自定义组件库</Tag>
					</Space>
				</div>

				<Tabs items={tabItems} />
			</Card>

			<Card title="扩展特性" type="inner">
				<ul style={{ paddingLeft: '20px' }}>
					<li>
						<Text strong>核心逻辑与 UI 解耦:</Text> 表单逻辑独立于具体的 UI
						组件库
					</li>
					<li>
						<Text strong>多端适配:</Text> 同一套逻辑可以适配 PC 端和移动端
					</li>
					<li>
						<Text strong>自定义验证器:</Text> 支持扩展自定义的验证规则
					</li>
					<li>
						<Text strong>插件化设计:</Text> 模块化的架构，便于功能扩展
					</li>
					<li>
						<Text strong>类型安全:</Text> 完整的 TypeScript 类型支持
					</li>
				</ul>
			</Card>
		</div>
	);
};

export default ExtensibilityDemo;
