# 字段依赖验证功能实现总结

## 概述

成功扩展了 DynamicForm 的验证系统，实现了完整的字段依赖验证功能，解决了以下两个核心问题：

1. **同行字段变化验证**：券门槛变化时，自动验证同行的补贴要求
2. **跨行字段变化验证**：第一行补贴要求变化时，自动验证第二行的补贴要求

## 核心功能实现

### 1. 扩展验证规则类型

在 `packages/easy-page-core/src/types.ts` 中添加了字段依赖支持：

```typescript
export interface ValidationRule {
	// ... 其他属性
	// 新增：字段依赖验证 - 当指定字段变化时，触发当前字段的验证
	dependentFields?: string[]; // 依赖的字段列表
	// 新增：影响其他字段验证 - 当前字段变化时，需要验证的其他字段
	affectFields?: string[]; // 影响的字段列表
}
```

### 2. 扩展 FormItem 组件

在 `packages/easy-page-core/src/components/FormItem.tsx` 中添加了动态验证规则生成器：

```typescript
export interface FormItemProps {
	// ... 其他属性
	// 新增：动态验证规则生成器，可以根据行信息动态生成验证规则
	validateGenerator?: (rowInfo?: ExtendedRowInfo) => ValidationRule[];
}
```

### 3. 扩展 Store 功能

在 `packages/easy-page-core/src/store.ts` 中添加了字段依赖管理：

```typescript
// 字段依赖关系管理
private fieldDependencies: Map<string, Set<string>> = new Map(); // 字段依赖关系
private fieldAffects: Map<string, Set<string>> = new Map(); // 字段影响关系

// 注册字段依赖关系
registerFieldDependencies(field: string, dependencies: string[]): void

// 注册字段影响关系
registerFieldAffects(field: string, affects: string[]): void

// 触发依赖字段验证
private async triggerDependentFieldValidation(changedField: string): Promise<void>

// 触发受影响的字段验证
private async triggerAffectedFieldValidation(changedField: string): Promise<void>
```

## 业务验证规则实现

### 1. 同行字段依赖验证

```typescript
// 券门槛字段配置
<FormItem
	id="threshold"
	validateGenerator={(rowInfo?: ExtendedRowInfo) => {
		const rules: any[] = [
			{ required: true, message: '请输入券门槛范围' },
		];

		// 券门槛变化时，影响同行的补贴要求验证
		rules.push({
			affectFields: ['maxSubsidy'],
			message: '券门槛变化会影响补贴要求验证',
		});

		return rules;
	}}
>
```

### 2. 跨行字段依赖验证

```typescript
// 补贴要求字段配置
<FormItem
	id="maxSubsidy"
	validateGenerator={(rowInfo?: ExtendedRowInfo) => {
		const rules: any[] = [
			{ required: true, message: '请输入补贴要求' },
			{ min: 0, message: '补贴要求不能为负数' },
			{ max: 5000, message: '补贴要求不能超过5000' },
			// 验证1：补贴要求要比券门槛范围最大值小
			{
				validator: validateSubsidyVsThreshold,
				message: '补贴要求不能大于或等于券门槛最大值',
				// 依赖同行的券门槛字段
				dependentFields: ['threshold'],
			},
			// 验证2：补贴要求的下一行值要比上一行补贴要求值大
			{
				validator: validateSubsidyIncrement,
				message: '补贴要求必须大于上一行的补贴要求',
			},
		];

		// 如果不是最后一行，添加影响下一行的规则
		if (rowInfo && !rowInfo.isLast) {
			rules.push({
				affectFields: [`${rowInfo.currentRow + 1}_maxSubsidy`],
				message: '当前行补贴要求变化会影响下一行验证',
			});
		}

		return rules;
	}}
>
```

## 验证器实现

### 1. 补贴要求 vs 券门槛验证

```typescript
const validateSubsidyVsThreshold = async (
	value: any,
	store: FormStore,
	rowInfo?: ExtendedRowInfo
) => {
	if (!rowInfo || typeof value !== 'number') return true;

	const currentRow = rowInfo.currentRow;
	const thresholdField = `${currentRow}_threshold`;
	const threshold = store.getValue(thresholdField);

	if (
		threshold &&
		typeof threshold === 'object' &&
		'max' in threshold &&
		threshold.max !== null &&
		typeof threshold.max === 'number'
	) {
		if (value >= threshold.max) {
			return `补贴要求不能大于或等于券门槛最大值 ${threshold.max}`;
		}
	}

	return true;
};
```

