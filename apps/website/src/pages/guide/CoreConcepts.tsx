import React from 'react';
import { Typography, Card, Space, Alert } from 'antd';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Title, Paragraph } = Typography;
const CoreConcepts: React.FC = () => {
	const content = `
# 核心概念

Easy Page 是一个基于 React 的动态表单框架，通过配置化的方式快速生成表单。理解以下核心概念将帮助你更好地使用 Easy Page。

## 表单配置 (Schema)

表单配置是 Easy Page 的核心，它定义了表单的结构、字段类型、验证规则等。

\`\`\`typescript
interface FormSchema {
  fields: FieldConfig[];
  layout?: LayoutConfig;
  actions?: ActionConfig[];
}
\`\`\`

## 字段配置 (Field)

每个表单字段都有对应的配置，包括字段类型、标签、验证规则等。

\`\`\`typescript
interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  rules?: ValidationRule[];
  props?: Record<string, any>;
}
\`\`\`

## 布局配置 (Layout)

布局配置定义了表单的排列方式，支持多种布局模式。

\`\`\`typescript
interface LayoutConfig {
  type: 'vertical' | 'horizontal' | 'grid';
  columns?: number;
  gutter?: number;
}
\`\`\`

## 动态表单 (DynamicForm)

DynamicForm 是 Easy Page 的主要组件，它接收表单配置并渲染出完整的表单。

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

  return <DynamicForm schema={schema} />;
};
\`\`\`
  `;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<div className="markdown-content">
				<ReactMarkdown
					components={{
						code({ node, inline, className, children, ...props }) {
							const match = /language-(\w+)/.exec(className || '');
							return !inline && match ? (
								<SyntaxHighlighter
									style={tomorrow}
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
};

export default CoreConcepts;
