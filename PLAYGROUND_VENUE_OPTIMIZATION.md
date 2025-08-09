# Playground 会场选择流程优化

## 优化概述

本次优化主要针对 playground 页面的会场选择流程进行了重构，将原本在 ConfigBuilder 组件中的创建选择逻辑前置到进入 playground 页面时，提升了用户体验。

## 主要变更

### 1. 新增会场选择弹窗组件

**文件**: `apps/website/src/pages/PlaygroundPage/components/VenueSelectionModal/index.tsx`

**功能**:

- 提供创建新会场和选择已有会场的两个标签页
- 支持会场名称和描述的搜索功能
- 集成会场创建和选择的完整流程
- 创建或选择成功后自动跳转到 playground 页面并带上 venueId 参数

**特性**:

- 响应式设计，支持移动端
- 实时搜索会场列表
- 优雅的加载状态和错误处理
- 支持表单页面和完整页面两种类型选择

### 2. 重构 PlaygroundPage 主页面

**文件**: `apps/website/src/pages/PlaygroundPage/index.tsx`

**主要变更**:

- 添加会场检查和弹窗逻辑
- 在进入 playground 时检查 URL 参数中的 venueId
- 如果没有 venueId 参数，自动弹出会场选择弹窗
- 如果有 venueId 参数，自动加载对应的会场信息
- 集成 ChatService 和全局状态管理

**新增功能**:

- 自动加载会场详情
- 会场信息与页面 schema 的关联
- 加载状态显示
- 错误处理和降级策略

### 3. 简化 ConfigBuilder 组件

**文件**: `apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/index.tsx`

**优化内容**:

- 移除原有的 SelectMode 组件和创建选择逻辑
- 直接进入表单配置模式
- 添加切换到页面模式的功能
- 简化组件状态管理

### 4. 增强 FormMode 组件

**文件**: `apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/index.tsx`

**新增功能**:

- 添加 `onSwitchToPage` 属性
- 在头部操作栏添加"切换到页面模式"按钮
- 保持与现有功能的兼容性

## 技术实现

### 状态管理

使用 ChatService 的全局状态管理：

```typescript
const chatService = useService(ChatService);
const curVenue = useObservable(chatService.globalState.curVenue$, null);
```

### 路由参数处理

使用 `getQueryString` 工具函数获取 URL 参数：

```typescript
const venueId = getQueryString('venueId');
```

### 路由跳转

使用 `appendParamsToUrl` 工具函数添加参数到 URL：

```typescript
const playgroundUrl = appendParamsToUrl('/playground', {
	venueId: response.data.id,
});
navigate(playgroundUrl);
```

### API 集成

集成会场相关的 API：

- `createVenue`: 创建新会场
- `queryVenues`: 查询会场列表
- `getVenueDetail`: 获取会场详情

## 用户体验改进

### 1. 流程简化

**优化前**:

1. 进入 playground 页面
2. 看到配置搭建界面
3. 点击"创建表单"或"创建页面"
4. 开始配置

**优化后**:

1. 进入 playground 页面
2. 自动弹出会场选择弹窗
3. 选择创建新会场或选择已有会场
4. 直接进入配置界面

### 2. 状态持久化

- 会场信息通过 URL 参数持久化
- 支持直接访问特定会场的 playground 页面
- 刷新页面不会丢失会场上下文

### 3. 错误处理

- 会场不存在时自动显示选择弹窗
- 网络错误时的友好提示
- 加载状态的清晰反馈

## 样式优化

### 新增样式文件

**文件**: `apps/website/src/pages/PlaygroundPage/components/VenueSelectionModal/index.less`

**特性**:

- 响应式设计
- 平滑的动画效果
- 一致的视觉风格
- 良好的交互反馈

## 兼容性考虑

### 向后兼容

- 保持现有 API 接口不变
- 现有组件接口保持兼容
- 渐进式升级，不影响现有功能

### 错误降级

- 如果会场加载失败，自动显示选择弹窗
- 如果 API 调用失败，提供友好的错误提示
- 支持离线状态下的基本功能

## 后续优化建议

### 1. 性能优化

- 实现会场列表的虚拟滚动
- 添加会场信息的缓存机制
- 优化搜索功能的防抖处理

### 2. 功能增强

- 支持会场的批量操作
- 添加会场的分类和标签功能
- 实现会场的导入/导出功能

### 3. 用户体验

- 添加会场选择的快捷键支持
- 实现会场的拖拽排序
- 添加会场的预览功能

## 总结

本次优化成功地将会场选择流程前置，简化了用户操作步骤，提升了整体用户体验。通过合理的状态管理和错误处理，确保了功能的稳定性和可靠性。同时保持了良好的代码结构和可维护性，为后续的功能扩展奠定了坚实的基础。






