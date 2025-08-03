# Effects 和 Actions 使用指南

## 概述

Easy Page 表单框架提供了强大的联动功能，通过 **Effects（副作用）** 和 **Actions（动作）** 来实现表单字段之间的动态交互。

## 核心概念

### Effects（副作用）

- **定义**：当一个字段变化时，对其他字段产生的影响
- **特点**：配置在变化的字段上，一个字段可以影响多个其他字段
- **执行时机**：字段值变化时自动触发

### Actions（动作）

- **定义**：当某些字段变化时，当前字段需要做出的响应
- **特点**：配置在被影响的字段上，一个字段可以被多个字段影响
- **执行时机**：依赖的字段变化时自动触发

## 执行顺序

1. **先执行 Effects**：字段变化时，先执行该字段的 effects
2. **再执行 Actions**：然后执行被影响的字段的 actions
3. **顺序执行**：effects 和 actions 内部按配置顺序执行

## 配置结构

### EffectConfig（副作用配置）

```typescript
interface EffectConfig {
	effectedKeys?: string[]; // 受影响的字段，会恢复为默认值
	handler?: (store: FormStore) => Promise<
		Record<
			string,
			{
				fieldValue: any;
				fieldProps: Record<string, any>;
			}
		>
	>;
}
```

### ActionConfig（动作配置）

```typescript
interface ActionConfig {
	effectedBy: string[]; // 被哪些字段影响
	handler: (store: FormStore) => Promise<{
		fieldValue: any;
		fieldProps: Record<string, any>;
	}>;
}
```

## 使用示例

### 基础联动示例

```tsx
<FormItem
  id="country"
  label="国家"
  effects={[
    {
      effectedKeys: ['province', 'city', 'district'],
      handler: async (store) => {
        const country = store.getValue('country');

        // 模拟异步操作
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
          province: { fieldValue: '', fieldProps: {} },
          city: { fieldValue: '', fieldProps: {} },
          district: { fieldValue: '', fieldProps: {} }
        };
      }
    }
  ]}
>
  <Select
    placeholder="请选择国家"
    options={[
      { label: '中国', value: 'china' },
      { label: '美国', value: 'usa' }
    ]}
  />
</FormItem>

<FormItem
  id="province"
  label="省份"
  actions={[
    {
      effectedBy: ['country'],
      handler: async (store) => {
        const country = store.getValue('country');

        // 根据国家设置省份选项
        const provinceOptions = country === 'china'
          ? [
              { label: '北京', value: 'beijing' },
              { label: '上海', value: 'shanghai' }
            ]
          : [];

        return {
          fieldValue: '',
          fieldProps: {
            options: provinceOptions,
            placeholder: `请选择${country === 'china' ? '省份' : '州'}`
          }
        };
      }
    }
  ]}
>
  <Select placeholder="请选择省份" options={[]} />
</FormItem>
```

### 复杂联动示例

```tsx
// 多级联动：国家 -> 省份 -> 城市 -> 区县
<FormItem
	id="province"
	label="省份"
	effects={[
		{
			effectedKeys: ['city', 'district'],
			handler: async (store) => {
				const province = store.getValue('province');

				return {
					city: { fieldValue: '', fieldProps: {} },
					district: { fieldValue: '', fieldProps: {} },
				};
			},
		},
	]}
	actions={[
		{
			effectedBy: ['country'],
			handler: async (store) => {
				const country = store.getValue('country');

				// 根据国家设置省份选项
				const provinceOptions =
					country === 'china'
						? [
								{ label: '北京', value: 'beijing' },
								{ label: '上海', value: 'shanghai' },
						  ]
						: country === 'usa'
						? [
								{ label: '加利福尼亚', value: 'california' },
								{ label: '纽约', value: 'newyork' },
						  ]
						: [];

				return {
					fieldValue: '',
					fieldProps: {
						options: provinceOptions,
						placeholder: `请选择${country === 'china' ? '省份' : '州'}`,
					},
				};
			},
		},
	]}
>
	<Select placeholder="请选择省份" options={[]} />
</FormItem>
```

