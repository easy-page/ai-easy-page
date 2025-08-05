# FormMode 组件

## 功能描述

FormMode 组件是一个表单配置界面，提供了可视化的表单结构编辑功能。

## 主要特性

### 1. 左侧节点树 (NodeTree)

- 显示表单的节点树结构
- 支持选择节点进行配置
- 每个节点都有添加和删除按钮
- 树形结构展示父子关系

### 2. 右侧属性面板 (PropertyPanel)

- 根据选中的节点显示对应的配置项
- 支持不同类型的属性编辑：
  - 普通属性：使用表单控件
  - 函数属性：使用代码编辑器
  - React 节点属性：使用 JSX 编辑器
- 提供 AI 编辑按钮（功能待实现）

### 3. 表单属性配置

当选中 "form" 节点时，可以配置：

- 初始值 (initialValues)
- 表单模式 (mode)
- 提交处理函数 (onSubmit)
- 值变化处理函数 (onValuesChange)
- 加载组件 (loadingComponent)

### 4. 组件属性配置

当选中子组件节点时，可以配置：

- 组件类型 (type)
- 组件属性 (props)

## 组件结构

```
FormMode/
├── index.tsx          # 主组件
├── NodeTree.tsx       # 节点树组件
├── PropertyPanel.tsx  # 属性面板组件
├── MonacoEditor.tsx   # 代码编辑器组件
├── index.less         # 样式文件
└── README.md          # 说明文档
```

## 使用方式

```tsx
<FormMode schema={formSchema} onBack={handleBack} onImport={handleImport} />
```

## 样式特点

- 采用科技感深色主题
- 使用渐变背景和网格效果
- 卡片式布局，带有毛玻璃效果
- 青色主题色，符合项目整体风格

## 待实现功能

1. 添加节点功能
2. 删除节点功能
3. AI 编辑功能
4. 导入配置功能
5. 导出配置功能

## 技术栈

- React + TypeScript
- Ant Design 组件库
- Less 样式预处理器
- Monaco Editor (代码编辑)
