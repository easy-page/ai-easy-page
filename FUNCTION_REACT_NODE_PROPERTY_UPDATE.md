# FunctionReactNodeProperty 类型调整总结

## 概述

本次调整主要是为了更准确地区分函数属性和函数组件属性，将之前错误归类为 `FunctionProperty` 的组件函数属性调整为 `FunctionReactNodeProperty` 类型。

## 调整内容

### 1. 类型定义

在 `apps/website/src/pages/PlaygroundPage/Schema/specialProperties.ts` 中已经定义了三种特殊属性类型：

```typescript
// 普通函数属性 - 用于事件处理函数等
export type FunctionProperty = {
	type: 'function';
	content: string; // 函数内容
};

// React节点属性 - 用于JSX内容
export type ReactNodeProperty = {
	type: 'reactNode';
	content: string; // 节点内容
};

// 函数组件属性 - 用于返回React组件的函数
export type FunctionReactNodeProperty = {
	type: 'functionReactNode';
	content: string; // 节点内容
};
```

### 2. Schema 调整

#### DynamicForm 组件

- **文件**: `apps/website/src/pages/PlaygroundPage/Schema/componentSchemas/dynamicForm.ts`
- **调整**: `customContainer` 属性从 `FunctionProperty` 改为 `FunctionReactNodeProperty`
- **原因**: `customContainer` 返回的是一个 React 组件函数，不是普通的事件处理函数

#### Container 组件

- **文件**: `apps/website/src/pages/PlaygroundPage/Schema/componentSchemas/container.ts`
- **调整**: `customContainer` 属性从 `FunctionProperty` 改为 `FunctionReactNodeProperty`
- **原因**: `customContainer` 返回的是一个 React 组件函数，用于自定义容器渲染

### 3. Engine 处理逻辑调整

#### 新增处理函数

- **文件**: `apps/website/src/pages/PlaygroundPage/Engine/index.tsx`
- **新增**: `processFunctionReactNodeProperty` 函数
- **功能**: 将 `FunctionReactNodeProperty` 转换为实际的 React 组件函数

#### 更新属性处理逻辑

- 在 `processComponentProps` 函数中添加了对 `functionReactNode` 类型的处理
- 确保函数组件属性能够正确解析和渲染

### 4. 配置面板调整

#### Container 配置面板

- **文件**: `apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel/components/ContainerConfigPanel.tsx`
- **调整**:
  - `customContainer` 的类型从 `'function'` 改为 `'functionReactNode'`
  - MonacoEditor 语言从 `typescript` 改为 `jsx`

#### DynamicForm 配置面板

- **文件**: `apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel/components/DynamicFormConfigPanel.tsx`
- **调整**:
  - `customContainer` 的类型从 `'function'` 改为 `'functionReactNode'`
  - MonacoEditor 语言从 `typescript` 改为 `jsx`

### 5. 类型导入更新

更新了以下文件的类型导入：

- `apps/website/src/pages/PlaygroundPage/Schema/componentSchemas/types.ts`
- `apps/website/src/pages/PlaygroundPage/Engine/index.tsx`

## 使用场景区分

### FunctionProperty

用于普通的事件处理函数，如：

- `onSubmit` - 表单提交处理
- `onChange` - 值变化处理
- `onBlur` - 失焦处理
- `onFocus` - 聚焦处理
- `validator` - 验证函数
- `transform` - 转换函数

### FunctionReactNodeProperty

用于返回 React 组件的函数，如：

- `customContainer` - 自定义容器渲染函数
- 其他需要返回 JSX 的函数组件

### ReactNodeProperty

用于直接的 JSX 内容，如：

- `title` - 标题内容
- `extra` - 额外内容
- `tips` - 提示内容
- `headers` - 表头内容

## 配置示例

### Container 自定义容器

```jsx
// 在配置面板中
{
  type: 'functionReactNode',
  content: `({ children }) => (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px'
    }}>
      {children}
    </div>
  )`
}
```

### DynamicForm 自定义容器

```jsx
// 在配置面板中
{
  type: 'functionReactNode',
  content: `({ onAdd, onDelete, value, canAdd, canDelete, renderFields }) => (
    <div>
      {value.map((_, index) => (
        <div key={index}>
          <div style={{ display: 'flex', gap: '16px' }}>
            {renderFields(index, <div style={{ flex: 1 }} />)}
          </div>
        </div>
      ))}
    </div>
  )`
}
```

## 向后兼容性

- ✅ 保持了现有 API 的兼容性
- ✅ 新属性都有默认值，不会破坏现有代码
- ✅ 类型定义更加严格，但提供了合理的默认值
- ✅ 配置面板会自动处理新旧类型的转换

## 总结

本次调整使得类型定义更加准确，能够更好地区分不同类型的函数属性，提高了代码的类型安全性和可维护性。同时，配置面板也相应地进行了调整，为用户提供了更好的编辑体验。
