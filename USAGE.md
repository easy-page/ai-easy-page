# Easy Page 表单框架使用示例

## 基础用法

### 1. 安装依赖

```bash
# 安装核心包
pnpm add @easy-page/core

# 安装 PC 端组件
pnpm add @easy-page/pc antd

# 安装移动端组件
pnpm add @easy-page/mobile antd-mobile
```

### 2. 基础表单

```tsx
import React from 'react';
import { Form, FormItem } from '@easy-page/core';
import { Input, Select } from '@easy-page/pc';

const BasicForm = () => {
	const handleSubmit = async (values, store) => {
		console.log('表单提交:', values);
		console.log('Store 状态:', store.state);
	};

	return (
		<Form
			initialValues={{
				username: '',
				email: '',
				age: 18,
			}}
			onSubmit={handleSubmit}
		>
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
					{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' },
				]}
			>
				<Input placeholder="请输入邮箱" />
			</FormItem>

			<FormItem
				id="age"
				label="年龄"
				validate={[{ min: 1, max: 120, message: '年龄必须在1-120之间' }]}
			>
				<Input type="number" placeholder="请输入年龄" />
			</FormItem>

			<button type="submit">提交</button>
		</Form>
	);
};
```

### 3. 联动验证

```tsx
const LinkedValidationForm = () => {
	return (
		<Form
			initialValues={{
				password: '',
				confirmPassword: '',
			}}
			onSubmit={handleSubmit}
		>
			<FormItem
				id="password"
				label="密码"
				required
				validate={[
					{ required: true, message: '请输入密码' },
					{ min: 6, message: '密码至少6位' },
				]}
			>
				<Input type="password" placeholder="请输入密码" />
			</FormItem>

			<FormItem
				id="confirmPassword"
				label="确认密码"
				required
				validate={[
					{ required: true, message: '请确认密码' },
					{
						validator: (value, store) => {
							const password = store.getValue('password');
							return value === password || '两次输入的密码不一致';
						},
					},
				]}
			>
				<Input type="password" placeholder="请确认密码" />
			</FormItem>
		</Form>
	);
};
```

### 4. 动态表单

```tsx
import { DynamicForm } from '@easy-page/pc';

const DynamicFormExample = () => {
	const config = {
		rows: [
			{
				id: 'row-1',
				fields: ['name', 'age', 'email'],
				removable: false,
				addable: true,
			},
		],
		onAdd: (index) => {
			console.log('添加行:', index);
		},
		onRemove: (index) => {
			console.log('删除行:', index);
		},
	};

	return (
		<DynamicForm config={config}>
			<Form
				initialValues={{
					name: '',
					age: '',
					email: '',
				}}
				onSubmit={handleSubmit}
			>
				<div style={{ display: 'flex', gap: 16 }}>
					<FormItem
						id="name"
						label="姓名"
						required
						validate={[{ required: true, message: '请输入姓名' }]}
					>
						<Input placeholder="请输入姓名" />
					</FormItem>

					<FormItem
						id="age"
						label="年龄"
						validate={[{ min: 1, max: 120, message: '年龄必须在1-120之间' }]}
					>
						<Input type="number" placeholder="请输入年龄" />
					</FormItem>

					<FormItem
						id="email"
						label="邮箱"
						validate={[
							{
								pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: '邮箱格式不正确',
							},
						]}
					>
						<Input placeholder="请输入邮箱" />
					</FormItem>
				</div>
			</Form>
		</DynamicForm>
	);
};
```

### 5. 远程搜索选择器

```tsx
const RemoteSearchSelect = () => {
	const handleSearch = async (keyword) => {
		// 模拟远程搜索
		const results = await fetch(`/api/search?keyword=${keyword}`);
		const data = await results.json();
		return data.map((item) => ({
			label: item.name,
			value: item.id,
		}));
	};

	return (
		<FormItem id="city" label="城市">
			<Select placeholder="请选择城市" remoteSearch onSearch={handleSearch} />
		</FormItem>
	);
};
```

### 6. 自定义验证器

