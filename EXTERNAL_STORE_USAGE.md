# 外部 Store 使用指南

## 设计理念

在 Easy Page 表单框架中，我们采用了更简洁的设计：

- **Form 组件只需要传入 store** - 不再需要单独传入 validator
- **Store 内置 validator** - 每个 store 都有自己的 validator 实例
- **外部可以完全控制** - 通过外部 store 可以进行所有操作

## 基本用法

### 1. 创建外部 Store

```tsx
import { createFormStore } from '@easy-page/core';

const externalStore = createFormStore({
	username: 'initial-user',
	email: 'initial@example.com',
	age: 25,
});
```

### 2. 为 Store 添加自定义验证规则

```tsx
import { createFormStore } from '@easy-page/core';

const externalStore = createFormStore({
	username: 'initial-user',
	email: 'initial@example.com',
});

// 获取 store 的 validator 并添加自定义规则
const validator = externalStore.getValidator();
validator.addRule('customPhone', async (value, rule, store) => {
	if (!value) return { valid: true, field: '' };
	const phoneRegex = /^1[3-9]\d{9}$/;
	if (!phoneRegex.test(value as string)) {
		return {
			valid: false,
			message: '手机号格式不正确',
			field: '',
		};
	}
	return { valid: true, field: '' };
});
```

### 3. 在 Form 中使用外部 Store

```tsx
import { Form, FormItem } from '@easy-page/core';
import { Input } from '@easy-page/pc';

const MyForm = () => {
	return (
		<Form
			store={externalStore}
			onSubmit={(values, store) => {
				console.log('表单提交:', values);
			}}
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
				validate={[
					{
						validator: (value, store) => {
							const validator = store.getValidator();
							const customRule = validator.getCustomRule('customPhone');
							if (customRule) {
								return customRule(value, {}, store).then((result) => {
									return result.valid || result.message || '验证失败';
								});
							}
							return true;
						},
					},
				]}
			>
				<Input placeholder="请输入手机号" />
			</FormItem>
		</Form>
	);
};
```

## 外部操作示例

### 1. 外部验证

```tsx
// 验证所有字段
const results = await externalStore.validateAll();
if (results.length === 0) {
	console.log('所有字段验证通过！');
} else {
	console.log(
		'验证失败:',
		results.map((r) => r.message)
	);
}

// 验证特定字段
const fieldResults = await externalStore.validate('username');
```

### 2. 外部设置值

```tsx
// 设置单个字段值
externalStore.setValue('username', 'new-username');
externalStore.setValue('email', 'new@example.com');

// 批量设置值
externalStore.setValue('username', 'user1');
externalStore.setValue('age', 30);
```

### 3. 外部获取状态

```tsx
// 获取当前值
const username = externalStore.getValue('username');
const allValues = externalStore.state.values;

// 获取字段状态
const fieldState = externalStore.getFieldState('username');
console.log('字段是否有效:', externalStore.isFieldValid('username'));
console.log('字段是否被触摸:', externalStore.isFieldTouched('username'));
console.log('字段是否被修改:', externalStore.isFieldDirty('username'));
```

### 4. 外部重置

```tsx
// 重置整个表单
externalStore.reset();
```

## 高级用法

### 1. 多个表单共享 Store

```tsx
const sharedStore = createFormStore({
  user: { name: '', email: '' },
  settings: { theme: 'light', language: 'zh' }
});

// 表单 A
<Form store={sharedStore}>
  <FormItem id="user.name" label="用户名">
    <Input />
  </FormItem>
</Form>

// 表单 B
<Form store={sharedStore}>
  <FormItem id="settings.theme" label="主题">
    <Select options={[...]} />
  </FormItem>
</Form>
```

### 2. 动态表单验证

```tsx
const dynamicStore = createFormStore({});

// 动态添加字段验证
const addFieldValidation = (fieldName: string) => {
	const validator = dynamicStore.getValidator();
	validator.addRule(`dynamic_${fieldName}`, async (value, rule, store) => {
		// 动态验证逻辑
		return { valid: true, field: '' };
	});
};
```

### 3. 表单联动

```tsx
const linkedStore = createFormStore({
	province: '',
	city: '',
	district: '',
});

// 监听省份变化，更新城市选项
linkedStore.setValue('province', 'beijing');
linkedStore.setValue('city', ''); // 清空城市
linkedStore.setValue('district', ''); // 清空区县
```

## 优势

### 1. 简化 API

- Form 组件只需要传入 store
- 不需要管理 validator 实例
- 减少了参数传递

### 2. 更好的封装

- Store 和 validator 紧密耦合
- 外部操作更加统一
- 减少了状态管理的复杂性

### 3. 更强的灵活性

- 外部可以完全控制表单状态
- 支持复杂的表单联动
- 支持动态验证规则

### 4. 更好的可维护性

- 单一数据源
- 清晰的责任分离
- 更容易调试和测试

## 最佳实践

1. **创建 Store 时初始化数据** - 使用 `createFormStore(initialValues)`
2. **在 useEffect 中添加验证规则** - 避免重复添加
3. **使用 store.getValidator() 获取验证器** - 不要创建独立的验证器实例
4. **外部操作时使用 store 的方法** - 保持状态一致性
5. **合理使用 store.state 监听变化** - 避免过度渲染

这样的设计让表单框架更加简洁、灵活和易用！
