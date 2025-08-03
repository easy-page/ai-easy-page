# Easy Page 表单框架

一个简洁易用、灵活可扩展的表单框架，基于 React + TypeScript + MobX 实现。

## 特性

- 🎯 **简洁易用** - 基于 React 的声明式 API，学习成本低
- 🔧 **灵活可扩展** - 支持自定义验证规则和组件
- 📱 **多端适配** - 支持 PC 端和移动端
- 🔄 **状态管理** - 基于 MobX 的响应式状态管理
- 🔗 **表单联动** - 强大的 Effects & Actions 联动功能
- 🔄 **外部状态监听** - 监听外部状态变化，自动更新表单字段
- 🔒 **全局禁用状态** - 一键控制整个表单的可编辑状态
- ⚡ **性能优化** - 调度中心、循环检测、处理状态管理
- ✅ **统一验证** - 支持多种验证方式和联动验证
- 🎨 **UI 无关** - 核心逻辑与 UI 库解耦
- 📦 **Monorepo** - 基于 pnpm workspace 的模块化架构

## 项目结构

```
easy-page-v2/
├── packages/
│   ├── easy-page-core/     # 核心包
│   ├── easy-page-pc/       # PC 端组件
│   └── easy-page-mobile/   # 移动端组件
├── apps/
│   ├── pc-demo/           # PC 端 Demo
│   └── mobile-demo/       # 移动端 Demo
└── README.md
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动所有项目
pnpm dev

# 或者单独启动某个项目
pnpm --filter @easy-page/pc-demo dev
pnpm --filter @easy-page/mobile-demo dev
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm --filter @easy-page/core build
```

## 核心概念

### Form 组件

表单容器组件，负责：

- 初始化表单状态
- 注入 store 和 validator
- 处理表单提交

```tsx
import { Form } from '@easy-page/core';

<Form
	initialValues={{ username: '', email: '' }}
	onSubmit={(values, store) => {
		console.log('表单提交:', values);
	}}
>
	{/* 表单内容 */}
</Form>;
```

### FormItem 组件

表单项组件，负责：

- 字段状态管理
- 验证规则注册
- 错误信息展示

```tsx
import { FormItem } from '@easy-page/core';

<FormItem
	id="username"
	label="用户名"
	required
	validate={[
		{ required: true, message: '请输入用户名' },
		{ min: 2, message: '用户名至少2个字符' },
	]}
>
	<Input placeholder="请输入用户名" />
</FormItem>;
```

### 验证规则

支持多种验证方式：

```tsx
const validateRules = [
	// 必填验证
	{ required: true, message: '此字段为必填项' },

	// 正则验证
	{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' },

	// 长度验证
	{ min: 6, max: 20, message: '长度必须在6-20之间' },

	// 自定义验证
	{
		validator: (value, store) => {
			const password = store.getValue('password');
			return value === password || '两次输入的密码不一致';
		},
	},
];
```

### 动态表单

支持动态增减表单项：

```tsx
import { DynamicForm } from '@easy-page/pc';

const config = {
	rows: [
		{
			id: 'row-1',
			fields: ['name', 'age', 'email'],
			removable: false,
			addable: true,
		},
	],
	onAdd: (index) => console.log('添加行:', index),
	onRemove: (index) => console.log('删除行:', index),
};

<DynamicForm config={config}>{/* 表单内容 */}</DynamicForm>;
```

## 组件库

### PC 端组件

```tsx
import { Input, Select, DynamicForm } from '@easy-page/pc';

// 基础输入框
<Input placeholder="请输入内容" />

// 选择器（支持远程搜索）
<Select
  placeholder="请选择"
  remoteSearch
  onSearch={async (keyword) => {
    // 远程搜索逻辑
    return searchResults;
  }}
/>

// 动态表单
<DynamicForm config={config}>
  {/* 表单内容 */}
</DynamicForm>
```

### 移动端组件

```tsx
import { Input } from '@easy-page/mobile';

<Input placeholder="请输入内容" />;
```

## 状态管理

基于 MobX 的响应式状态管理：

