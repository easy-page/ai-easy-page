# 表单全局禁用状态功能使用指南

## 概述

Easy Page 表单框架提供了强大的全局禁用状态管理功能，可以通过 store 控制整个表单的所有字段是否可编辑，支持与外部状态联动，实现复杂的业务场景。

## 核心概念

### 全局禁用状态

- **定义**：控制整个表单所有字段的可编辑状态
- **特点**：一键控制，支持外部状态联动
- **应用场景**：活动状态、权限控制、系统维护等

### 禁用状态优先级

1. **全局禁用**：通过 `store.setDisabled()` 设置
2. **字段处理中**：字段正在执行 effects/actions 时
3. **组件自身禁用**：组件 props 中的 disabled 属性

## API 接口

### FormStore 方法

```typescript
interface FormStore {
	// 设置全局禁用状态
	setDisabled(disabled: boolean): void;

	// 获取全局禁用状态
	isDisabled(): boolean;
}
```

### FormState 状态

```typescript
interface FormState {
	// ... 其他状态
	disabled: boolean; // 全局禁用状态
}
```

## 使用示例

### 基础用法

```tsx
import { createFormStore } from '@easy-page/core';

const store = createFormStore({
	username: '',
	email: '',
	age: 25,
});

// 禁用整个表单
store.setDisabled(true);

// 启用整个表单
store.setDisabled(false);

// 检查表单是否被禁用
const isDisabled = store.isDisabled();
```

### 与外部状态联动

```tsx
import { useExternalStateListener } from '@easy-page/core';

const [activityStatus, setActivityStatus] = useState('active');
const [userPermission, setUserPermission] = useState('admin');

// 监听活动状态变化
useExternalStateListener(store, activityStatus, [
	{
		fields: ['username', 'email', 'age'],
		handler: async (externalState, store) => {
			// 根据活动状态控制表单是否可编辑
			if (externalState === 'maintenance') {
				store.setDisabled(true);
			} else if (externalState === 'active') {
				store.setDisabled(false);
			}

			return {};
		},
	},
]);

// 监听用户权限变化
useExternalStateListener(store, userPermission, [
	{
		fields: ['username', 'email', 'age'],
		handler: async (externalState, store) => {
			// 根据用户权限控制表单是否可编辑
			if (externalState === 'readonly') {
				store.setDisabled(true);
			} else if (externalState === 'admin') {
				store.setDisabled(false);
			}

			return {};
		},
	},
]);
```

### 条件禁用

```tsx
// 根据业务条件禁用表单
useExternalStateListener(store, businessConfig, [
	{
		fields: ['productName', 'price', 'description'],
		handler: async (externalState, store) => {
			const { isApproved, isExpired, userRole } = externalState;

			// 已审批的产品不能修改
			if (isApproved) {
				store.setDisabled(true);
			}
			// 过期的产品不能修改
			else if (isExpired) {
				store.setDisabled(true);
			}
			// 普通用户只能查看
			else if (userRole === 'user') {
				store.setDisabled(true);
			}
			// 管理员可以编辑
			else if (userRole === 'admin') {
				store.setDisabled(false);
			}

			return {};
		},
	},
]);
```

### 动态禁用控制

```tsx
const [formState, setFormState] = useState({
	isSubmitting: false,
	isLocked: false,
	isReadOnly: false,
});

// 监听表单状态变化
useExternalStateListener(store, formState, [
	{
		fields: ['username', 'email', 'age'],
		handler: async (externalState, store) => {
			const { isSubmitting, isLocked, isReadOnly } = externalState;

			// 提交中、锁定状态或只读状态时禁用表单
			if (isSubmitting || isLocked || isReadOnly) {
				store.setDisabled(true);
			} else {
				store.setDisabled(false);
			}

			return {};
		},
	},
]);
```

## 样式定制

### 默认样式

框架提供了默认的禁用状态样式：

```less
.form-item-disabled {
	opacity: 0.5;
	pointer-events: none;

	.form-item-label {
		color: #bfbfbf;
	}

	.form-item-control {
		* {
			background-color: #f5f5f5 !important;
			border-color: #d9d9d9 !important;
			color: #bfbfbf !important;
			cursor: not-allowed !important;
		}
	}
}
```

### 自定义样式

