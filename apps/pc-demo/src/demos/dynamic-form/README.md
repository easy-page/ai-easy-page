# DynamicForm Demo 文件结构

这个文件夹包含了 DynamicForm 组件的各种使用示例，每个示例都独立成文件，便于维护和理解。

## 文件说明

### 主要文件

- `index.tsx` - 主入口文件，整合所有子 demo
- `README.md` - 本说明文件

### 子 Demo 文件

- `TabLayoutDemo.tsx` - Tab 布局示例

  - 展示如何使用`containerType="tab"`创建标签页形式的动态表单
  - 演示`rowIndexs`和`restAll`配置的使用

- `TableLayoutDemo.tsx` - 表格布局示例

  - 展示如何使用`containerType="table"`创建表格形式的动态表单
  - 演示自动生成表格列和操作列的功能

- `CustomContainerDemo.tsx` - 自定义容器示例

  - 展示如何使用`customContainer`属性完全自定义容器渲染
  - 演示灵活布局和样式定制的功能

- `SubsidyTierDemo.tsx` - 商家补贴阶梯配置示例
  - 展示复杂的业务场景应用
  - 演示自定义验证逻辑和复杂布局的实现

## 使用方法

在主应用中，只需要导入主入口文件：

```tsx
import DynamicFormDemo from './demos/dynamic-form';
```

或者单独导入某个子 demo：

```tsx
import TabLayoutDemo from './demos/dynamic-form/TabLayoutDemo';
```

## 功能特点

每个子 demo 都展示了 DynamicForm 组件的不同特性：

1. **多种布局方式** - Tab、表格、自定义容器
2. **灵活的配置** - 行配置、字段配置、验证配置
3. **状态管理** - 自动处理添加、删除、验证等状态
4. **数据同步** - 与 Form 组件完美集成
5. **业务场景** - 实际业务需求的应用示例

## 维护说明

- 每个子 demo 都是独立的，可以单独修改和测试
- 新增 demo 时，记得在`index.tsx`中导入并添加到主组件中
- 保持每个 demo 的功能单一，便于理解和维护
