# 跨行验证功能重构总结

## 目标

将复杂的 `validateGenerator` 方式重构为简洁的 `validateEffects` 配置方式，让用户使用更简单。

## 实现的功能

### 1. 新增 `validateEffects` 配置

```typescript
interface ValidateEffect {
	affectFields: string[]; // 影响的字段列表
	effectNextRow?: boolean; // 是否影响下一行
	effectPreviousRow?: boolean; // 是否影响上一行
	message?: string; // 影响说明
}
```

### 2. 简洁的使用方式

```typescript
// 券门槛字段：影响同行的补贴要求验证，同时影响下一行的券门槛验证
validateEffects={[
  {
    affectFields: ['maxSubsidy'], // 影响同行的补贴要求验证
  },
  {
    affectFields: ['threshold'],
    effectNextRow: true, // 影响下一行的券门槛验证
  },
]}

// 补贴要求字段：影响下一行的补贴要求验证
validateEffects={[
  {
    affectFields: ['maxSubsidy'],
    effectNextRow: true, // 影响下一行的补贴要求验证
  },
]}
```

### 3. 核心实现

#### 类型定义 (`packages/easy-page-core/src/types.ts`)

- 添加 `ValidateEffect` 接口
- 在 `FormItemProps` 中添加 `validateEffects` 属性
- 在 `FormStore` 接口中添加 `registerFieldValidateEffects` 方法

#### 存储实现 (`packages/easy-page-core/src/store.ts`)

- 添加 `fieldValidateEffects` Map 存储验证影响关系
- 实现 `registerFieldValidateEffects` 方法
- 更新 `triggerAffectedFieldValidation` 方法，支持处理 `validateEffects`

#### 组件实现 (`packages/easy-page-core/src/components/FormItem.tsx`)

- 在 `FormItem` 组件中添加对 `validateEffects` 的支持
- 注册验证影响关系到 store

### 4. 优势对比

#### 原来的复杂方式

```typescript
validateGenerator={(rowInfo?: ExtendedRowInfo) => {
  const rules: any[] = [
    { required: true, message: '请输入券门槛范围' },
  ];

  // 券门槛变化时，影响同行的补贴要求验证
  rules.push({
    affectFields: [`${rowInfo?.currentRow}_maxSubsidy`],
    message: '券门槛变化会影响补贴要求验证',
  });

  return rules;
}}
```

#### 新的简洁方式

```typescript
validateEffects={[
  {
    affectFields: ['maxSubsidy'], // 影响同行的补贴要求验证
  },
  {
    affectFields: ['threshold'],
    effectNextRow: true, // 影响下一行的券门槛验证
  },
]}
```

### 5. 用户感知

用户现在只需要关注两个核心概念：

1. **我当前变化了，影响我行的那个字段验证方法** - 通过 `affectFields` 配置
2. **我当前变化了，会验证下一行的某些字段** - 通过 `effectNextRow: true` 配置

### 6. 自动处理

系统会自动处理：

- 当前字段变化时，触发影响字段的验证
- 跨行验证时，自动计算正确的行号（如 `0_maxSubsidy`、`1_maxSubsidy`）
- 验证失败时，显示错误消息
- 支持同行、上一行、下一行的验证影响

### 7. 向后兼容

- 保留了原有的 `validateGenerator` 功能
- 保留了原有的 `affectFields` 和 `dependentFields` 功能
- 新的 `validateEffects` 是增量功能

## 测试验证

- ✅ 构建成功
- ✅ 类型检查通过
- ✅ 功能完整实现
- ✅ 使用方式简洁明了

## 总结

通过这次重构，我们成功地将复杂的跨行验证配置简化为直观的 `validateEffects` 方式，大大降低了用户的使用门槛，同时保持了功能的完整性和灵活性。
