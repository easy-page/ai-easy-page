# getRowValues 方法使用指南

## 概述

`getRowValues` 是 `ExtendedRowInfo` 中的一个新增工具方法，用于简化跨行数据获取操作。

## 方法签名

```typescript
getRowValues(index?: number, key?: string): any
```

## 参数说明

- `index?: number` - 目标行索引
  - `undefined` 或 `0`: 获取当前行
  - `> 0`: 获取下面的行（如 `2` 表示下面第 2 行）
  - `< 0`: 获取上面的行（如 `-1` 表示上面第 1 行）
- `key?: string` - 可选，指定要获取的字段名
  - 如果提供：返回该字段的值
  - 如果不提供：返回整行的所有字段值

## 使用示例

### 1. 获取当前行的所有值

```typescript
// 获取当前行的所有字段值
const currentRowValues = rowInfo.getRowValues();
// 或者
const currentRowValues = rowInfo.getRowValues(0);
```

### 2. 获取当前行特定字段的值

```typescript
// 获取当前行的 threshold 字段值
const threshold = rowInfo.getRowValues(0, 'threshold');
// 或者简写
const threshold = rowInfo.getRowValues(undefined, 'threshold');
```

### 3. 获取上一行的值

```typescript
// 获取上一行的所有值
const prevRowValues = rowInfo.getRowValues(-1);

// 获取上一行的特定字段值
const prevSubsidy = rowInfo.getRowValues(-1, 'maxSubsidy');
```

### 4. 获取下一行的值

```typescript
// 获取下一行的所有值
const nextRowValues = rowInfo.getRowValues(1);

// 获取下一行的特定字段值
const nextThreshold = rowInfo.getRowValues(1, 'threshold');
```

### 5. 获取指定行的值

```typescript
// 获取下面第2行的所有值
const row2Values = rowInfo.getRowValues(2);

// 获取上面第2行的特定字段值
const rowMinus2Value = rowInfo.getRowValues(-2, 'maxSubsidy');
```

## 在验证器中的使用

### 优化前的代码

```typescript
validator: async (params: {
	value: any;
	store: FormStore;
	rowInfo?: ExtendedRowInfo;
	rowValues: any;
}) => {
	const { value, rowInfo, store } = params;

	// 获取上一行的补贴要求
	const prevRow = rowInfo.currentRow - 1;
	const prevSubsidyField = `${prevRow}_maxSubsidy`;
	const prevSubsidy = store.getValue(prevSubsidyField);

	// 验证逻辑...
};
```

### 优化后的代码

```typescript
validator: async (params: {
	value: any;
	store: FormStore;
	rowInfo?: ExtendedRowInfo;
	rowValues: any;
}) => {
	const { value, rowInfo } = params;

	// 使用新的 getRowValues 方法
	const prevSubsidy = rowInfo.getRowValues(-1, 'maxSubsidy');

	// 验证逻辑...
};
```

## 在 Effects 和 Actions 中的使用

### 获取当前行数据

```typescript
handler: async (params: {
	store: FormStore;
	rowInfo?: ExtendedRowInfo;
	value: any;
	rowValue: any;
}) => {
	const { rowInfo } = params;

	// 获取当前行的所有值
	const currentRowData = rowInfo.getRowValues();

	// 获取当前行的特定字段
	const threshold = rowInfo.getRowValues(0, 'threshold');

	// 处理逻辑...
};
```

### 跨行数据获取

```typescript
handler: async (params: {
	store: FormStore;
	rowInfo?: ExtendedRowInfo;
	value: any;
	rowValue: any;
}) => {
	const { rowInfo } = params;

	// 获取上一行的数据
	const prevRowData = rowInfo.getRowValues(-1);

	// 获取下一行的特定字段
	const nextRowThreshold = rowInfo.getRowValues(1, 'threshold');

	// 处理逻辑...
};
```

## 边界情况处理

- 如果请求的行索引超出范围（小于 0 或大于等于总行数），方法会返回：
  - 如果指定了 `key`：返回 `undefined`
  - 如果没有指定 `key`：返回空对象 `{}`

## 优势

1. **简化代码**：不需要手动计算行索引和字段名
2. **提高可读性**：代码意图更加清晰
3. **减少错误**：避免手动拼接字段名时的错误
4. **统一接口**：所有跨行数据获取都使用同一个方法
5. **类型安全**：TypeScript 类型支持更好
