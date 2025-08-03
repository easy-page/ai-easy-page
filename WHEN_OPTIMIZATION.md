# When 组件优化说明

## 优化背景

原来的 When 组件存在性能问题：每当 store 中的任何字段发生变化时，所有的 When 组件都会重新执行 `show` 函数来判断是否显示，这会导致不必要的性能开销。

## 优化方案

### 1. 新增 `effectedBy` 属性

When 组件现在支持 `effectedBy` 属性，用于指定当前 When 组件依赖哪些字段的变化：

```tsx
<When
	effectedBy={['field1', 'field2']}
	show={({ effectedValues }) => {
		// 只有当 field1 或 field2 变化时，才会执行这个函数
		return (
			effectedValues.field1 === 'value1' && effectedValues.field2 === 'value2'
		);
	}}
>
	<FormItem name="field3">...</FormItem>
</When>
```

### 2. 精准的依赖监听

- 只有当 `effectedBy` 中指定的字段发生变化时，When 组件才会重新计算
- 通过 `effectedValues` 参数直接获取依赖字段的值，无需通过 `store.getValue()` 调用
- 在 store 中实现了 When 监听器管理机制，支持精准的订阅和取消订阅

### 3. 性能提升

- **减少不必要的计算**：只有当相关字段变化时才重新计算
- **减少 store 访问**：直接通过 `effectedValues` 获取值，避免重复的 `store.getValue()` 调用
- **内存优化**：组件卸载时自动清理监听器，避免内存泄漏

## 使用方式对比

### 优化前（不推荐）

```tsx
<When
	show={({ store }) => {
		// 每次 store 任何字段变化都会执行
		const field1 = store.getValue('field1');
		const field2 = store.getValue('field2');
		return field1 === 'value1' && field2 === 'value2';
	}}
>
	<FormItem name="field3">...</FormItem>
</When>
```

### 优化后（推荐）

```tsx
<When
	effectedBy={['field1', 'field2']}
	show={({ effectedValues }) => {
		// 只有当 field1 或 field2 变化时才执行
		return (
			effectedValues.field1 === 'value1' && effectedValues.field2 === 'value2'
		);
	}}
>
	<FormItem name="field3">...</FormItem>
</When>
```

## 技术实现

### 1. 类型定义

```typescript
// When 组件监听器配置
export interface WhenListener {
	id: string; // 监听器唯一标识
	effectedBy: string[]; // 被哪些字段影响
	show: (params: {
		store: FormStore;
		effectedValues: Record<string, FieldValue>;
		rowInfo?: ExtendedRowInfo;
	}) => boolean;
	rowInfo?: ExtendedRowInfo; // 行信息（用于动态表单）
}
```

### 2. Store 扩展

在 FormStore 中添加了 When 监听器管理：

```typescript
// 注册 When 组件监听器
registerWhenListener: (listener: WhenListener) => void;
// 注销 When 组件监听器
unregisterWhenListener: (id: string) => void;
```

### 3. 组件实现

When 组件内部：

- 使用 `useEffect` 注册和注销监听器
- 通过 `effectedValues` 获取依赖字段的值
- 自动生成唯一的监听器 ID

## 兼容性

- 原有的 `show` 函数签名仍然支持，但建议使用新的 `effectedBy` 方式
- 如果不指定 `effectedBy`，组件会回退到原来的行为（监听所有字段变化）

## 最佳实践

1. **明确指定依赖字段**：总是使用 `effectedBy` 属性明确指定依赖的字段
2. **使用 effectedValues**：在 `show` 函数中使用 `effectedValues` 而不是 `store.getValue()`
3. **避免复杂计算**：在 `show` 函数中避免复杂的计算逻辑
4. **合理分组**：将相关的 When 组件分组，减少重复的依赖声明

## 示例

查看 `apps/pc-demo/src/demos/when/` 目录下的示例文件，了解具体的使用方式。
