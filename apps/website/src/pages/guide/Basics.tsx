import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Basics: React.FC = () => {
	const content = `
# 基础使用

## 安装

首先安装 Easy Page 核心包：

\`\`\`bash
npm install easy-page-core
# 或者
yarn add easy-page-core
\`\`\`

## 基本用法

### 1. 创建简单表单

\`\`\`tsx
import React from 'react';
import { DynamicForm } from 'easy-page-core';

const BasicForm = () => {
  const schema = {
    fields: [
      {
        name: 'name',
        label: '姓名',
        type: 'input',
        rules: [{ required: true, message: '请输入姓名' }]
      },
      {
        name: 'email',
        label: '邮箱',
        type: 'input',
        rules: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]
      }
    ]
  };

  const handleSubmit = (values: any) => {
    console.log('表单数据:', values);
  };

  return (
    <DynamicForm 
      schema={schema} 
      onSubmit={handleSubmit}
    />
  );
};
\`\`\`

### 2. 字段类型

Easy Page 支持多种字段类型：

\`\`\`tsx
const schema = {
  fields: [
    {
      name: 'text',
      label: '文本输入',
      type: 'input'
    },
    {
      name: 'textarea',
      label: '多行文本',
      type: 'textarea'
    },
    {
      name: 'select',
      label: '下拉选择',
      type: 'select',
      props: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' }
        ]
      }
    },
    {
      name: 'radio',
      label: '单选',
      type: 'radio',
      props: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' }
        ]
      }
    },
    {
      name: 'checkbox',
      label: '多选',
      type: 'checkbox',
      props: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' }
        ]
      }
    },
    {
      name: 'date',
      label: '日期选择',
      type: 'date'
    }
  ]
};
\`\`\`

### 3. 表单验证

Easy Page 内置了强大的验证功能：

\`\`\`tsx
const schema = {
  fields: [
    {
      name: 'username',
      label: '用户名',
      type: 'input',
      rules: [
        { required: true, message: '请输入用户名' },
        { min: 3, max: 20, message: '用户名长度在 3-20 个字符' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
      ]
    },
    {
      name: 'password',
      label: '密码',
      type: 'password',
      rules: [
        { required: true, message: '请输入密码' },
        { min: 6, message: '密码长度不能少于 6 位' }
      ]
    }
  ]
};
\`\`\`

### 4. 表单布局

可以通过 layout 配置控制表单布局：

\`\`\`tsx
const schema = {
  layout: {
    type: 'grid',
    columns: 2,
    gutter: 16
  },
  fields: [
    // ... 字段配置
  ]
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
						code({ inline, className, children, ...props }) {
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

export default Basics;
