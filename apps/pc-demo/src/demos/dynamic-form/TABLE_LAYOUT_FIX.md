# 表格布局联动功能修复说明

## 问题描述

在原始的表格布局实现中，DynamicForm 的 `containerType="table"` 无法正确支持行间联动功能，具体表现为：

1. **useRowInfo 无法获取行信息**: 在 TableContainer 中，字段没有正确的 RowInfo 上下文
2. **effects 联动失效**: 由于缺少行信息，effects 处理器无法正确执行联动逻辑
3. **字段禁用状态异常**: 最小值输入框的禁用状态无法正确控制

## 根本原因

TableContainer 的实现方式与 DynamicForm 核心组件不同：

### 原始实现问题

```tsx
// 原始 TableContainer 实现 - 缺少 RowInfo 上下文
return React.cloneElement(targetField as React.ReactElement, {
	key: `${rowIndex}_${fieldIndex}`,
	id: `${rowIndex}_${(targetField as React.ReactElement).props.id}`,
});
```

### 修复后的实现

```tsx
// 修复后的实现 - 提供完整的 RowInfo 上下文
const rowInfo: RowInfo = {
	currentRow: rowIndex,
	totalRows: value.length,
	isLast: rowIndex === value.length - 1,
};

return (
	<RowInfoContext.Provider key={`${rowIndex}_${fieldIndex}`} value={rowInfo}>
		{React.cloneElement(targetField as React.ReactElement, {
			id: `${rowIndex}_${(targetField as React.ReactElement).props.id}`,
		})}
	</RowInfoContext.Provider>
);
```

## 修复内容

### 1. 添加 RowInfo 上下文支持

在 `packages/easy-page-pc/src/components/DynamicForm.tsx` 中：

```tsx
// 添加行信息上下文定义
interface RowInfo {
	currentRow: number;
	totalRows: number;
	isLast: boolean;
}

const RowInfoContext = React.createContext<RowInfo | null>(null);

// 导出 useRowInfo Hook
export const useRowInfo = () => {
	const context = React.useContext(RowInfoContext);
	if (!context) {
		return undefined;
	}
	return context;
};
```

### 2. 修改 TableContainer 字段渲染逻辑

```tsx
// 在 TableContainer 的 render 函数中
render: (text: any, record: any, rowIndex: number) => {
	// ... 找到目标字段的逻辑 ...

	if (targetField) {
		// 创建行信息
		const rowInfo: RowInfo = {
			currentRow: rowIndex,
			totalRows: value.length,
			isLast: rowIndex === value.length - 1,
		};

		// 克隆字段并设置正确的ID，同时提供行信息上下文
		return (
			<RowInfoContext.Provider
				key={`${rowIndex}_${fieldIndex}`}
				value={rowInfo}
			>
				{React.cloneElement(targetField as React.ReactElement, {
					id: `${rowIndex}_${(targetField as React.ReactElement).props.id}`,
				})}
			</RowInfoContext.Provider>
		);
	}
	return null;
};
```

### 3. 修复 SubsidyTierTableDemo 中的联动逻辑

```tsx
// 修复 effects 处理器中的类型安全问题
effects={[
  {
    handler: async (store, rowInfo) => {
      if (!rowInfo) return {};

      const { currentRow, totalRows } = rowInfo;

      // 如果不是最后一行，则影响下一行
      if (currentRow < totalRows - 1) {
        const currentThreshold = store.getValue(`${currentRow}_threshold`);
        const nextRow = currentRow + 1;

        // 类型安全处理
        const maxValue =
          typeof currentThreshold === 'object' &&
          currentThreshold &&
          'max' in currentThreshold
            ? (currentThreshold as any).max
            : 0;

        return {
          [`${nextRow}_threshold`]: {
            fieldValue: {
              min: maxValue || 0,
              max: null,
            },
            fieldProps: {
              minDisabled: true, // 下一行的最小值不可修改
            },
          },
        };
      }

      return {};
    },
  },
]}
```

## 修复效果

### 修复前的问题

- ❌ useRowInfo() 返回 undefined
- ❌ effects 联动逻辑无法执行
- ❌ 最小值输入框无法正确禁用
- ❌ 行间数据联动失效

### 修复后的效果

- ✅ useRowInfo() 正确返回行信息
- ✅ effects 联动逻辑正常执行
- ✅ 最小值输入框正确禁用/启用
- ✅ 行间数据联动正常工作
- ✅ 第一行最小值固定为 0 且不可修改
- ✅ 上一行最大值自动设置为下一行最小值

## 技术要点

### 1. 上下文传递机制

- 使用 React Context 在表格行中传递行信息
- 确保每个字段都能访问到正确的行信息

### 2. 类型安全

- 添加了类型检查，确保数据结构的正确性
- 修复了 TypeScript 编译错误

### 3. 兼容性

- 保持了与原有 DynamicForm 核心组件的兼容性
- 不影响其他容器类型的正常使用

## 测试验证

### 功能测试

1. ✅ 添加新行时，上一行的最大值自动设置为新行的最小值
2. ✅ 修改某行的最大值时，下一行的最小值自动更新
3. ✅ 第一行的最小值固定为 0 且不可修改
4. ✅ 最后一行的最大值显示为"不限"
5. ✅ 删除行时，联动关系正确更新

### 边界测试

1. ✅ 只有一行时，联动逻辑正确处理
2. ✅ 达到最大行数时，添加按钮正确禁用
3. ✅ 达到最小行数时，删除按钮正确禁用

## 总结

通过修复 TableContainer 的 RowInfo 上下文传递机制，我们成功恢复了表格布局下的联动功能。这个修复不仅解决了当前的问题，还为未来在表格布局中实现更复杂的联动逻辑奠定了基础。

修复后的表格布局 demo 现在完全支持：

- 行间数据联动
- 字段状态控制
- 动态添加/删除行
- 完整的表单验证

这证明了 DynamicForm 的表格布局模式可以很好地支持复杂的业务场景。
