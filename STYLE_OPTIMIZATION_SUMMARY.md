# 样式优化总结

## 问题描述

发现 `ConfigBuilder` 相关组件中存在大量重复的样式定义，主要集中在：

- `apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/index.less`
- `apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/index.less`

## 重复的样式类型

1. **按钮样式** - `.ant-btn` 相关样式重复定义
2. **文字样式** - `.ant-typography` 相关样式重复定义
3. **卡片样式** - `.ant-card` 相关样式重复定义
4. **分割线样式** - `.ant-divider` 相关样式重复定义
5. **配置头部样式** - `.config-header` 重复定义

## 优化方案

### 1. 重构父级样式文件 (`ConfigBuilder/index.less`)

- 提取公共样式到父级作用域
- 定义全局的按钮、文字、卡片、分割线样式
- 保留 SelectMode 特有的样式

### 2. 清理子组件样式文件 (`FormMode/index.less`)

- 移除与父级重复的样式定义
- 保留 FormMode 特有的样式（如树节点样式）
- 对于需要覆盖的样式，使用 `!important` 确保优先级

## 优化后的样式结构

### 公共样式（父级）

```less
.config-builder {
	// 公共按钮样式
	.ant-btn {
		...;
	}

	// 公共文字样式
	.ant-typography {
		...;
	}

	// 公共卡片样式
	.ant-card {
		...;
	}

	// 公共分割线样式
	.ant-divider {
		...;
	}
}
```

### 组件特有样式（子级）

- **SelectMode**: 选项卡片、配置提示等特有样式
- **FormMode**: 树节点、配置面板等特有样式

## 优化效果

1. **减少代码重复** - 消除了大量重复的样式定义
2. **提高维护性** - 公共样式集中管理，修改更方便
3. **保持样式一致性** - 确保所有组件使用相同的设计规范
4. **提高性能** - 减少 CSS 文件大小，提高加载速度

## 注意事项

- 使用 `!important` 确保子组件样式覆盖优先级
- 保持样式的语义化命名
- 确保样式的作用域正确，避免样式污染
