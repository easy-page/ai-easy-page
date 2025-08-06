# ReactNodeProperty 类型简化调整总结

## 概述

为了简化复杂度，将 `ReactNodeProperty` 类型定义进行了调整，移除了对 `ComponentSchema` 的直接支持，改为通过 `useSchema` 和 `schema` 属性来支持组件配置。

## 类型定义变化

### 修改前

```typescript
export type ReactNodeProperty =
	| {
			type: 'reactNode';
			content: string;
	  }
	| ComponentSchema; // 直接支持 ComponentSchema
```

### 修改后

```typescript
export type ReactNodeProperty = {
	type: 'reactNode';
	content?: string; // 节点内容
	useSchema?: boolean;
	schema?: ComponentSchema;
};
```

## 主要调整内容

### 1. Engine 处理逻辑调整

**文件**: `apps/website/src/pages/PlaygroundPage/Engine/index.tsx`

- 移除了对 `ComponentSchema` 类型的直接处理
- 添加了对 `useSchema` 和 `schema` 属性的支持
- 当 `useSchema` 为 `true` 且有 `schema` 时，使用 `renderComponent` 渲染组件

```typescript
// 处理ReactNode属性，将ReactNodeProperty转换为React节点
const processReactNodeProperty = (
	nodeProp: ReactNodeProperty | undefined,
	jsxParser: JSXParser,
	renderComponent?: (schema: ComponentSchema, key?: string) => React.ReactNode
): React.ReactNode => {
	if (!nodeProp) {
		return undefined;
	}

	// 处理字符串类型的 ReactNodeProperty
	if (nodeProp.type === 'reactNode' && 'content' in nodeProp) {
		// 使用 JSX 解析器处理字符串内容
		// ...
	}

	// 如果 useSchema 为 true 且有 schema，使用 schema 渲染
	if (nodeProp.useSchema && nodeProp.schema && renderComponent) {
		return renderComponent(nodeProp.schema);
	}

	return undefined;
};
```

### 2. NodeTree 组件调整

**文件**: `apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/NodeTree.tsx`

#### 类型检查函数调整

- 简化了 `isReactNodeProperty` 函数，只检查 `type: 'reactNode'` 的情况
- 移除了对 `ComponentSchema` 类型的直接支持

#### 树节点构建调整

- 更新了 `buildReactNodeTree` 函数，只处理 `ReactNodeProperty` 类型
- 为有 `schema` 的节点添加了特殊标识
- 在 `buildComponentPropertiesTree` 中添加了对 `ComponentSchema` 类型的单独处理

```typescript
// 检查值是否为ReactNodeProperty
const isReactNodeProperty = (value: any): value is ReactNodeProperty => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	// 检查是否有 type 属性
	if (!('type' in value)) {
		return false;
	}

	// 如果是 { type: 'reactNode', content: string }
	if (value.type === 'reactNode' && 'content' in value) {
		return true;
	}

	return false;
};
```

### 3. ReactNodeConfigPanel 组件调整

**文件**: `apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel/components/ReactNodeConfigPanel.tsx`

- 将配置类型从 `'jsx' | 'component'` 改为 `'jsx' | 'schema'`
- 更新了配置逻辑，当选择组件配置时，创建包含 `useSchema: true` 和 `schema` 的 `ReactNodeProperty`
- 更新了渲染函数名称和逻辑

```typescript
const handleTypeChange = (type: 'jsx' | 'schema') => {
	setConfigType(type);
	if (type === 'jsx') {
		onChange?.({
			type: 'reactNode',
			content: '',
		});
	} else {
		onChange?.({
			type: 'reactNode',
			useSchema: true,
			schema: {
				type: 'Input',
				props: {},
			} as ComponentSchema,
		});
	}
};
```

### 4. NodeConfigPanel 调整

**文件**: `apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel/index.tsx`

- 更新了 `renderPropertyConfig` 函数，添加了对 `useSchema` 和 `schema` 的处理
- 更新了 `renderReactNodeConfig` 函数，支持显示 schema 配置信息

```typescript
// 如果 useSchema 为 true 且有 schema
if (reactNodeProp.useSchema && reactNodeProp.schema) {
	const componentSchema = reactNodeProp.schema;
	// 显示组件配置信息
}
```

## 使用场景

### 1. 字符串类型的 ReactNodeProperty

适用于简单的 JSX 内容：

```typescript
{
  type: 'reactNode',
  content: '<div>简单文本</div>'
}
```

### 2. 带 Schema 的 ReactNodeProperty

适用于复杂的组件配置：

```typescript
{
  type: 'reactNode',
  useSchema: true,
  schema: {
    type: 'Input',
    props: {
      placeholder: '请输入内容',
      disabled: false
    }
  }
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

// Schema 模式
{
  type: 'reactNode',
  useSchema: true,
  schema: {
    type: 'Typography',
    props: {
      level: 2,
      children: '容器标题'
    }
  }
}
```

### DynamicForm 组件的 headers 属性

```typescript
// 字符串模式
{
  type: 'reactNode',
  content: '<th>表头</th>'
}

// Schema 模式
{
  type: 'reactNode',
  useSchema: true,
  schema: {
    type: 'Typography',
    props: {
      children: '表头'
    }
  }
}
```

## 优势

1. **类型安全**: 明确的类型定义，避免了联合类型带来的复杂性
2. **向后兼容**: 现有的字符串类型配置仍然有效
3. **扩展性**: 通过 `useSchema` 和 `schema` 属性支持更复杂的组件配置
4. **清晰性**: 配置意图更加明确，易于理解和维护

## 注意事项

1. 现有的配置面板会自动处理新的类型结构
2. Engine 会自动识别并正确处理两种配置模式
3. 组件树会正确显示不同类型的节点
4. 配置面板提供了直观的切换方式

这次调整大大简化了类型系统的复杂度，同时保持了功能的完整性和扩展性。
