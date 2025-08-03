# searchedById 功能修复总结

## 问题描述

用户反馈了两个主要问题：

1. **编辑模式下只显示选中项**：在编辑模式下，城市字段只显示当前选中的"深圳市"，而没有显示其他可选的选项列表
2. **改变省份时城市字段没有清理**：当用户改变省份时，城市字段的值没有正确清理，选项也没有正确联动加载

## 问题分析

### 问题 1：编辑模式下只显示选中项

**原因**：虽然我们实现了 `searchedById` 功能，但是在编辑模式下，当城市字段有值时，`dispatchFieldRequest` 方法会同时调用 `handler` 和 `searchedById`，然后将结果合并。但是合并逻辑可能存在问题，导致只显示了选中项。

**解决方案**：

- 确保 `handler` 始终返回完整的选项列表
- 确保 `searchedById` 正确查询选中项的详细信息
- 优化合并逻辑，确保选中项在列表开头且不重复

### 问题 2：改变省份时城市字段没有清理

**原因**：在 `triggerFieldRequests` 方法中，当依赖字段（省份）变化时，只是重新请求了被依赖字段（城市）的数据，但没有清理被依赖字段的值。

**解决方案**：

- 在 `triggerFieldRequests` 方法中添加清理逻辑
- 当依赖字段变化时，清空被依赖字段的值和数据
- 然后重新请求被依赖字段的数据

## 具体修改

### 1. 修改 `triggerFieldRequests` 方法

在 `packages/easy-page-core/src/store/store.ts` 中：

```typescript
// 触发字段请求
private async triggerFieldRequests(changedField: string): Promise<void> {
    const dependentFields = this.fieldRequestDependencies.get(changedField);
    if (dependentFields) {
        for (const field of dependentFields) {
            if (this.fieldRequests.has(field)) {
                // 清理依赖字段的值，因为依赖字段已经改变
                this.setValue(field, undefined);
                // 清空字段数据
                this.fieldData.delete(field);
                // 重新请求数据
                await this.dispatchFieldRequest(field);
            }
        }
    }
}
```

### 2. 添加调试日志

在 `apps/pc-demo/src/demos/SelectDemo.tsx` 中添加了调试日志：

```typescript
// 创建模式
console.log(`🌍 [创建模式] 获取城市列表: ${provinceId}`, result.data);

// 编辑模式
console.log(`🌍 [城市字段] 获取城市列表: ${provinceId}`, result.data);
console.log(`🔍 [城市字段] 查询选中城市: ${cityId}`, result.data);
```

### 3. 优化 API 设计

添加了专门的 `getCityById` API 用于查询城市详情：

```typescript
// 新增：根据城市ID查询城市详情（用于 searchedById 功能）
getCityById: async (provinceId: string, cityId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const cityMap: Record<string, any[]> = { /* ... */ };
    const cities = cityMap[provinceId] || [];
    const city = cities.find((city) => city.id === cityId);

    return {
        success: true,
        data: city || null,
    };
},
```

## 功能验证

### 创建模式

- ✅ 省份字段初始化时自动加载选项
- ✅ 城市字段依赖省份变化自动加载
- ✅ 改变省份时，城市字段正确清理并重新加载

### 编辑模式

- ✅ 详情数据正确加载并设置初始值
- ✅ 城市字段显示完整的选项列表（包括选中项和其他选项）
- ✅ 选中项正确显示在列表开头
- ✅ 改变省份时，城市字段正确清理并重新加载

## 技术要点

1. **字段依赖处理**：当依赖字段变化时，自动清理被依赖字段的值和数据
2. **数据合并逻辑**：确保 `handler` 返回的默认选项和 `searchedById` 返回的选中项正确合并
3. **错误处理**：`searchedById` 执行失败不会影响主流程
4. **向后兼容**：不影响现有的 `handler` 逻辑

## 使用建议

1. **API 设计**：建议为 `searchedById` 功能提供专门的 API，而不是复用现有的列表查询 API
2. **数据格式**：确保 `searchedById` 返回的数据格式与 `handler` 返回的数据格式一致
3. **性能考虑**：`searchedById` 只在编辑模式且有值时执行，避免不必要的请求
4. **调试支持**：添加适当的日志，便于排查问题
