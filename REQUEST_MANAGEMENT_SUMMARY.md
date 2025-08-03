# 统一表单请求管理功能实现总结

## 功能概述

我们实现了完整的表单请求管理功能，包括：

1. **字段级请求管理** - 支持单个字段的数据请求
2. **表单上下文请求管理** - 支持表单级别的初始化请求
3. **并发请求控制** - 限制同时进行的请求数量
4. **全局和字段级 loading 状态** - 提供完整的 loading 反馈
5. **请求依赖管理** - 支持请求间的依赖关系
6. **表单模式支持** - 根据创建、编辑、查看模式执行不同请求

## 核心特性

### 1. FormMode 枚举

```typescript
export enum FormMode {
	CREATE = 'create',
	EDIT = 'edit',
	VIEW = 'view',
}
```

### 2. 字段请求配置

```typescript
interface FieldRequestConfig {
	effectedBy?: string[]; // 依赖的字段列表
	handler: (params: {
		store: FormStore;
		rowInfo?: ExtendedRowInfo;
		rowValues?: any;
		keyword?: string;
		value: any;
	}) => Promise<{
		success: boolean;
		data: any;
		error?: string;
	}>;
}
```

### 3. 表单上下文请求配置

```typescript
interface FormContextRequestConfig {
	req: (params: { store: FormStore; effectedData?: any }) => Promise<{
		success: boolean;
		data: any;
		error?: string;
	}>;
	mode?: FormMode[]; // 在哪些模式下执行请求
	depends?: string[]; // 依赖的其他请求
}
```

## 使用方式

### 1. 字段级请求

```tsx
<FormItem
	id="city"
	label="城市"
	req={{
		effectedBy: ['province'],
		handler: async ({ store, value }) => {
			const provinceId = store.getValue('province');
			const result = await api.getCities(provinceId);
			return result;
		},
	}}
>
	<Select options={[]} placeholder="请选择城市" />
</FormItem>
```

### 2. 表单上下文请求

```tsx
<Form
	mode={FormMode.EDIT}
	initReqs={{
		userDetail: {
			req: async ({ store }) => {
				const result = await api.getUserDetail('123');
				return result;
			},
			mode: [FormMode.EDIT, FormMode.VIEW],
		},
		systemConfig: {
			req: async ({ store }) => {
				const result = await api.getSystemConfig();
				return result;
			},
			mode: [FormMode.CREATE, FormMode.EDIT],
			depends: ['userDetail'], // 依赖 userDetail 请求
		},
	}}
>
	{/* 表单内容 */}
</Form>
```

### 3. 使用 Hook 获取请求数据

```tsx
import { useFieldRequest, useContextRequest } from 'easy-page-core';

const MyComponent = () => {
	// 获取字段请求数据
	const { data: cityData, loading: cityLoading } = useFieldRequest('city');

	// 获取上下文请求数据
	const { data: userData, loading: userLoading } =
		useContextRequest('userDetail');

	return (
		<div>{cityLoading ? '加载中...' : cityData?.map((item) => item.name)}</div>
	);
};
```

## 核心实现

### 1. 请求调度器 (RequestScheduler)

- 控制并发请求数量（默认 5 个）
- 队列管理，超出并发限制的请求会排队等待
- 提供状态查询方法

### 2. 独立的依赖管理

- `fieldDependencies` - 验证依赖关系
- `fieldRequestDependencies` - 请求依赖关系
- 避免不同类型的依赖关系混淆

### 3. 全局状态管理

- `state.requesting` - 全局请求状态
- `contextRequestState` - 上下文请求状态
- 自动更新 loading 状态

### 4. 拓扑排序

- 支持请求间的依赖关系
- 自动检测循环依赖
- 按依赖顺序执行请求

## 样式支持

### 1. 全局 Loading

```css
.easy-form-requesting {
	pointer-events: none;
}

.easy-form-loading-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.8);
	z-index: 1000;
}
```

### 2. 字段级 Loading

```css
.form-item-requesting {
	.form-item-requesting-indicator {
		color: #1890ff;
	}

	.form-item-requesting-overlay {
		position: absolute;
		background: rgba(255, 255, 255, 0.8);
		z-index: 10;
	}
}
```

## 优势

1. **统一管理** - 所有请求都在 store 中统一管理
2. **避免重复请求** - 通过缓存机制避免重复请求
3. **并发控制** - 防止过多并发请求影响性能
4. **依赖管理** - 支持复杂的请求依赖关系
5. **模式支持** - 根据表单模式执行不同请求
6. **完整反馈** - 提供全局和字段级的 loading 状态
7. **类型安全** - 完整的 TypeScript 类型支持

## 扩展性

1. **自定义并发数** - 可在创建 store 时指定最大并发数
2. **自定义 loading 样式** - 可通过 CSS 自定义 loading 效果
3. **Hook 支持** - 提供多种 Hook 方便使用
4. **错误处理** - 完整的错误状态管理
5. **状态查询** - 提供丰富的状态查询方法

这个实现提供了完整的表单请求管理解决方案，满足了复杂业务场景的需求。