```tsx
import { createFormStore } from '@easy-page/core';

const store = createFormStore({
	username: '',
	email: '',
});

// 设置值
store.setValue('username', 'new value');

// 获取值
const value = store.getValue('username');

// 验证
const results = await store.validate('username');

// 检查字段状态
const isValid = store.isFieldValid('username');
const isTouched = store.isFieldTouched('username');
```

## 自定义验证器

```tsx
import { FormValidator } from '@easy-page/core';

const validator = new FormValidator();

// 添加自定义验证规则
validator.addRule('custom', async (value, rule, store) => {
	// 自定义验证逻辑
	if (value === 'invalid') {
		return {
			valid: false,
			message: '自定义错误信息',
			field: '',
		};
	}
	return { valid: true, field: '' };
});
```

## Effects & Actions 联动功能

强大的表单联动功能，支持复杂的字段交互：

### Effects（副作用）

当字段变化时对其他字段的影响：

```tsx
<FormItem
	id="country"
	label="国家"
	effects={[
		{
			effectedKeys: ['province', 'city'],
			handler: async (store) => {
				return {
					province: { fieldValue: '', fieldProps: {} },
					city: { fieldValue: '', fieldProps: {} },
				};
			},
		},
	]}
>
	<Select options={countryOptions} />
</FormItem>
```

### Actions（动作）

当字段被其他字段影响时的响应：

```tsx
<FormItem
	id="province"
	label="省份"
	actions={[
		{
			effectedBy: ['country'],
			handler: async (store) => {
				const country = store.getValue('country');
				const options = await fetchProvinces(country);

				return {
					fieldValue: '',
					fieldProps: { options, placeholder: '请选择省份' },
				};
			},
		},
	]}
>
	<Select options={[]} />
</FormItem>
```

### 性能优化特性

- **调度中心**：统一管理异步操作，控制并发数量
- **循环检测**：自动检测并防止循环依赖
- **处理状态**：显示加载状态，提升用户体验
- **错误处理**：优雅降级，保证表单可用性

详细使用说明请参考：[Effects 和 Actions 使用指南](./EFFECTS_AND_ACTIONS_USAGE.md)

## 外部状态监听功能

监听外部状态变化，自动更新表单字段：

```tsx
import { useExternalStateListener } from '@easy-page/core';

const [userInfo, setUserInfo] = useState({
	userId: 'user-001',
	userType: 'vip',
	region: 'china',
});

useExternalStateListener(store, userInfo, [
	{
		fields: ['username', 'email'],
		handler: async (externalState, store) => {
			const isVip = externalState.userType === 'vip';
			const region = externalState.region;

			return {
				username: {
					fieldValue: `${externalState.userId}-${isVip ? 'VIP' : 'NORMAL'}`,
					fieldProps: { disabled: isVip },
				},
				email: {
					fieldValue: `${externalState.userId}@${region}.com`,
					fieldProps: { placeholder: `请输入${region}邮箱` },
				},
			};
		},
		condition: (externalState) =>
			externalState.userType && externalState.region,
	},
]);
```

### 特性

- **条件触发**：通过条件函数控制是否执行监听器
- **异步处理**：支持异步数据获取和处理
- **批量更新**：一次监听器执行可以更新多个字段
- **自动清理**：Hook 自动管理监听器的注册和注销

详细使用说明请参考：[外部状态监听功能使用指南](./EXTERNAL_STATE_LISTENER_USAGE.md)

## 全局禁用状态功能

一键控制整个表单的可编辑状态：

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
```

### 特性

- **一键控制**：通过一个方法控制整个表单
- **外部联动**：与业务状态无缝集成
- **视觉反馈**：清晰的禁用状态样式
- **优先级管理**：支持多种禁用状态的优先级

详细使用说明请参考：[表单全局禁用状态功能使用指南](./FORM_DISABLED_STATE_USAGE.md)

## 开发指南

### 添加新组件

1. 在对应的组件包中创建新组件
2. 确保组件支持 `value` 和 `onChange` 属性
3. 在 `index.ts` 中导出组件和类型

### 添加新验证规则

1. 在 `FormValidator` 类中添加验证逻辑
2. 或者使用 `addRule` 方法添加自定义规则

### 构建和发布

```bash
# 构建所有包
pnpm build

# 发布（需要配置 changeset）
pnpm changeset
pnpm version-packages
pnpm release
```

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