### 条件联动示例

```tsx
<FormItem
	id="userType"
	label="用户类型"
	effects={[
		{
			effectedKeys: ['company', 'school'],
			handler: async (store) => {
				const userType = store.getValue('userType');

				if (userType === 'personal') {
					return {
						company: { fieldValue: '', fieldProps: { disabled: true } },
						school: { fieldValue: '', fieldProps: { disabled: true } },
					};
				} else if (userType === 'company') {
					return {
						company: { fieldValue: '', fieldProps: { disabled: false } },
						school: { fieldValue: '', fieldProps: { disabled: true } },
					};
				} else {
					return {
						company: { fieldValue: '', fieldProps: { disabled: true } },
						school: { fieldValue: '', fieldProps: { disabled: false } },
					};
				}
			},
		},
	]}
>
	<Select
		placeholder="请选择用户类型"
		options={[
			{ label: '个人', value: 'personal' },
			{ label: '企业', value: 'company' },
			{ label: '学校', value: 'school' },
		]}
	/>
</FormItem>
```

## 性能优化特性

### 1. 调度中心

- 统一管理所有 effects 和 actions 的执行
- 控制并发执行数量（默认最多 3 个）
- 避免过多的异步操作同时执行

### 2. 循环检测

- 自动检测 effects 和 actions 的循环依赖
- 防止无限循环导致页面卡死
- 在控制台输出警告信息

### 3. 处理状态管理

- 字段处理中时显示加载状态
- 延迟 100ms 后显示处理指示器
- 处理中时禁用相关字段

### 4. 错误处理

- 异步操作失败时不会影响表单正常使用
- 在控制台输出详细错误信息
- 优雅降级，保证用户体验

## 最佳实践

### 1. 合理使用 effectedKeys

```typescript
// 推荐：明确指定受影响的字段
effects={[
  {
    effectedKeys: ['field1', 'field2'],
    handler: async (store) => {
      // 处理逻辑
    }
  }
]}

// 不推荐：在 handler 中手动处理
effects={[
  {
    handler: async (store) => {
      store.setValue('field1', '');
      store.setValue('field2', '');
    }
  }
]}
```

### 2. 异步操作处理

```typescript
// 推荐：使用 async/await
handler: async (store) => {
	const data = await fetchOptions();
	return {
		field: { fieldValue: '', fieldProps: { options: data } },
	};
};

// 不推荐：直接返回 Promise
handler: (store) => {
	return fetchOptions().then((data) => ({
		field: { fieldValue: '', fieldProps: { options: data } },
	}));
};
```

### 3. 避免复杂逻辑

```typescript
// 推荐：拆分复杂逻辑
effects={[
  {
    effectedKeys: ['field1'],
    handler: async (store) => {
      return { field1: { fieldValue: '', fieldProps: {} } };
    }
  },
  {
    effectedKeys: ['field2'],
    handler: async (store) => {
      return { field2: { fieldValue: '', fieldProps: {} } };
    }
  }
]}

// 不推荐：在一个 handler 中处理多个字段
effects={[
  {
    effectedKeys: ['field1', 'field2', 'field3'],
    handler: async (store) => {
      // 复杂的处理逻辑
    }
  }
]}
```

## 注意事项

1. **避免循环依赖**：确保 effects 和 actions 不会形成循环
2. **合理使用异步**：避免不必要的异步操作
3. **错误处理**：在 handler 中添加适当的错误处理
4. **性能考虑**：避免在 handler 中执行耗时的操作
5. **状态管理**：注意 store 状态的一致性

## 调试技巧

1. **查看控制台**：effects 和 actions 的执行会在控制台输出日志
2. **检查循环依赖**：循环依赖会在控制台显示警告
3. **观察处理状态**：字段处理中时会显示加载指示器
4. **使用 React DevTools**：查看组件状态和 props 变化
