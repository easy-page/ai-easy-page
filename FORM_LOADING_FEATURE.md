# Form 组件 Loading 功能

## 功能概述

为 Form 组件添加了全局 loading 功能，支持自定义 loading 组件，当表单中有请求正在执行时会显示 loading 效果。

## 主要特性

### 1. 自动 Loading 检测

- Form 组件会自动检测是否有请求正在执行
- 通过 `store.isAnyRequestRunning()` 方法检查请求状态
- 使用 `setInterval` 定期检查请求状态（每 100ms）

### 2. 默认 Loading 组件

- 提供美观的默认 loading 效果
- 包含旋转动画和加载文字
- 半透明遮罩层，防止用户操作
- 支持 backdrop-filter 模糊效果

### 3. 自定义 Loading 组件

- 支持传入自定义的 loading 组件
- 支持 ReactNode 或函数式组件
- 完全自定义样式和交互

## API 接口

### FormProps 新增属性

```typescript
interface FormProps {
	// ... 其他属性
	loadingComponent?: ReactNode | (() => ReactNode); // 自定义 loading 组件
}
```

## 使用示例

### 1. 默认 Loading 效果

```tsx
<Form
	mode={FormMode.EDIT}
	initReqs={{
		userDetail: {
			req: async () => {
				const result = await api.getUserDetail();
				return result;
			},
			mode: [FormMode.EDIT],
		},
	}}
>
	{/* 表单内容 */}
</Form>
```

### 2. 自定义 Loading 组件

```tsx
const CustomLoading = () => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(24, 144, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  }}>
    <div>自定义 Loading...</div>
  </div>
);

<Form
  mode={FormMode.EDIT}
  loadingComponent={<CustomLoading />}
  initReqs={{...}}
>
  {/* 表单内容 */}
</Form>
```

### 3. 函数式 Loading 组件

```tsx
<Form
  mode={FormMode.EDIT}
  loadingComponent={() => (
    <div style={{...}}>
      函数式 Loading...
    </div>
  )}
  initReqs={{...}}
>
  {/* 表单内容 */}
</Form>
```

## 样式定制

### 默认 Loading 样式

```less
.easy-form {
	&.easy-form-requesting {
		pointer-events: none;

		.easy-form-loading-overlay {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(255, 255, 255, 0.9);
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1000;
			backdrop-filter: blur(2px);

			.easy-form-loading-spinner {
				padding: 24px 32px;
				background: rgba(0, 0, 0, 0.8);
				color: white;
				border-radius: 8px;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 12px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

				.easy-form-loading-icon {
					width: 32px;
					height: 32px;
					border: 3px solid rgba(255, 255, 255, 0.3);
					border-top: 3px solid #1890ff;
					border-radius: 50%;
					animation: spin 1s linear infinite;
				}

				.easy-form-loading-text {
					font-size: 14px;
					font-weight: 500;
				}
			}
		}
	}
}
```

## 触发条件

Loading 效果会在以下情况下显示：

1. **初始化请求**：表单加载时执行 `initReqs` 中的请求
2. **字段请求**：字段值变化时触发的 `req.handler` 请求
3. **联动请求**：依赖字段变化时触发的请求
4. **并发请求**：多个请求同时执行时

## 技术实现

### 1. 请求状态管理

- 使用 `RequestScheduler` 管理所有请求
- 通过 `isRunning()` 方法检查是否有请求在执行
- 支持最大并发数控制

### 2. 状态同步

- Form 组件通过 `useEffect` 监听请求状态
- 使用 `setInterval` 定期检查状态变化
- 通过 `store.setRequesting()` 更新全局状态

### 3. 组件渲染

- 根据 `store.state.requesting` 决定是否显示 loading
- 支持自定义组件和默认组件的切换
- 使用绝对定位覆盖整个表单区域

## 最佳实践

1. **合理设置延迟时间**：在开发时设置较长的延迟时间以便观察 loading 效果
2. **自定义样式**：根据项目设计风格自定义 loading 组件
3. **用户体验**：提供清晰的加载提示文字
4. **性能优化**：避免过于频繁的状态检查

## 测试方法

1. 访问 "Loading 测试" demo 页面
2. 观察页面加载时的 loading 效果
3. 测试联动请求的 loading 效果
4. 对比默认和自定义 loading 的差异
