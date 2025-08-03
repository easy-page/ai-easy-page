# Easy Page 演示系统

这个目录包含了 Easy Page 框架的各种功能演示，每个演示都是独立的组件，展示了框架的核心特性。

## 演示列表

### 1. DynamicFormDemo.tsx - 强大的动态表单

- 展示动态表单的表格布局
- 支持动态添加删除表单行
- 包含完整的表单验证
- 演示数据提交和结果展示

### 2. LinkageDemo.tsx - 超强联动能力

- 展示字段间的联动效果
- Effects 和 Actions 机制演示
- 多级联动和异步数据处理
- 省市区级联选择示例

### 3. StateManagementDemo.tsx - 统一状态管理

- 基于 MobX 的响应式状态管理
- 初始化请求和依赖管理
- 表单状态同步演示
- 权限联动加载示例

### 4. PerformanceDemo.tsx - 高性能精准渲染

- 性能监控和指标展示
- 渲染次数和更新时间统计
- 内存使用情况模拟
- 性能优化特性说明

### 5. ExtensibilityDemo.tsx - 超强扩展性

- 多平台适配展示
- PC 端和移动端组件库适配
- 自定义验证器扩展
- 插件化设计理念

### 6. StateControlDemo.tsx - 灵活状态控制

- 全局禁用状态控制
- 字段级别状态管理
- 外部状态联动演示
- 业务场景适配示例

### 7. ConfigModeDemo.tsx - 开发配置双模式

- JSX 声明式开发模式
- JSON 配置驱动模式
- 两种模式的对比和使用建议
- 动态配置下发演示

### 8. VisibilityControlDemo.tsx - 智能显隐控制

- When 组件条件显示
- 多种显示条件组合
- 动态字段显隐效果
- 性能优化的显隐机制

## 使用方式

### 在 FrameworkFeatures 中使用

```tsx
import {
	DynamicFormDemo,
	LinkageDemo,
	StateManagementDemo,
	// ... 其他演示组件
} from '../../../demos';

// 在组件中使用
<DemoContainer
	title="演示标题"
	description="演示描述"
	sourceCode={getDemoSourceCode('demo-key')}
	sourceFile="DemoComponent.tsx"
	githubUrl="https://github.com/..."
	highlights={['特性1', '特性2']}
>
	<DynamicFormDemo />
</DemoContainer>;
```

### 独立使用

每个演示组件都可以独立使用：

```tsx
import { DynamicFormDemo } from './demos/DynamicFormDemo';

function MyPage() {
	return (
		<div>
			<h1>动态表单演示</h1>
			<DynamicFormDemo />
		</div>
	);
}
```

## 开发指南

### 添加新的演示

1. 在 `demos` 目录下创建新的演示组件文件
2. 实现演示功能，包含完整的交互和说明
3. 在 `demos/index.tsx` 中导出新组件
4. 在 `FrameworkFeatures.tsx` 中添加对应的配置
5. 在 `getDemoSourceCode` 函数中添加源代码

### 演示组件规范

- 每个演示应该是完整的、可运行的示例
- 包含必要的说明文字和功能介绍
- 提供交互功能，让用户能够体验特性
- 代码结构清晰，便于理解和学习
- 包含错误处理和边界情况

### 样式规范

- 使用统一的卡片布局和间距
- 保持与整体设计风格一致
- 响应式设计，适配不同屏幕尺寸
- 合理使用颜色和图标

## 技术实现

### DemoContainer 组件

`DemoContainer` 是演示系统的核心组件，提供了：

- 运行效果和源代码的切换展示
- GitHub 源码链接
- 核心特性高亮显示
- 统一的样式和布局

### 源码管理

- 源码通过 `getDemoSourceCode` 函数管理
- 支持语法高亮显示
- 可以链接到 GitHub 查看完整源码
- 支持复制代码功能

### 响应式设计

- 左右布局在大屏幕上展示
- 小屏幕自动切换为上下布局
- 代码区域支持横向滚动
- 适配移动端操作

## 维护说明

- 定期更新演示内容，保持与框架版本同步
- 修复发现的 bug 和问题
- 根据用户反馈优化演示效果
- 添加新功能的演示示例
