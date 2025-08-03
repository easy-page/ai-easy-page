# When 组件使用示例

When 组件是 Easy Page 框架中用于条件性显示表单字段的重要组件。它可以根据表单中其他字段的值来决定是否显示特定的字段或字段组。

## 基本用法

```tsx
import { When } from '@easy-page/core';

<When
	show={({ store }) => {
		const value = store.getValue('fieldName');
		return value === 'expectedValue';
	}}
>
	<FormItem id="conditionalField" label="条件字段">
		<Input />
	</FormItem>
</When>;
```

## 示例场景

### 1. 单选框条件显示 (RadioWhenDemo)

当选择不同的单选框选项时，显示不同的字段组合：

- 选择"选项 A"时，显示字段 1、2、3
- 选择"选项 B"时，显示字段 4、5

```tsx
<When
  show={({ store }) => {
    const option = store.getValue('option');
    return option === 'A';
  }}
>
  {/* 显示字段1、2、3 */}
</When>

<When
  show={({ store }) => {
    const option = store.getValue('option');
    return option === 'B';
  }}
>
  {/* 显示字段4、5 */}
</When>
```

### 2. 多选框条件显示 (CheckboxWhenDemo)

根据多选框的选择数量显示不同的字段：

- 选择至少 1 个选项时，显示字段 1、2、3
- 选择至少 2 个选项时，额外显示字段 4

```tsx
<When
  show={({ store }) => {
    const options = store.getValue('options') || [];
    return Array.isArray(options) && options.length >= 1;
  }}
>
  {/* 显示字段1、2、3 */}
</When>

<When
  show={({ store }) => {
    const options = store.getValue('options') || [];
    return Array.isArray(options) && options.length >= 2;
  }}
>
  {/* 显示字段4 */}
</When>
```

### 3. 下拉框条件显示 (SelectWhenDemo)

根据下拉框的选择显示不同的字段组合：

- 选择"选项 A"时，显示字段 1、2、3
- 选择"选项 B"时，显示字段 1、2、3、4
- 选择"选项 C"时，显示字段 1、2

## When 组件的参数

### show 函数

`show` 函数接收一个对象参数，包含以下属性：

- `store`: FormStore 实例，用于获取表单字段值
- `rowInfo`: 行信息（在动态表单中使用）
- `rowValues`: 行值（在动态表单中使用）

### 返回值

- 返回 `true` 时，显示子组件
- 返回 `false` 时，隐藏子组件（返回 null）

## 注意事项

1. **性能优化**: When 组件会在每次表单值变化时重新计算，避免在 show 函数中进行复杂的计算
2. **字段依赖**: 确保在 show 函数中引用的字段已经在表单中定义
3. **类型安全**: 使用 `Array.isArray()` 检查数组类型的字段值
4. **默认值**: 为可能为空的字段提供默认值，如 `|| []` 或 `|| ''`

## 最佳实践

1. **简洁的条件逻辑**: 保持 show 函数简洁，复杂的逻辑可以提取为独立函数
2. **避免副作用**: show 函数应该是纯函数，不要在其中修改状态
3. **合理的字段组织**: 将相关的条件字段组织在一起，提高代码可读性
4. **测试覆盖**: 为不同的条件分支编写测试用例
