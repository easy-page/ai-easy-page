# 组件属性优化总结

## 优化目标

消除 `getDefaultComponentProps` 和 `getDefaultComponentPropsSchema` 两个函数的重复，统一使用 Schema 版本。

## 优化内容

### 1. 删除重复函数

- 删除了 `ComponentTypes.ts` 中的 `getDefaultComponentProps` 函数
- 统一使用 `getDefaultComponentPropsSchema` 函数

### 2. 更新导入和使用

- 修改 `FormMode/index.tsx` 中的导入和使用
- 修改 `ComponentConfigPanel.tsx` 中的导入
- 统一使用 `getDefaultComponentPropsSchema(componentType).properties` 获取组件属性

### 3. 更新默认属性值

确保所有组件的默认属性与之前 `getDefaultComponentProps` 中的值保持一致：

#### Select 组件

```typescript
options: [
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' },
],
allowClear: true,
showSearch: false,
```

#### CheckboxGroup 组件

```typescript
options: [
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' },
],
```

#### RadioGroup 组件

```typescript
options: [
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' },
],
optionType: 'default',
```

#### Container 组件

```typescript
title: { type: 'reactNode', content: '容器' },
titleType: 'h2',
layout: 'vertical',
containerType: 'Card',
collapsible: false,
defaultCollapsed: false,
```

### 4. 保持一致的组件

以下组件的默认属性已经正确，无需修改：

- Input: `type: 'text', allowClear: true`
- TextArea: `rows: 4, showCount: false`
- DatePicker: `format: 'YYYY-MM-DD', allowClear: true`
- DateRangePicker: `format: 'YYYY-MM-DD', allowClear: true`
- TimePicker: `format: 'HH:mm:ss', allowClear: true`
- DynamicForm: 包含完整的默认配置
- Custom: 包含默认的组件代码

## 优化效果

### 1. 代码简化

- 消除了约 100 行重复代码
- 统一了数据结构，所有组件属性都使用 Schema 格式

### 2. 维护性提升

- 只需要维护一套默认属性配置
- 减少了代码不一致的风险

### 3. 类型安全

- Schema 版本提供了更好的类型检查
- 统一的数据结构便于类型推导

## 使用方式

### 获取组件默认属性

```typescript
// 获取完整的 Schema 结构
const schema = getDefaultComponentPropsSchema(ComponentType.SELECT);

// 获取纯属性对象
const props = getDefaultComponentPropsSchema(ComponentType.SELECT).properties;
```

### 在组件配置中使用

```typescript
const newComponent = {
	type: componentType,
	props: getDefaultComponentPropsSchema(componentType).properties as Record<
		string,
		any
	>,
	// ...
};
```

## 注意事项

1. 所有新组件都应该使用 `getDefaultComponentPropsSchema` 函数
2. 如果需要纯属性对象，使用 `.properties` 属性
3. 确保默认属性值与组件实际需求保持一致
