import React from 'react';
import { Form, FormItem, createFormStore, FormMode } from '../index';

/**
 * 优化后的表单使用示例
 * 展示如何使用 storeId 和优化的 hooks 来避免不必要的重新渲染
 */

// 方案一：使用 storeId 创建独立的 store 实例
const OptimizedFormExample1: React.FC = () => {
	const handleSubmit = async (values: any, store: any) => {
		console.log('表单1提交:', values);
	};

	return (
		<Form
			storeId="form1" // 使用唯一的 store ID
			initialValues={{
				username: '',
				email: '',
			}}
			onSubmit={handleSubmit}
		>
			<FormItem
				id="username"
				label="用户名"
				required
				validate={[{ required: true, message: '请输入用户名' }]}
			>
				<input placeholder="请输入用户名" />
			</FormItem>

			<FormItem
				id="email"
				label="邮箱"
				required
				validate={[
					{ required: true, message: '请输入邮箱' },
					{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' },
				]}
			>
				<input placeholder="请输入邮箱" />
			</FormItem>

			<button type="submit">提交</button>
		</Form>
	);
};

// 方案二：使用外部 store 实例
const OptimizedFormExample2: React.FC = () => {
	// 创建独立的 store 实例
	const externalStore = createFormStore('form2', {
		age: 18,
		phone: '',
	});

	const handleSubmit = async (values: any, store: any) => {
		console.log('表单2提交:', values);
	};

	return (
		<Form
			store={externalStore} // 使用外部 store
			onSubmit={handleSubmit}
		>
			<FormItem
				id="age"
				label="年龄"
				validate={[{ min: 1, max: 120, message: '年龄必须在1-120之间' }]}
			>
				<input type="number" placeholder="请输入年龄" />
			</FormItem>

			<FormItem
				id="phone"
				label="手机号"
				validate={[{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }]}
			>
				<input placeholder="请输入手机号" />
			</FormItem>

			<button type="submit">提交</button>
		</Form>
	);
};

// 方案三：使用优化的 hooks 的组件
const OptimizedFieldComponent: React.FC<{ fieldId: string }> = ({
	fieldId,
}) => {
	// 使用优化的 hooks，只订阅特定字段的状态
	const { useFormValue, useFormFieldState } = require('../context');

	const fieldValue = useFormValue(fieldId);
	const fieldState = useFormFieldState(fieldId);

	return (
		<div>
			<p>字段值: {fieldValue}</p>
			<p>是否有错误: {fieldState.errors.length > 0 ? '是' : '否'}</p>
			<p>是否被触摸: {fieldState.touched ? '是' : '否'}</p>
		</div>
	);
};

// 方案四：多个表单共存，互不影响
const MultipleFormsExample: React.FC = () => {
	return (
		<div style={{ display: 'flex', gap: '20px' }}>
			<div style={{ flex: 1 }}>
				<h3>表单1</h3>
				<OptimizedFormExample1 />
			</div>
			<div style={{ flex: 1 }}>
				<h3>表单2</h3>
				<OptimizedFormExample2 />
			</div>
		</div>
	);
};

// 方案五：使用 store 管理器
const StoreManagerExample: React.FC = () => {
	const { storeManager } = require('../store/storeManager');

	// 创建多个 store
	const store1 = storeManager.createStore('example1', { name: '' });
	const store2 = storeManager.createStore('example2', { email: '' });

	// 检查 store 状态
	console.log('Store 数量:', storeManager.getStoreCount());
	console.log('Store IDs:', storeManager.getStoreIds());

	return (
		<div>
			<h3>Store 管理器示例</h3>
			<p>当前 Store 数量: {storeManager.getStoreCount()}</p>
			<p>Store IDs: {storeManager.getStoreIds().join(', ')}</p>
		</div>
	);
};

export {
	OptimizedFormExample1,
	OptimizedFormExample2,
	OptimizedFieldComponent,
	MultipleFormsExample,
	StoreManagerExample,
};
