# ReactNodeProperty 类型优化总结

## 概述

本次优化主要是为了扩展 `ReactNodeProperty` 类型，使其不仅支持字符串类型的 JSX 内容，还支持 `ComponentSchema` 类型，从而提供更灵活的配置选项。

## 主要改进

### 1. 类型定义优化

#### 修改前

```typescript
export type ReactNodeProperty = {
	type: 'reactNode';
	content: string; // 节点内容
};
```

#### 修改后

```typescript
export type ReactNodeProperty =
	| {
			type: 'reactNode';
			content: string; // 节点内容
	  }
	| ComponentSchema; // 支持 ComponentSchema 类型
```

### 2. Engine 处理逻辑优化

#### 更新 processReactNodeProperty 函数

- 添加了对 `ComponentSchema` 类型的支持
- 增加了 `renderComponent` 参数，用于递归渲染组件
- 改进了类型检查逻辑

```typescript
const processReactNodeProperty = (
	nodeProp: ReactNodeProperty | undefined,
	jsxParser: JSXParser,
	renderComponent?: (schema: ComponentSchema, key?: string) => React.ReactNode
): React.ReactNode => {
	if (!nodeProp) {
		return undefined;
	}

	// 如果是 ComponentSchema 类型，直接渲染组件
	if (nodeProp.type && nodeProp.type !== 'reactNode') {
		if (renderComponent) {
			return renderComponent(nodeProp as ComponentSchema);
		}
		return undefined;
	}

	// 处理字符串类型的 ReactNodeProperty
	if (nodeProp.type === 'reactNode' && 'content' in nodeProp) {
		// 使用 JSX 解析器处理字符串内容
		// ...
	}

	return undefined;
};
```

#### 更新 processComponentProps 函数

- 传递 `renderComponent` 参数给 `processReactNodeProperty`
- 确保递归渲染能够正常工作

### 3. 配置面板优化

#### 新增 ReactNodeConfigPanel 组件

创建了专门的配置面板组件，支持两种配置模式：

1. **JSX 内容模式**：直接编辑 JSX 字符串
2. **组件配置模式**：选择组件类型并配置属性

```typescript
interface ReactNodeConfigPanelProps {
	value?: ReactNodeProperty;
	onChange?: (value: ReactNodeProperty) => void;
	label?: string;
	placeholder?: string;
}
```

#### 更新现有配置面板

- **ContainerConfigPanel**：使用 `ReactNodeConfigPanel` 处理 `title` 属性
- **FormConfigPanel**：使用 `ReactNodeConfigPanel` 处理 `loadingComponent` 属性
- **FormItemConfigPanel**：使用 `ReactNodeConfigPanel` 处理 `tips` 和 `extra` 属性
- **DynamicFormConfigPanel**：使用 `ReactNodeConfigPanel` 处理 `headers` 和 `fields` 属性

### 4. 组件树展示优化

#### 更新 NodeTree 组件

- 添加了 `buildReactNodeTree` 函数，递归处理 `ReactNodeProperty`
- 支持在组件树中显示 `ComponentSchema` 类型的节点
- 为不同类型的节点提供不同的图标和操作按钮

```typescript
const buildReactNodeTree = (
	nodeProp: ReactNodeProperty,
	parentKey: string,
	index: number
): TreeNode => {
	// 如果是 ComponentSchema 类型
	if (nodeProp.type && nodeProp.type !== 'reactNode') {
		// 显示组件节点，支持添加/删除操作
	}

	// 如果是字符串类型的 ReactNodeProperty
	if (nodeProp.type === 'reactNode' && 'content' in nodeProp) {
		// 显示 JSX 内容节点
	}
};
```

## 使用场景

### 1. 字符串类型的 ReactNodeProperty

适用于简单的 JSX 内容，如：

```typescript
{
	type: 'reactNode',
	content: '<div>简单文本</div>'
}
```

### 2. ComponentSchema 类型的 ReactNodeProperty

适用于复杂的组件配置，如：

```typescript
{
	type: 'Input',
	props: {
		placeholder: '请输入内容',
		disabled: false
	},
	children: [
		{
			type: 'Button',
			props: {
				children: '按钮'
			}
		}
	]
}
```

## 配置示例

### Container 组件的 title 属性

```typescript
// 字符串模式
{
	type: 'reactNode',
	content: '<h2>容器标题</h2>'
}

// 组件模式
{
	type: 'Typography',
	props: {
		level: 2,
		children: '容器标题'
	}
}
```

### DynamicForm 组件的 headers 属性

```typescript
[
	{
		type: 'reactNode',
		content: '<th>姓名</th>',
	},
	{
		type: 'Typography',
		props: {
			strong: true,
			children: '年龄',
		},
	},
];
```

## 优势

1. **灵活性**：支持字符串和组件两种配置方式
2. **可扩展性**：可以嵌套任意深度的组件结构
3. **可视化**：在组件树中清晰显示不同类型的节点
4. **易用性**：提供直观的配置界面，支持切换配置模式
5. **类型安全**：保持完整的 TypeScript 类型支持

## 向后兼容性

- ✅ 保持了现有 API 的兼容性
- ✅ 现有的字符串类型 `ReactNodeProperty` 仍然有效
- ✅ 新功能是可选的，不会破坏现有代码
- ✅ 提供了合理的默认值和类型检查

## 总结

本次优化显著提升了 `ReactNodeProperty` 类型的灵活性和功能性，使其能够支持更复杂的组件配置需求。通过引入 `ComponentSchema` 支持，我们实现了对嵌套组件结构的统一处理，同时保持了良好的用户体验和类型安全性。
