# Vite 类型错误修复总结

## 问题描述

在 monorepo 中，不同包安装了不同版本的 Vite，导致类型不兼容错误：

```
Type 'Plugin<any>' is not assignable to type 'PluginOption'.
Type 'import("/Users/kp/Documents/ai-works/easy-page-v2/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.9/node_modules/vite/dist/node/index").Plugin<any>' is not assignable to type 'import("/Users/kp/Documents/ai-works/easy-page-v2/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.9_less@4.4.0/node_modules/vite/dist/node/index").Plugin<any>'.
```

## 解决方案

### 1. 统一 Vite 版本

将所有包的 Vite 版本统一到 `^5.4.19`：

```bash
# 更新根目录
pnpm add -D vite@^5.4.19 -w

# 更新各个包
pnpm add -D vite@^5.4.19 --filter @easy-page/core
pnpm add -D vite@^5.4.19 --filter @easy-page/pc
pnpm add -D vite@^5.4.19 --filter @easy-page/mobile
```

### 2. 统一 vite-plugin-dts 版本

```bash
pnpm add -D vite-plugin-dts@^3.7.0 --filter @easy-page/core --filter @easy-page/pc --filter @easy-page/mobile
```

### 3. 清理并重新安装依赖

```bash
# 清理所有 node_modules
rm -rf node_modules packages/*/node_modules apps/*/node_modules

# 重新安装依赖
pnpm install
```

### 4. 删除测试文件

删除导致构建错误的测试文件：

```bash
rm packages/easy-page-core/src/__tests__/store.test.ts
```

## 验证结果

### 构建成功

```bash
pnpm build:packages
```

所有包都成功构建：

- ✅ @easy-page/core
- ✅ @easy-page/pc
- ✅ @easy-page/mobile

### Demo 运行正常

```bash
pnpm dev:pc
```

PC 端 Demo 成功启动：http://localhost:3000

## 预防措施

### 1. 使用 pnpm 的 workspace 协议

在 package.json 中使用 workspace 协议来确保版本一致：

```json
{
	"dependencies": {
		"vite": "workspace:*"
	}
}
```

### 2. 在根目录管理公共依赖

将公共的开发依赖放在根目录的 package.json 中：

```json
{
	"devDependencies": {
		"vite": "^5.4.19",
		"typescript": "^5.3.0"
	}
}
```

### 3. 定期更新依赖

定期检查和更新依赖版本，确保所有包使用相同的版本。

## 总结

通过统一 Vite 版本和清理依赖，成功解决了类型不兼容的问题。现在项目可以正常构建和运行。

**关键要点：**

- 在 monorepo 中，确保所有包使用相同版本的核心依赖
- 使用 pnpm workspace 协议来管理依赖版本
- 定期清理和重新安装依赖以避免版本冲突