```less
// 自定义禁用状态样式
.form-item-disabled {
	opacity: 0.7;

	.form-item-label {
		color: #999;
		font-style: italic;
	}

	.form-item-control {
		* {
			background-color: #fafafa !important;
			border-color: #e8e8e8 !important;
			color: #999 !important;
		}
	}

	// 添加禁用提示
	&::after {
		content: '表单已禁用';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 12px;
		z-index: 10;
	}
}
```

## 最佳实践

### 1. 合理使用禁用状态

```typescript
// 推荐：根据业务逻辑控制禁用状态
const shouldDisableForm = (businessState) => {
	return (
		businessState.isApproved ||
		businessState.isExpired ||
		businessState.userRole === 'readonly'
	);
};

useExternalStateListener(store, businessState, [
	{
		fields: ['field1', 'field2'],
		handler: async (externalState, store) => {
			store.setDisabled(shouldDisableForm(externalState));
			return {};
		},
	},
]);

// 不推荐：随意设置禁用状态
store.setDisabled(true); // 没有明确的业务逻辑
```

### 2. 提供用户反馈

```tsx
// 推荐：提供禁用原因
const [disableReason, setDisableReason] = useState('');

useExternalStateListener(store, businessState, [
	{
		fields: ['field1', 'field2'],
		handler: async (externalState, store) => {
			if (externalState.isApproved) {
				store.setDisabled(true);
				setDisableReason('表单已审批，不能修改');
			} else if (externalState.isExpired) {
				store.setDisabled(true);
				setDisableReason('表单已过期，不能修改');
			} else {
				store.setDisabled(false);
				setDisableReason('');
			}
			return {};
		},
	},
]);

// 在界面上显示禁用原因
{
	disableReason && (
		<div className="form-disable-reason">
			<Icon type="info-circle" />
			<span>{disableReason}</span>
		</div>
	);
}
```

### 3. 渐进式禁用

```typescript
// 推荐：根据权限逐步禁用
const getDisabledFields = (userRole, businessState) => {
	const disabledFields = [];

	if (userRole === 'user') {
		disabledFields.push('price', 'discount');
	}

	if (businessState.isApproved) {
		disabledFields.push('name', 'description', 'category');
	}

	return disabledFields;
};

// 不推荐：一次性禁用所有字段
store.setDisabled(true);
```

### 4. 状态同步

```typescript
// 推荐：确保状态同步
useEffect(() => {
	// 组件挂载时同步禁用状态
	const syncDisabledState = () => {
		const shouldDisable = checkBusinessRules();
		store.setDisabled(shouldDisable);
	};

	syncDisabledState();
}, [store]);

// 监听外部状态变化
useExternalStateListener(store, externalState, [
	{
		fields: ['field1', 'field2'],
		handler: async (externalState, store) => {
			const shouldDisable = checkBusinessRules(externalState);
			store.setDisabled(shouldDisable);
			return {};
		},
	},
]);
```

## 注意事项

### 1. 性能考虑

- 避免频繁切换禁用状态
- 使用条件函数避免不必要的更新
- 合理使用 React.memo 优化渲染

### 2. 用户体验

- 提供禁用状态的视觉反馈
- 说明禁用原因
- 提供启用表单的方式

### 3. 状态管理

- 确保禁用状态的一致性
- 避免状态冲突
- 正确处理异步操作

### 4. 可访问性

- 确保禁用状态对屏幕阅读器友好
- 提供键盘导航支持
- 符合 WCAG 标准

## 调试技巧

### 1. 状态检查

```typescript
// 检查表单禁用状态
console.log('表单禁用状态:', store.isDisabled());

// 检查字段状态
console.log('字段状态:', store.getFieldState('fieldName'));
```

### 2. 状态监听

```typescript
// 监听禁用状态变化
useEffect(() => {
	const disposer = autorun(() => {
		console.log('禁用状态变化:', store.isDisabled());
	});

	return disposer;
}, [store]);
```

### 3. 样式调试

```css
/* 临时添加调试样式 */
.form-item-disabled {
	border: 2px solid red !important;
}
```

## 总结

全局禁用状态功能为表单提供了强大的控制能力，可以：

1. **简化状态管理**：通过一个方法控制整个表单
2. **支持外部联动**：与业务状态无缝集成
3. **提供良好体验**：清晰的视觉反馈和状态说明
4. **保持灵活性**：支持条件控制和自定义样式

这个功能特别适用于需要根据业务状态动态控制表单编辑权限的场景，如审批流程、权限管理、活动控制等。
