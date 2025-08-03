# getRowValues 方法实现总结

## 已完成的工作

### 1. 类型定义更新

在 `packages/easy-page-core/src/types.ts` 中：

- ✅ 更新了 `ValidationRule` 接口中的 `validator` 参数结构
- ✅ 更新了 `ExtendedRowInfo` 接口，添加了 `getRowValues` 方法定义
- ✅ 更新了 `Validator` 接口中的 `validate` 方法签名

### 2. 核心实现

在 `packages/easy-page-core/src/components/DynamicForm.tsx` 中：

- ✅ 在 `createRowInfo` 函数中实现了 `getRowValues` 方法
- ✅ 支持相对行索引（正数、负数、0）
- ✅ 支持获取特定字段值或整行数据
- ✅ 包含边界检查逻辑

### 3. 验证器优化

在 `packages/easy-page-core/src/validator.ts` 中：

- ✅ 更新了验证器调用逻辑，使用新的参数结构
- ✅ 简化了 `rowValues` 获取逻辑，使用 `getRowValues` 方法

### 4. Store 优化

在 `packages/easy-page-core/src/store.ts` 中：

- ✅ 更新了 effects 处理逻辑，使用 `getRowValues` 方法
- ✅ 更新了 actions 处理逻辑，使用 `getRowValues` 方法

### 5. 示例代码更新

在 `apps/pc-demo/src/demos/dynamic-form/CrossRowValidationDemo.tsx` 中：

- ✅ 更新了验证器使用新的参数结构
- ✅ 使用 `getRowValues` 方法简化了跨行数据获取
- ✅ 展示了新的使用方式

在 `apps/pc-demo/src/demos/LinkageValidationDemo.tsx` 中：

- ✅ 更新了验证器使用新的参数结构

在 `apps/pc-demo/src/demos/ExternalStateDemo.tsx` 中：

- ✅ 更新了验证器使用新的参数结构

在 `apps/pc-demo/src/demos/FieldFeaturesDemo.tsx` 中：

- ✅ 更新了验证器使用新的参数结构

在 `apps/pc-demo/src/demos/dynamic-form/SubsidyTierDemo.tsx` 中：

- ✅ 更新了验证器使用新的参数结构
- ✅ 更新了 effects 处理器使用新的参数结构
- ✅ 使用 `getRowValues` 方法简化了数据获取

在 `apps/pc-demo/src/demos/dynamic-form/SubsidyTierTableDemo.tsx` 中：

- ✅ 更新了 effects 处理器使用新的参数结构
- ✅ 使用 `getRowValues` 方法简化了数据获取

## 新功能特性

### getRowValues 方法功能

```typescript
getRowValues(index?: number, key?: string): any
```

**参数说明：**

- `index?: number` - 目标行索引
  - `undefined` 或 `0`: 获取当前行
  - `> 0`: 获取下面的行（如 `2` 表示下面第 2 行）
  - `< 0`: 获取上面的行（如 `-1` 表示上面第 1 行）
- `key?: string` - 可选，指定要获取的字段名

**使用示例：**

```typescript
// 获取当前行的所有值
const currentRowValues = rowInfo.getRowValues();

// 获取当前行的特定字段值
const threshold = rowInfo.getRowValues(0, 'threshold');

// 获取上一行的特定字段值
const prevSubsidy = rowInfo.getRowValues(-1, 'maxSubsidy');

// 获取下一行的所有值
const nextRowValues = rowInfo.getRowValues(1);
```

## 优化效果

### 1. 代码简化

**优化前：**

```typescript
const currentRow = rowInfo.currentRow;
const thresholdField = `${currentRow}_threshold`;
const threshold = store.getValue(thresholdField);
```

**优化后：**

```typescript
const threshold = rowInfo.getRowValues(0, 'threshold');
```

### 2. 跨行数据获取简化

**优化前：**

```typescript
const prevRow = currentRow - 1;
const prevSubsidyField = `${prevRow}_maxSubsidy`;
const prevSubsidy = store.getValue(prevSubsidyField);
```

**优化后：**

```typescript
const prevSubsidy = rowInfo.getRowValues(-1, 'maxSubsidy');
```

### 3. 参数结构统一

**优化前：**

```typescript
validator: async (value: any, store: FormStore, rowInfo?: ExtendedRowInfo) => {
	// 需要手动获取当前行数据
};
```

**优化后：**

```typescript
validator: async (params: {
	value: any;
	store: FormStore;
	rowInfo?: ExtendedRowInfo;
	rowValues: any;
}) => {
	// 直接使用 params.rowValues 或 rowInfo.getRowValues()
};
```

## 待完成的工作

### 1. FieldLinkageDemo.tsx 修复

该文件中还有多个 effects 和 actions 处理器需要更新参数结构：

- 省份字段的 effects 和 actions
- 城市字段的 effects 和 actions
- 区县字段的 effects 和 actions
- 产品相关字段的 effects 和 actions

### 2. 构建验证

需要确保所有文件都正确更新后，重新运行构建验证。

## 使用指南

详细的使用指南请参考 `GET_ROW_VALUES_USAGE.md` 文件。

## 总结

通过这次优化，我们：

1. ✅ 统一了验证器的参数结构
2. ✅ 添加了便捷的 `getRowValues` 工具方法
3. ✅ 简化了跨行数据获取的代码
4. ✅ 提高了代码的可读性和维护性
5. ✅ 减少了手动拼接字段名的错误风险

新的 `getRowValues` 方法为动态表单的跨行数据操作提供了强大而简洁的工具，大大提升了开发体验。
