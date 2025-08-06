# Schema 映射和配置面板优化总结

## 概述

本次优化主要针对 DynamicForm 组件的 Schema 映射和配置面板进行了全面改进，同时检查并优化了其他组件的属性定义。

## 主要优化内容

### 1. DynamicForm 组件优化

#### Schema 映射优化

- ✅ 添加了 `customContainer` 属性，类型为 `FunctionProperty`
- ✅ 将 `headers` 属性从 `any[]` 改为 `ReactNodeProperty[]`
- ✅ 将 `gridColumns` 属性从 `number[]` 改为 `string`（更符合用户输入习惯）
- ✅ 优化了 `rows` 属性的类型定义，从 `any[]` 改为具体的结构类型

#### 配置面板优化

- ✅ 添加了自定义容器编辑器（MonacoEditor）
- ✅ 添加了网格表格模式下的表头编辑器
- ✅ 支持动态添加/删除表头
- ✅ 添加了网格列配置输入框
- ✅ 改进了用户界面，提供更好的编辑体验

### 2. Container 组件优化

#### Schema 映射优化

- ✅ 将 `title` 属性从 `string` 改为 `ReactNodeProperty`
- ✅ 添加了 `containerType` 属性（'Card' | 'Bordered'）
- ✅ 添加了 `customContainer` 属性，类型为 `FunctionProperty`

#### 配置面板优化

- ✅ 将标题输入改为 MonacoEditor，支持 JSX 内容
- ✅ 添加了容器类型选择器
- ✅ 添加了自定义容器编辑器

### 3. 日期时间组件优化

#### DatePicker 组件

- ✅ 添加了 `allowClear` 属性支持

#### DateRangePicker 组件

- ✅ 添加了 `allowClear` 属性支持

#### TimePicker 组件

- ✅ 添加了 `allowClear` 属性支持

### 4. TextArea 组件优化

- ✅ 添加了 `autoSize` 属性支持

### 5. RadioGroup 组件优化

- ✅ 添加了 `optionType` 属性支持（'default' | 'button'）

### 6. 类型定义优化

- ✅ 将所有 `any` 类型替换为具体的类型定义
- ✅ 优化了 options 数组的类型定义，添加了 `disabled` 属性支持
- ✅ 统一了函数属性和 React 节点属性的处理方式

## 特殊属性类型

### FunctionProperty

用于表示函数类型的属性：

```typescript
export type FunctionProperty = {
	type: 'function';
	content: string; // 函数内容
};
```

### ReactNodeProperty

用于表示 React 节点类型的属性：

```typescript
export type ReactNodeProperty = {
	type: 'reactNode';
	content: string; // 节点内容
};
```

## 配置面板改进

### MonacoEditor 集成

- ✅ 为复杂属性（函数、JSX）提供了 MonacoEditor 支持
- ✅ 支持语法高亮和代码提示
- ✅ 提供了合适的占位符和默认值

### 动态表单配置

- ✅ 支持条件显示（如 grid-table 模式下的特殊配置）
- ✅ 支持动态添加/删除配置项
- ✅ 提供了直观的用户界面

## 向后兼容性

- ✅ 保持了现有 API 的兼容性
- ✅ 新属性都有默认值，不会破坏现有代码
- ✅ 类型定义更加严格，但提供了合理的默认值

## 总结

本次优化显著提升了 DynamicForm 组件的可用性和配置灵活性，同时完善了其他组件的属性定义。通过引入 FunctionProperty 和 ReactNodeProperty 类型，我们实现了对函数和 React 节点属性的统一处理，避免了使用 `any` 类型，提高了代码的类型安全性。
