# 外部状态监听功能使用指南

## 概述

Easy Page 表单框架提供了强大的外部状态监听功能，当外部状态（如用户信息、活动状态、系统配置等）发生变化时，可以自动更新表单字段的值和属性。

## 核心概念

### ExternalStateListener（外部状态监听器）

- **定义**：监听外部状态变化并更新表单字段的配置
- **特点**：支持条件触发、异步处理、批量更新
- **执行时机**：外部状态变化时自动触发

### useExternalStateListener Hook

- **定义**：React Hook，简化外部状态监听的使用
- **特点**：自动管理监听器的注册和注销
- **使用场景**：在组件中监听外部状态变化

## 配置结构

### ExternalStateListener 配置

```typescript
interface ExternalStateListener {
	id: string; // 监听器唯一标识
	fields: string[]; // 需要更新的字段
	handler: (
		externalState: any,
		store: FormStore
	) => Promise<
		Record<
			string,
			{
				fieldValue: any;
				fieldProps?: Record<string, any>;
			}
		>
	>;
	condition?: (externalState: any) => boolean; // 可选的触发条件
}
```

## 使用示例

### 基础用法

```tsx
import { useExternalStateListener } from '@easy-page/core';

const App = () => {
	const [userInfo, setUserInfo] = useState({
		userId: 'user-001',
		userType: 'vip',
		region: 'china',
	});

	const store = createFormStore({
		username: '',
		email: '',
		age: 25,
	});

	// 监听用户信息变化
	useExternalStateListener(store, userInfo, [
		{
			fields: ['username', 'email'],
			handler: async (externalState, store) => {
				const isVip = externalState.userType === 'vip';
				const region = externalState.region;

				return {
					username: {
						fieldValue: `${externalState.userId}-${isVip ? 'VIP' : 'NORMAL'}`,
						fieldProps: { disabled: isVip }, // VIP 用户不能修改用户名
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

	return (
		<Form store={store}>
			<FormItem id="username" label="用户名">
				<Input />
			</FormItem>
			<FormItem id="email" label="邮箱">
				<Input />
			</FormItem>
		</Form>
	);
};
```

### 活动状态监听

```tsx
const [activityStatus, setActivityStatus] = useState('active');

useExternalStateListener(store, activityStatus, [
	{
		fields: ['age'],
		handler: async (externalState, store) => {
			const currentAge = store.getValue('age') as number;
			let newAge = currentAge;

			if (externalState === 'active') {
				// 活动期间，年龄限制放宽
				newAge = Math.max(currentAge || 18, 16);
			} else if (externalState === 'inactive') {
				// 非活动期间，年龄限制收紧
				newAge = Math.max(currentAge || 18, 21);
			}

			return {
				age: {
					fieldValue: newAge,
					fieldProps: {
						min: externalState === 'active' ? 16 : 21,
						max: 100,
						placeholder: `活动期间年龄限制: ${
							externalState === 'active' ? '16+' : '21+'
						}`,
					},
				},
			};
		},
	},
]);
```

### 系统配置监听

```tsx
const [systemConfig, setSystemConfig] = useState({
	theme: 'light',
	language: 'zh-CN',
	features: ['feature1', 'feature2'],
});

useExternalStateListener(store, systemConfig, [
	{
		fields: ['theme', 'language'],
		handler: async (externalState, store) => {
			return {
				theme: {
					fieldValue: externalState.theme,
					fieldProps: {
						options: [
							{ label: '浅色主题', value: 'light' },
							{ label: '深色主题', value: 'dark' },
						],
					},
				},
				language: {
					fieldValue: externalState.language,
					fieldProps: {
						options: [
							{ label: '中文', value: 'zh-CN' },
							{ label: 'English', value: 'en-US' },
						],
					},
				},
			};
		},
	},
]);
```

### 条件触发

```tsx
useExternalStateListener(store, userInfo, [
	{
		fields: ['vipLevel'],
		handler: async (externalState, store) => {
			// 只有 VIP 用户才更新 VIP 等级字段
			if (externalState.userType === 'vip') {
				return {
					vipLevel: {
						fieldValue: externalState.vipLevel || 'bronze',
						fieldProps: {
							options: [
								{ label: '青铜', value: 'bronze' },
								{ label: '白银', value: 'silver' },
								{ label: '黄金', value: 'gold' },
							],
						},
					},
				};
			}
			return {};
		},
		condition: (externalState) => externalState.userType === 'vip',
	},
]);
```

## 高级用法

### 多个监听器

