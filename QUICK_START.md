# Easy Page 表单框架 - 快速开始

## 🚀 快速启动

### 1. 安装依赖

```bash
pnpm install
```

### 2. 构建所有包

```bash
# 方法一：使用脚本（推荐）
pnpm build:packages

# 方法二：手动构建
pnpm build:core
pnpm build:pc
pnpm build:mobile

# 方法三：构建所有项目
pnpm build
```

### 3. 启动 Demo 应用

```bash
# PC 端 Demo
pnpm dev:pc

# 移动端 Demo
pnpm dev:mobile

# 或者同时启动所有 Demo
pnpm dev
```

### 4. 访问应用

- PC 端 Demo: http://localhost:3000
- 移动端 Demo: http://localhost:3001

## 📦 包结构

```
packages/
├── easy-page-core/     # 核心包 - 表单逻辑和状态管理
├── easy-page-pc/       # PC 端组件 - 基于 Ant Design
└── easy-page-mobile/   # 移动端组件 - 基于 Ant Design Mobile

apps/
├── pc-demo/           # PC 端 Demo 应用
└── mobile-demo/       # 移动端 Demo 应用
```

## 🔧 开发工作流

### 修改核心包后

```bash
# 重新构建核心包
pnpm build:core

# 重新启动 Demo
pnpm dev:pc
```

### 修改组件包后

```bash
# 重新构建组件包
pnpm build:pc  # 或 pnpm build:mobile

# 重新启动 Demo
pnpm dev:pc
```

### 修改 Demo 应用后

```bash
# 直接启动即可，无需重新构建
pnpm dev:pc
```

## 🐛 常见问题

### Q: 为什么 apps 里的项目使用 packages 里的包会报错？

A: 这是因为 packages 里的包需要先构建。请按以下步骤操作：

1. 先构建所有包：`pnpm build:packages`
2. 再启动 Demo：`pnpm dev:pc`

### Q: 如何添加新的组件？

A: 在对应的组件包中添加新组件，然后：

1. 在 `src/components/` 目录下创建组件文件
2. 在 `src/index.ts` 中导出组件
3. 重新构建包：`pnpm build:pc` 或 `pnpm build:mobile`

### Q: 如何修改验证规则？

A: 在核心包的 `src/validator.ts` 中修改，然后：

1. 重新构建核心包：`pnpm build:core`
2. 重新启动 Demo：`pnpm dev:pc`

## 📝 开发建议

1. **开发时**：修改 Demo 应用代码后，保存即可看到效果
2. **修改包时**：修改包代码后，需要重新构建包
3. **调试时**：使用浏览器开发者工具查看控制台输出
4. **测试时**：在 Demo 应用中测试各种功能

## 🎯 下一步

- 查看 [USAGE.md](./USAGE.md) 了解详细使用示例
- 查看 [README.md](./README.md) 了解项目概述
- 查看 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) 了解项目总结
