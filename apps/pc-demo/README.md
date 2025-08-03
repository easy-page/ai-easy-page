# Easy Page PC 端 Demo

这是 Easy Page 表单框架的 PC 端演示项目，展示了从基础使用到高级功能的完整示例。

## 项目结构

```
src/
├── demos/                    # Demo 组件目录
│   ├── index.tsx            # Demo 展示页面
│   ├── BasicFormDemo.tsx    # 基础表单 Demo
│   ├── FieldFeaturesDemo.tsx # 字段特性 Demo
│   ├── FieldLinkageDemo.tsx # 字段联动 Demo
│   ├── ExternalStateDemo.tsx # 外部状态 Demo
│   ├── FormDisabledDemo.tsx # 表单禁用状态 Demo
│   ├── DynamicFormDemo.tsx  # 动态表单 Demo
│   └── LinkageValidationDemo.tsx # 联动验证 Demo
├── App.tsx                  # 主应用组件
└── main.tsx                 # 应用入口
```

## Demo 说明

### 1. 基础表单 (BasicFormDemo)

- **功能**: 展示所有基本组件的基础使用
- **包含**: Input、Select 等组件的简单用法
- **特点**: 基础的表单验证和提交功能

### 2. 字段特性 (FieldFeaturesDemo)

- **功能**: 展示字段的完整内容
- **包含**: label、id、validate、extra、tips、required 等属性
- **特点**: extra 和 tips 根据其他字段变化展示联动文字

### 3. 字段联动 (FieldLinkageDemo)

- **功能**: 展示字段联动使用
- **包含**: effects 和 actions 的使用
- **特点**: 实现级联选择和数据联动

### 4. 外部状态 (ExternalStateDemo)

- **功能**: 展示外部状态影响内部字段值
- **包含**: useExternalStateListener 的使用
- **特点**: 监听外部状态变化并更新表单字段

### 5. 禁用状态 (FormDisabledDemo)

- **功能**: 展示表单的 disabled 状态控制
- **包含**: 根据外部状态变化控制表单编辑态
- **特点**: 支持创建、编辑、查看不同模式

### 6. 动态表单 (DynamicFormDemo)

- **功能**: 展示动态表单的使用
- **包含**: 动态添加和删除表单行
- **特点**: 支持灵活的表单行配置

### 7. 联动验证 (LinkageValidationDemo)

- **功能**: 展示联动验证的使用
- **包含**: 字段间的相互验证逻辑
- **特点**: 实现复杂的验证规则

## 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 技术栈

- React 18
- TypeScript
- Ant Design
- Vite
- Easy Page Core
- Easy Page PC

## 开发说明

每个 Demo 都是独立的组件，可以单独查看和测试。Demo 展示页面使用 Tabs 组件组织，方便切换不同的示例。

所有 Demo 都包含了详细的功能说明和使用示例，可以作为 Easy Page 框架的使用参考。