### 2. 补贴要求递增验证

```typescript
const validateSubsidyIncrement = async (
	value: any,
	store: FormStore,
	rowInfo?: ExtendedRowInfo
) => {
	if (!rowInfo || typeof value !== 'number') return true;

	const currentRow = rowInfo.currentRow;

	// 如果不是第一行，需要验证递增性
	if (currentRow > 0) {
		const prevRow = currentRow - 1;
		const prevSubsidyField = `${prevRow}_maxSubsidy`;
		const prevSubsidy = store.getValue(prevSubsidyField);

		if (typeof prevSubsidy === 'number' && value <= prevSubsidy) {
			return `补贴要求必须大于上一行的补贴要求 ${prevSubsidy}`;
		}
	}

	return true;
};
```

## 工作流程

### 1. 字段变化触发流程

```
用户修改字段值
    ↓
setValue() 被调用
    ↓
更新字段状态
    ↓
触发副作用和动作
    ↓
验证当前字段
    ↓
触发依赖字段验证 (triggerDependentFieldValidation)
    ↓
触发受影响字段验证 (triggerAffectedFieldValidation)
```

### 2. 依赖关系管理

```
字段注册时：
    ↓
FormItem 解析 validateGenerator
    ↓
生成最终验证规则
    ↓
注册字段依赖关系 (registerFieldDependencies)
    ↓
注册字段影响关系 (registerFieldAffects)
```

### 3. 验证触发机制

```
字段A变化
    ↓
查找依赖字段A的字段列表
    ↓
触发这些字段的验证
    ↓
查找受字段A影响的字段列表
    ↓
触发这些字段的验证
```

## 测试用例

### 测试 1：同行验证

- **场景**：券门槛变化时验证同行补贴要求
- **步骤**：
  1. 设置券门槛范围为 0-30
  2. 设置补贴要求为 35
  3. 修改券门槛最大值为 25
- **预期**：补贴要求显示错误 "补贴要求不能大于或等于券门槛最大值 25"

### 测试 2：跨行验证

- **场景**：上一行补贴要求变化时验证下一行
- **步骤**：
  1. 第一行补贴要求设置为 4
  2. 第二行补贴要求设置为 3
  3. 修改第一行补贴要求为 5
- **预期**：第二行显示错误 "补贴要求必须大于上一行的补贴要求 5"

### 测试 3：联动效果

- **场景**：券门槛变化时的联动更新
- **步骤**：
  1. 修改第一行券门槛最大值为 50
- **预期**：第二行券门槛最小值自动更新为 50

## 技术特点

### 1. 动态验证规则生成

- 使用 `validateGenerator` 根据行信息动态生成验证规则
- 支持复杂的依赖关系计算
- 类型安全的实现

### 2. 双向依赖管理

- `dependentFields`：定义字段依赖关系
- `affectFields`：定义字段影响关系
- 支持一对多的依赖关系

### 3. 异步验证处理

- 使用 setTimeout 避免阻塞 UI 更新
- 支持并发验证处理
- 错误处理和状态管理

### 4. 类型安全

- 完整的 TypeScript 类型定义
- 运行时类型检查
- 编译时错误检测

## 使用方式

### 基础用法

```typescript
<FormItem
	id="fieldA"
	validateGenerator={(rowInfo) => [
		{ required: true },
		{
			dependentFields: ['fieldB'], // 依赖 fieldB
			affectFields: ['fieldC'], // 影响 fieldC
			validator: myValidator,
		},
	]}
>
	<Input />
</FormItem>
```

### 动态依赖

```typescript
<FormItem
	id="subsidy"
	validateGenerator={(rowInfo) => {
		const rules = [
			/* 基础规则 */
		];

		if (rowInfo && !rowInfo.isLast) {
			rules.push({
				affectFields: [`${rowInfo.currentRow + 1}_subsidy`],
			});
		}

		return rules;
	}}
>
	<InputNumber />
</FormItem>
```

## 总结

通过扩展 easy-page/core 的验证系统，成功实现了完整的字段依赖验证功能。该实现具有以下优势：

1. **完整性** - 解决了同行和跨行字段变化的验证问题
2. **灵活性** - 支持动态验证规则生成和复杂的依赖关系
3. **可扩展性** - 易于添加新的验证规则和依赖关系
4. **性能优化** - 异步处理避免阻塞 UI
5. **类型安全** - 完整的 TypeScript 支持

这个实现为 DynamicForm 组件提供了强大的字段依赖验证能力，可以处理各种复杂的业务场景和验证需求。
