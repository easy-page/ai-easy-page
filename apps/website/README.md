# Easy Page 官网

Easy Page 动态表单框架的官方网站，提供完整的文档和示例。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件**: Ant Design
- **路由**: React Router DOM
- **动画**: Framer Motion
- **样式**: Less
- **Markdown**: React Markdown
- **代码高亮**: React Syntax Highlighter

## 项目结构

```
src/
├── components/          # 通用组件
├── layouts/            # 布局组件
├── pages/              # 页面组件
│   ├── guide/          # 指南页面
│   └── ...
├── styles/             # 样式文件
├── utils/              # 工具函数
├── types/              # 类型定义
└── content/            # 内容文件
    ├── guide/          # 指南内容
    └── api/            # API 文档
```

## 开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 特性

- 🎨 科幻深色主题设计
- ✨ 流畅的动画效果
- 📱 响应式设计
- 📖 完整的文档系统
- 🔍 代码高亮显示
- 🚀 快速开发体验

## 页面结构

### 首页

- Hero 区域展示框架介绍
- 核心特性展示
- 快速开始引导

### 指南

- **核心概念**: 框架的基本概念和设计理念
- **基础**: 基本使用方法和常见场景
- **进阶**: 高级功能和自定义扩展

### API 文档

- 完整的 API 参考
- 类型定义
- 使用示例

## 样式系统

项目使用 CSS 变量定义主题色彩：

```css
:root {
	--primary-color: #00d4ff;
	--secondary-color: #7c3aed;
	--accent-color: #f59e0b;
	--background-dark: #0a0a0a;
	--background-light: #1a1a1a;
	--background-card: #1f1f1f;
	--text-primary: #ffffff;
	--text-secondary: #a0a0a0;
	--text-muted: #666666;
	--border-color: #333333;
	--border-hover: #00d4ff;
	--shadow-glow: 0 0 20px rgba(0, 212, 255, 0.3);
	--shadow-card: 0 4px 20px rgba(0, 0, 0, 0.5);
}
```

## 部署

项目可以部署到任何静态文件托管服务：

- Vercel
- Netlify
- GitHub Pages
- 阿里云 OSS
- 腾讯云 COS

## 贡献

欢迎提交 Issue 和 Pull Request 来改进官网。

## 许可证

MIT License

# 想法

创建应该分为：

- 表单：Form 、FormItem 包裹 , FormItem 通过属性提供上下文，完成对应操作。
- 页面：Page 包裹、PageItem 包裹，PageItem 通过属性提供上下文，完成对应操作，只有有需要的组件可以进行包裹。
- 组件：组件除了上述可以封装外，还需要外部透传属性，作为上下文，并被包裹进去。