```tsx
import { FormValidator } from '@easy-page/core';

// 创建自定义验证器
const validator = new FormValidator();

// 添加自定义验证规则
validator.addRule('phone', async (value, rule, store) => {
	if (!value) return { valid: true, field: '' };

	const phoneRegex = /^1[3-9]\d{9}$/;
	if (!phoneRegex.test(value)) {
		return {
			valid: false,
			message: '手机号格式不正确',
			field: '',
		};
	}

	return { valid: true, field: '' };
});

// 使用自定义验证器
const CustomValidationForm = () => {
	return (
		<FormItem
			id="phone"
			label="手机号"
			validate={[
				{
					validator: (value, store) =>
						validator.getCustomRule('phone')(value, {}, store),
				},
			]}
		>
			<Input placeholder="请输入手机号" />
		</FormItem>
	);
};
```

### 7. 状态管理

```tsx
import { createFormStore } from '@easy-page/core';

const StateManagementExample = () => {
	const store = createFormStore({
		username: '',
		email: '',
	});

	// 设置值
	const handleSetValue = () => {
		store.setValue('username', 'new value');
	};

	// 获取值
	const handleGetValue = () => {
		const value = store.getValue('username');
		console.log('用户名:', value);
	};

	// 验证
	const handleValidate = async () => {
		const results = await store.validate('username');
		console.log('验证结果:', results);
	};

	// 检查字段状态
	const checkFieldState = () => {
		const isValid = store.isFieldValid('username');
		const isTouched = store.isFieldTouched('username');
		const isDirty = store.isFieldDirty('username');

		console.log('字段状态:', { isValid, isTouched, isDirty });
	};

	return (
		<div>
			<button onClick={handleSetValue}>设置值</button>
			<button onClick={handleGetValue}>获取值</button>
			<button onClick={handleValidate}>验证</button>
			<button onClick={checkFieldState}>检查状态</button>
		</div>
	);
};
```

## 移动端使用

```tsx
import { Form, FormItem } from '@easy-page/core';
import { Input } from '@easy-page/mobile';

const MobileForm = () => {
	return (
		<Form
			initialValues={{
				username: '',
				phone: '',
			}}
			onSubmit={handleSubmit}
		>
			<FormItem
				id="username"
				label="用户名"
				required
				validate={[{ required: true, message: '请输入用户名' }]}
			>
				<Input placeholder="请输入用户名" />
			</FormItem>

			<FormItem
				id="phone"
				label="手机号"
				validate={[{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }]}
			>
				<Input placeholder="请输入手机号" />
			</FormItem>
		</Form>
	);
};
```

## 高级特性

### 1. 条件渲染

```tsx
const ConditionalForm = () => {
	const [showExtra, setShowExtra] = useState(false);

	return (
		<Form>
			<FormItem id="type" label="类型">
				<Select
					options={[
						{ label: '个人', value: 'personal' },
						{ label: '企业', value: 'company' },
					]}
					onChange={(value) => setShowExtra(value === 'company')}
				/>
			</FormItem>

			{showExtra && (
				<FormItem id="companyName" label="公司名称" required>
					<Input placeholder="请输入公司名称" />
				</FormItem>
			)}
		</Form>
	);
};
```

### 2. 表单联动

```tsx
const LinkedForm = () => {
	return (
		<Form>
			<FormItem id="province" label="省份">
				<Select
					options={[
						{ label: '北京', value: 'beijing' },
						{ label: '上海', value: 'shanghai' },
					]}
				/>
			</FormItem>

			<FormItem
				id="city"
				label="城市"
				extra={(store) => {
					const province = store.getValue('province');
					return province ? `当前选择省份: ${province}` : '请先选择省份';
				}}
			>
				<Select
					options={[
						{ label: '朝阳区', value: 'chaoyang' },
						{ label: '海淀区', value: 'haidian' },
					]}
				/>
			</FormItem>
		</Form>
	);
};
```

## 最佳实践

1. **合理使用验证规则** - 避免过度验证，保持用户体验
2. **统一错误处理** - 使用统一的错误信息格式
3. **性能优化** - 对于大型表单，考虑使用虚拟滚动
4. **可访问性** - 确保表单具有良好的可访问性支持
5. **测试覆盖** - 为表单逻辑编写充分的测试用例
