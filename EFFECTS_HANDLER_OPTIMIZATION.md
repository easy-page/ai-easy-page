# Effects Handler 参数结构优化

## 优化概述

本次优化将 `effects` 和 `actions` 的 `handler` 参数结构进行了重构，使其更加简洁和易用。

## 优化前的问题

### 1. 参数结构复杂

```typescript
// 优化前
handler: async (store: FormStore, rowInfo?: ExtendedRowInfo) =>
	Promise<Record<string, { fieldValue: any; fieldProps: Record<string, any> }>>;
```

### 2. 需要手动获取当前字段值

```typescript
// 优化前需要手动获取当前字段值
const currentThreshold = store.getValue(`${rowInfo.currentRow}_threshold`);
```

### 3. 无法直接获取当前行的所有值

需要遍历所有字段来获取当前行的完整数据。

## 优化后的改进

### 1. 新的参数结构

```typescript
// 优化后
handler: async (params: {
	store: FormStore;
	rowInfo?: ExtendedRowInfo;
	value: any; // 当前字段的值
	rowValue: any; // 当前行的所有字段值
}) =>
	Promise<Record<string, { fieldValue: any; fieldProps: Record<string, any> }>>;
```

### 2. 直接使用当前字段值

```typescript
// 优化后直接使用 value 参数
const currentThreshold = value;
```

### 3. 直接获取当前行数据

```typescript
// 优化后可以直接使用 rowValue
const currentRowData = rowValue; // 包含当前行所有字段的值
```

## 具体修改内容

### 1. 类型定义更新 (`packages/easy-page-core/src/types.ts`)

#### EffectConfig 接口

```typescript
export interface EffectConfig {
	effectedKeys?: string[];
	handler?: (params: {
		store: FormStore;
		rowInfo?: ExtendedRowInfo;
		value: any;
		rowValue: any;
	}) => Promise<
		Record<string, { fieldValue: any; fieldProps: Record<string, any> }>
	>;
}
```

#### ActionConfig 接口

```typescript
export interface ActionConfig {
	effectedBy: string[];
	handler: (params: {
		store: FormStore;
		rowInfo?: ExtendedRowInfo;
		value: any;
		rowValue: any;
	}) => Promise<{ fieldValue: any; fieldProps: Record<string, any> }>;
}
```

### 2. Store 实现更新 (`packages/easy-page-core/src/store.ts`)

#### triggerEffects 方法

- 自动获取当前字段值 (`this.getValue(field)`)
- 自动构建当前行数据 (`rowValue`)
- 传递完整的参数对象给 handler

#### triggerActions 方法

- 同样自动获取字段值和行数据
- 传递完整的参数对象给 handler

### 3. FormItem 组件简化 (`packages/easy-page-core/src/components/FormItem.tsx`)

#### 移除包装逻辑

```typescript
// 优化前需要包装 effects
const wrappedEffects = effects.map((effect) => ({
	...effect,
	handler: effect.handler
		? async (store: FormStore) => {
				return await effect.handler!(store, rowInfo);
		  }
		: undefined,
}));

// 优化后直接注册
store.registerEffects(id, effects);
```

### 4. 使用示例更新 (`apps/pc-demo/src/demos/dynamic-form/CrossRowValidationDemo.tsx`)

#### 优化前的使用方式

```typescript
effects={[
  {
    handler: async (store: FormStore, rowInfo?: ExtendedRowInfo) => {
      if (!rowInfo) return {};

      if (!rowInfo.isLast) {
        const currentThreshold = store.getValue(`${rowInfo.currentRow}_threshold`);
        // ... 处理逻辑
      }
      return {};
    },
  },
]}
```

#### 优化后的使用方式

```typescript
effects={[
  {
    handler: async (params: {
      store: FormStore;
      rowInfo?: ExtendedRowInfo;
      value: any;
      rowValue: any;
    }) => {
      const { rowInfo, value } = params;
      if (!rowInfo) return {};

      if (!rowInfo.isLast) {
        const currentThreshold = value; // 直接使用 value
        // ... 处理逻辑
      }
      return {};
    },
  },
]}
```

## 优化效果

### 1. 代码更简洁

- 不需要手动获取当前字段值
- 不需要手动构建行数据
- 减少了样板代码

### 2. 更易理解

- 参数结构清晰明确
- `value` 直接表示当前字段值
- `rowValue` 直接表示当前行数据

### 3. 更易维护

- 统一的参数结构
- 减少了重复代码
- 降低了出错概率

### 4. 更好的开发体验

- 开发者可以直接使用传入的参数
- 不需要了解内部实现细节
- 代码更加直观

## 向后兼容性

由于这是一个破坏性变更，建议：

1. 更新所有使用 effects 和 actions 的代码
2. 在文档中明确说明新的参数结构
3. 提供迁移指南

## 测试验证

可以通过以下方式验证优化效果：

1. 在浏览器控制台查看 effects handler 的日志输出
2. 验证跨行联动功能是否正常工作
3. 确认所有现有功能没有受到影响

## 总结

这次优化大大简化了 effects 和 actions 的使用方式，使开发者能够更专注于业务逻辑，而不是底层的字段值获取和数据处理。新的参数结构更加直观和易用，提升了整体的开发体验。
