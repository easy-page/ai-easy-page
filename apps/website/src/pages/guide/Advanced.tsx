import React from 'react';
import { motion } from 'framer-motion';
import MarkdownRenderer from '../../components/MarkdownRenderer';

const Advanced: React.FC = () => {
	const content = `
# 进阶功能

## 条件渲染

Easy Page 支持基于其他字段值的条件渲染：

\`\`\`tsx
const schema = {
  fields: [
    {
      name: 'type',
      label: '类型',
      type: 'select',
      props: {
        options: [
          { label: '个人', value: 'personal' },
          { label: '企业', value: 'company' }
        ]
      }
    },
    {
      name: 'companyName',
      label: '公司名称',
      type: 'input',
      when: {
        field: 'type',
        value: 'company'
      }
    },
    {
      name: 'personalName',
      label: '个人姓名',
      type: 'input',
      when: {
        field: 'type',
        value: 'personal'
      }
    }
  ]
};
\`\`\`

## 动态验证

可以根据其他字段的值进行动态验证：

\`\`\`tsx
const schema = {
  fields: [
    {
      name: 'password',
      label: '密码',
      type: 'password'
    },
    {
      name: 'confirmPassword',
      label: '确认密码',
      type: 'password',
      rules: [
        { required: true, message: '请确认密码' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次输入的密码不一致'));
          },
        }),
      ]
    }
  ]
};
\`\`\`

## 自定义组件

Easy Page 支持自定义组件：

\`\`\`tsx
import { CustomField } from 'easy-page-core';

// 自定义组件
const MyCustomField = ({ value, onChange, ...props }) => {
  return (
    <div>
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
};

// 注册自定义组件
CustomField.register('my-custom', MyCustomField);

// 使用自定义组件
const schema = {
  fields: [
    {
      name: 'custom',
      label: '自定义字段',
      type: 'my-custom'
    }
  ]
};
\`\`\`

## 表单联动

支持字段间的联动效果：

\`\`\`tsx
const schema = {
  fields: [
    {
      name: 'province',
      label: '省份',
      type: 'select',
      props: {
        options: [
          { label: '北京', value: 'beijing' },
          { label: '上海', value: 'shanghai' }
        ]
      }
    },
    {
      name: 'city',
      label: '城市',
      type: 'select',
      props: {
        options: ({ province }) => {
          if (province === 'beijing') {
            return [
              { label: '朝阳区', value: 'chaoyang' },
              { label: '海淀区', value: 'haidian' }
            ];
          }
          if (province === 'shanghai') {
            return [
              { label: '浦东新区', value: 'pudong' },
              { label: '黄浦区', value: 'huangpu' }
            ];
          }
          return [];
        }
      }
    }
  ]
};
\`\`\`

## 异步验证

支持异步验证规则：

\`\`\`tsx
const schema = {
  fields: [
    {
      name: 'username',
      label: '用户名',
      type: 'input',
      rules: [
        { required: true, message: '请输入用户名' },
        {
          validator: async (_, value) => {
            if (!value) return;
            
            // 模拟异步验证
            const response = await fetch('/api/check-username', {
              method: 'POST',
              body: JSON.stringify({ username: value })
            });
            
            if (!response.ok) {
              throw new Error('用户名已存在');
            }
          }
        }
      ]
    }
  ]
};
\`\`\`

## 表单状态管理

Easy Page 提供了完整的表单状态管理：

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
  
  const handleReset = () => {
    form.resetFields();
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
  `;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<MarkdownRenderer content={content} />
		</motion.div>
	);
};

export default Advanced;
