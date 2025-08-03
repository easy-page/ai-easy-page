import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PageContainer from '../components/PageContainer';
import './ApiPage.less';

const ApiPage: React.FC = () => {
	const componentsContent = `
# 组件 API

## DynamicForm

主要的表单组件，用于渲染动态表单。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| schema | FormSchema | - | 表单配置 |
| form | FormInstance | - | 表单实例 |
| onSubmit | (values: any) => void | - | 提交回调 |
| onValuesChange | (changedValues: any, allValues: any) => void | - | 值变化回调 |
| initialValues | Record<string, any> | - | 初始值 |
| disabled | boolean | false | 是否禁用 |

### 示例

\`\`\`tsx
import { DynamicForm } from 'easy-page-core';

const MyForm = () => {
  const schema = {
    fields: [
      {
        name: 'name',
        label: '姓名',
        type: 'input',
        rules: [{ required: true, message: '请输入姓名' }]
      }
    ]
  };

  const handleSubmit = (values) => {
    console.log('提交数据:', values);
  };

  return (
    <DynamicForm 
      schema={schema}
      onSubmit={handleSubmit}
      initialValues={{ name: '' }}
    />
  );
};
\`\`\`
  `;

	const hooksContent = `
# Hooks API

## useForm

表单 Hook，用于获取表单实例。

\`\`\`tsx
import { useForm } from 'easy-page-core';

const MyForm = () => {
  const [form] = useForm();
  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单数据:', values);
    } catch (error) {
      console.error('验证失败:', error);
    }
  };
  
  return (
    <DynamicForm 
      form={form}
      schema={schema}
      onSubmit={handleSubmit}
    />
  );
};
\`\`\`

### FormInstance 方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| validateFields | (nameList?: string[]) | Promise<any> | 验证表单字段 |
| getFieldValue | (name: string) | any | 获取字段值 |
| setFieldValue | (name: string, value: any) | void | 设置字段值 |
| getFieldsValue | (nameList?: string[]) | Record<string, any> | 获取多个字段值 |
| setFieldsValue | (values: Record<string, any>) | void | 设置多个字段值 |
| resetFields | (nameList?: string[]) | void | 重置字段 |
| clearValidate | (nameList?: string[]) | void | 清除验证状态 |
| scrollToField | (name: string) | void | 滚动到指定字段 |
  `;

	const typesContent = `
# 类型定义

## FormSchema

表单配置接口。

\`\`\`typescript
interface FormSchema {
  fields: FieldConfig[];
  layout?: LayoutConfig;
  actions?: ActionConfig[];
}
\`\`\`

## FieldConfig

字段配置接口。

\`\`\`typescript
interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  rules?: ValidationRule[];
  props?: Record<string, any>;
  when?: WhenCondition;
  dependencies?: string[];
}
\`\`\`

### FieldType

支持的字段类型：

- \`input\` - 文本输入
- \`textarea\` - 多行文本
- \`select\` - 下拉选择
- \`radio\` - 单选
- \`checkbox\` - 多选
- \`date\` - 日期选择
- \`dateRange\` - 日期范围
- \`time\` - 时间选择
- \`password\` - 密码输入
- \`number\` - 数字输入
- \`switch\` - 开关
- \`slider\` - 滑块
- \`rate\` - 评分
- \`upload\` - 文件上传

## ValidationRule

验证规则接口。

\`\`\`typescript
interface ValidationRule {
  required?: boolean;
  message?: string;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'url';
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (rule: any, value: any) => Promise<void> | void;
}
\`\`\`

## WhenCondition

条件渲染配置。

\`\`\`typescript
interface WhenCondition {
  field: string;
  value: any;
  operator?: 'eq' | 'ne' | 'in' | 'nin';
}
\`\`\`

## LayoutConfig

布局配置接口。

\`\`\`typescript
interface LayoutConfig {
  type: 'vertical' | 'horizontal' | 'grid';
  columns?: number;
  gutter?: number;
  labelCol?: number;
  wrapperCol?: number;
}
\`\`\`

## ActionConfig

操作按钮配置。

\`\`\`typescript
interface ActionConfig {
  type: 'submit' | 'reset' | 'cancel';
  text: string;
  props?: Record<string, any>;
}
\`\`\`
  `;

	const MarkdownContent: React.FC<{ content: string }> = ({ content }) => (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className="markdown-content">
				<ReactMarkdown
					components={{
						code({ inline, className, children, ...props }) {
							const match = /language-(\w+)/.exec(className || '');
							return !inline && match ? (
								<SyntaxHighlighter
									style={tomorrow as any}
									language={match[1]}
									PreTag="div"
									{...props}
								>
									{String(children).replace(/\n$/, '')}
								</SyntaxHighlighter>
							) : (
								<code className={className} {...props}>
									{children}
								</code>
							);
						},
					}}
				>
					{content}
				</ReactMarkdown>
			</div>
		</motion.div>
	);

	return (
		<PageContainer
			title="API 文档"
			subtitle="完整的 API 参考文档"
			className="api-page"
		>
			<Routes>
				<Route
					path="components"
					element={<MarkdownContent content={componentsContent} />}
				/>
				<Route
					path="hooks"
					element={<MarkdownContent content={hooksContent} />}
				/>
				<Route
					path="types"
					element={<MarkdownContent content={typesContent} />}
				/>
				<Route
					index
					element={<MarkdownContent content={componentsContent} />}
				/>
			</Routes>
		</PageContainer>
	);
};

export default ApiPage;