```tsx
useExternalStateListener(store, userInfo, [
	// 监听器1：更新用户基本信息
	{
		fields: ['username', 'email'],
		handler: async (externalState, store) => {
			return {
				username: { fieldValue: externalState.username },
				email: { fieldValue: externalState.email },
			};
		},
	},
	// 监听器2：更新权限相关字段
	{
		fields: ['permissions'],
		handler: async (externalState, store) => {
			return {
				permissions: {
					fieldValue: externalState.permissions,
					fieldProps: {
						options: externalState.availablePermissions,
					},
				},
			};
		},
	},
]);
```

### 异步数据处理

```tsx
useExternalStateListener(store, userInfo, [
	{
		fields: ['department', 'role'],
		handler: async (externalState, store) => {
			// 异步获取部门信息
			const departmentData = await fetchDepartments(externalState.companyId);

			// 异步获取角色信息
			const roleData = await fetchRoles(externalState.userType);

			return {
				department: {
					fieldValue: externalState.department,
					fieldProps: { options: departmentData },
				},
				role: {
					fieldValue: externalState.role,
					fieldProps: { options: roleData },
				},
			};
		},
	},
]);
```

### 复杂业务逻辑

```tsx
useExternalStateListener(store, businessConfig, [
	{
		fields: ['productType', 'price', 'discount'],
		handler: async (externalState, store) => {
			const { season, promotion, userLevel } = externalState;

			// 根据季节调整产品类型
			const seasonalProducts = getSeasonalProducts(season);

			// 根据促销活动计算价格
			const basePrice = getBasePrice(externalState.productId);
			const finalPrice = calculatePrice(basePrice, promotion, userLevel);

			// 根据用户等级计算折扣
			const discount = calculateDiscount(userLevel, promotion);

			return {
				productType: {
					fieldValue: externalState.productType,
					fieldProps: { options: seasonalProducts },
				},
				price: { fieldValue: finalPrice },
				discount: {
					fieldValue: discount,
					fieldProps: {
						min: 0,
						max: 100,
						suffix: '%',
					},
				},
			};
		},
	},
]);
```

## 性能优化特性

### 1. 条件触发

- 通过 `condition` 函数控制是否执行监听器
- 避免不必要的计算和更新
- 提高性能

### 2. 调度中心

- 统一管理所有外部状态监听器的执行
- 控制并发执行数量
- 避免过多的异步操作同时执行

### 3. 批量更新

- 一次监听器执行可以更新多个字段
- 减少状态更新次数
- 提高渲染性能

### 4. 自动清理

- Hook 自动管理监听器的注册和注销
- 防止内存泄漏
- 组件卸载时自动清理

## 最佳实践

### 1. 合理使用条件触发

```typescript
// 推荐：使用条件函数
condition: (externalState) => externalState.userType === 'vip';

// 不推荐：在 handler 中判断
handler: async (externalState, store) => {
	if (externalState.userType !== 'vip') return {};
	// 处理逻辑
};
```

### 2. 避免复杂计算

```typescript
// 推荐：将复杂计算提取到外部
const calculatePrice = (basePrice, promotion, userLevel) => {
	// 复杂计算逻辑
};

handler: async (externalState, store) => {
	const price = calculatePrice(
		externalState.basePrice,
		externalState.promotion,
		externalState.userLevel
	);
	return { price: { fieldValue: price } };
};

// 不推荐：在 handler 中进行复杂计算
handler: async (externalState, store) => {
	// 复杂的计算逻辑
};
```

### 3. 合理分组监听器

```typescript
// 推荐：按功能分组
useExternalStateListener(store, userInfo, [
	// 用户基本信息监听器
	{ fields: ['username', 'email'], handler: userBasicHandler },
	// 用户权限监听器
	{ fields: ['permissions'], handler: userPermissionHandler },
]);

// 不推荐：一个监听器处理所有字段
useExternalStateListener(store, userInfo, [
	{
		fields: ['username', 'email', 'permissions', 'settings'],
		handler: complexHandler,
	},
]);
```

### 4. 错误处理

```typescript
handler: async (externalState, store) => {
	try {
		const data = await fetchData(externalState.id);
		return { field: { fieldValue: data.value } };
	} catch (error) {
		console.error('获取数据失败:', error);
		// 返回空对象，不更新字段
		return {};
	}
};
```

## 注意事项

1. **避免循环依赖**：确保外部状态监听器不会与 effects/actions 形成循环
2. **合理使用异步**：避免在监听器中执行耗时的操作
3. **错误处理**：在 handler 中添加适当的错误处理
4. **性能考虑**：避免在监听器中执行复杂的计算
5. **状态一致性**：注意外部状态与表单状态的一致性

## 调试技巧

1. **查看控制台**：外部状态监听器的执行会在控制台输出日志
2. **观察字段变化**：使用 React DevTools 查看字段值的变化
3. **检查条件函数**：确保条件函数正确返回布尔值
4. **监控性能**：使用 React Profiler 监控组件渲染性能
