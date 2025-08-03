#!/bin/bash

echo "🚀 开始构建所有包..."

# 构建核心包
echo "📦 构建 @easy-page/core..."
pnpm --filter @easy-page/core build

# 构建 PC 端组件包
echo "📦 构建 @easy-page/pc..."
pnpm --filter @easy-page/pc build

# 构建移动端组件包
echo "📦 构建 @easy-page/mobile..."
pnpm --filter @easy-page/mobile build

echo "✅ 所有包构建完成！"
echo ""
echo "🎯 现在可以启动 Demo 应用："
echo "  PC 端: pnpm --filter @easy-page/pc-demo dev"
echo "  移动端: pnpm --filter @easy-page/mobile-demo dev" 