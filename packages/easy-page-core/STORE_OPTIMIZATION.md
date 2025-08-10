# Store 优化方案

## 问题分析

原始的 Provider 模式存在以下问题：

1. **全局重新渲染**：store 中任何属性变化都会触发所有子组件重新渲染
2. **单例限制**：全局只有一个 store 实例，多个表单会互相影响
3. **性能问题**：不必要的重新渲染影响性能

## 解决方案

### 方案一：使用 MobX 的 computed 优化重新渲染

通过使用 MobX 的 `computed` 和优化的 hooks，只订阅需要的状态：

```tsx
// 优化的 hooks，只订阅特定状态
export const useFormValue = (field: string) => {
	const { store } = useFormContext();
	return computed(() => store.getValue(field)).get();
};

export const useFormFieldState = (field: string) => {
	const { store } = useFormContext();
	return computed(() => store.getFieldState(field)).get();
};
```

**优势**：

- 只有订阅的字段变化时才重新渲染
- 减少不必要的重新渲染
- 保持响应式特性

### 方案二：Store 管理器支持多实例

创建 `StoreManager` 来管理多个独立的 store 实例：

```tsx
// 创建独立的 store 实例
const store1 = createFormStore('form1', { username: '' });
const store2 = createFormStore('form2', { email: '' });

// 使用 storeId 指定 store
<Form storeId="form1" initialValues={{ username: '' }}>
	{/* 表单内容 */}
</Form>;
```

**优势**：

- 支持多个表单共存
- 每个表单有独立的 store
- 避免表单间互相影响

### 方案三：优化的 Form 组件

Form 组件支持 `storeId` 参数：

```tsx
export const Form: React.FC<FormProps> = observer(
	({
		storeId, // 新增：store ID 参数
		// ... 其他参数
	}) => {
		// 使用 storeId 或生成唯一 ID
		const finalStoreId = useMemo(() => {
			if (storeId) return storeId;
			if (externalStore) return 'external-store';
			return `form-${Math.random().toString(36).substr(2, 9)}`;
		}, [storeId, externalStore]);

		// 尝试从 storeManager 获取已存在的 store
		const existingStore = getFormStore(finalStoreId);
		if (existingStore) {
			return existingStore;
		}
		// 创建新的 store
		return createFormStore(finalStoreId, initialValues);
	}
);
```

### 方案四：优化的 FormItem 组件

FormItem 组件使用优化的 hooks：

```tsx
const FormItemComponent: React.FC<FormItemProps> = ({ id, ...props }) => {
	// 使用优化的 hooks，只订阅需要的状态
	const fieldValue = useFormValue(id);
	const fieldState = useFormFieldState(id);
	const isFormDisabled = useFormDisabled();

	// 只有相关状态变化时才重新渲染
	return <div className="easy-form-item">{/* 表单内容 */}</div>;
};
```

## 使用示例

### 1. 使用 storeId 创建独立表单

```tsx
const MyForm = () => {
	return (
		<Form
			storeId="my-form" // 使用唯一的 store ID
			initialValues={{ username: '', email: '' }}
			onSubmit={handleSubmit}
		>
			<FormItem id="username" label="用户名">
				<input />
			</FormItem>
			<FormItem id="email" label="邮箱">
				<input />
			</FormItem>
		</Form>
	);
};
```

### 2. 使用外部 store 实例

```tsx
const MyForm = () => {
	// 创建独立的 store 实例
	const externalStore = createFormStore('external-form', {
		username: '',
		email: '',
	});

	return (
		<Form store={externalStore} onSubmit={handleSubmit}>
			{/* 表单内容 */}
		</Form>
	);
};
```

### 3. 多个表单共存

```tsx
const MultipleForms = () => {
	return (
		<div>
			<Form storeId="form1" initialValues={{ name: '' }}>
				<FormItem id="name" label="姓名">
					<input />
				</FormItem>
			</Form>

			<Form storeId="form2" initialValues={{ email: '' }}>
				<FormItem id="email" label="邮箱">
					<input />
				</FormItem>
			</Form>
		</div>
	);
};
```

### 4. 使用优化的 hooks

```tsx
const FieldMonitor = ({ fieldId }: { fieldId: string }) => {
	// 只订阅特定字段的状态
	const fieldValue = useFormValue(fieldId);
	const fieldState = useFormFieldState(fieldId);

	return (
		<div>
			<p>字段值: {fieldValue}</p>
			<p>是否有错误: {fieldState.errors.length > 0 ? '是' : '否'}</p>
		</div>
	);
};
```

## 性能优化建议

### 1. 使用 React.memo 包装子组件

```tsx
const OptimizedField = React.memo(
	({ id, label }: { id: string; label: string }) => {
		const fieldValue = useFormValue(id);

		return (
			<div>
				<label>{label}</label>
				<input value={fieldValue} />
			</div>
		);
	}
);
```

### 2. 使用 useMemo 缓存计算结果

```tsx
const FormSummary = () => {
	const values = useFormValues();

	const summary = useMemo(() => {
		return {
			totalFields: Object.keys(values).length,
			filledFields: Object.values(values).filter((v) => v !== '').length,
		};
	}, [values]);

	return (
		<div>
			<p>总字段数: {summary.totalFields}</p>
			<p>已填写: {summary.filledFields}</p>
		</div>
	);
};
```

### 3. 合理使用 storeId

```tsx
// 好的做法：使用有意义的 storeId
<Form storeId="user-profile-form">
<Form storeId="order-form">
<Form storeId="settings-form">

// 避免：使用随机或重复的 storeId
<Form storeId="form1">
<Form storeId="form1"> // 重复的 ID 会导致问题
```

## 迁移指南

### 从旧版本迁移

1. **添加 storeId**：

```tsx
// 旧版本
<Form initialValues={{ name: '' }}>

// 新版本
<Form storeId="my-form" initialValues={{ name: '' }}>
```

2. **使用优化的 hooks**：

```tsx
// 旧版本
const { store } = useFormContext();
const value = store.getValue('field');

// 新版本
const value = useFormValue('field');
```

3. **多表单场景**：

```tsx
// 旧版本：会互相影响
<Form initialValues={{ name: '' }}>
<Form initialValues={{ email: '' }}>

// 新版本：独立运行
<Form storeId="form1" initialValues={{ name: '' }}>
<Form storeId="form2" initialValues={{ email: '' }}>
```

## 总结

通过这些优化方案，我们解决了以下问题：

1. ✅ **避免全局重新渲染**：使用 computed 和优化的 hooks
2. ✅ **支持多实例**：通过 StoreManager 管理多个 store
3. ✅ **提升性能**：减少不必要的重新渲染
4. ✅ **保持兼容性**：向后兼容现有代码
5. ✅ **易于使用**：提供简单的 API

这些优化让 Easy Page 表单框架更适合复杂应用场景，同时保持了良好的性能和用户体验。
