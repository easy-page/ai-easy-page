# searchedById 功能实现

## 问题描述

在编辑模式下，Select 组件只显示当前选中的选项（如"深圳市"），而没有显示其他可选的选项列表。这导致用户无法看到完整的选项列表，影响用户体验。

## 解决方案

新增 `searchedById` 属性到 `FieldRequestConfig` 接口中，用于在编辑模式下查询选中项的详细信息，并与默认选项列表合并显示。

## 实现细节

### 1. 类型定义扩展

在 `packages/easy-page-core/src/types.ts` 中扩展了 `FieldRequestConfig` 接口：

```typescript
export interface FieldRequestConfig {
	effectedBy?: string[];
	handler: (params: {
		/* ... */
	}) => Promise<{
		/* ... */
	}>;
	// 新增：根据ID查询选中项的详细信息（主要用于编辑模式）
	searchedById?: (params: {
		store: FormStore;
		rowInfo?: ExtendedRowInfo;
		rowValues?: any;
		value: any; // 当前字段的值（通常是ID）
	}) => Promise<{
		success: boolean;
		data: any;
		error?: string;
	}>;
}
```

### 2. Store 逻辑优化

在 `packages/easy-page-core/src/store/store.ts` 的 `dispatchFieldRequest` 方法中添加了新的逻辑：

1. **获取默认选项列表**：调用 `config.handler` 获取常规的选项列表
2. **查询选中项详情**：如果有 `searchedById` 配置且当前有值，则调用 `config.searchedById` 查询选中项的详细信息
3. **合并结果**：将选中项与默认选项列表合并，确保选中项在列表开头且不重复

### 3. 使用示例

在 `SelectDemo.tsx` 中的城市字段配置：

```typescript
<FormItem
	id="city"
	label="城市"
	required
	req={{
		effectedBy: ['province'],
		handler: async ({ store, value, keyword }) => {
			// 获取默认的城市列表
			const provinceId = value || store.getValue('province');
			if (!provinceId) return { success: true, data: [] };
			return await mockApi.getCities(provinceId, keyword);
		},
		// 新增：根据城市ID查询城市详情（用于编辑模式）
		searchedById: async ({ store, value }) => {
			const provinceId = store.getValue('province');
			const cityId = value;

			if (!provinceId || !cityId) {
				return { success: true, data: null };
			}

			// 根据城市ID查询城市详情
			const result = await mockApi.getCities(
				provinceId as string,
				undefined,
				cityId as string
			);

			// 如果找到了城市，返回第一个匹配项
			if (result.success && result.data && result.data.length > 0) {
				return { success: true, data: result.data[0] };
			}

			return { success: true, data: null };
		},
	}}
>
	<Select
		id="city"
		placeholder="请选择城市"
		remoteSearch={true}
		style={{ width: '100%' }}
	/>
</FormItem>
```

## 工作流程

1. **创建模式**：只调用 `handler` 获取选项列表
2. **编辑模式**：
   - 调用 `handler` 获取默认选项列表
   - 调用 `searchedById` 查询当前选中项的详细信息
   - 合并两个结果，确保选中项在列表开头且不重复
   - 返回合并后的完整选项列表

## 优势

1. **用户体验改善**：编辑模式下用户可以看到完整的选项列表
2. **向后兼容**：不影响现有的 `handler` 逻辑
3. **灵活性**：可以选择性地为需要此功能的字段添加 `searchedById` 配置
4. **错误处理**：`searchedById` 执行失败不会影响主流程

## 注意事项

1. `searchedById` 返回的数据格式应该与 `handler` 返回的数据格式一致
2. 合并逻辑会自动去重，基于 `id` 或 `value` 字段
3. 如果 `searchedById` 执行失败，会记录警告但不会影响主流程
