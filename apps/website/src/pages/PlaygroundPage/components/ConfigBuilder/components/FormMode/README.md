# 组件选项管理系统

## 概述

组件选项管理系统用于控制哪些组件可以使用 FormItem 包裹，哪些组件不能使用 FormItem 包裹。这个系统通过配置文件来管理组件的 FormItem 使用权限。

## 功能特性

### 1. 自动控制 FormItem 选项

- 当选择不能使用 FormItem 的组件时，FormItem 选项会自动取消勾选并禁用
- 当选择可以使用 FormItem 的组件时，FormItem 选项会恢复正常状态

### 2. 组件描述和说明

- 每个组件都有详细的描述信息
- 对于不能使用 FormItem 的组件，会显示特殊说明

### 3. 配置化管理

- 所有组件配置都在`ComponentConfig.ts`文件中统一管理
- 易于扩展和维护

## 当前配置

### 可以使用 FormItem 的组件

- Input (输入框)
- Select (下拉选择)
- Checkbox (复选框)
- CheckboxGroup (复选框组)
- Radio (单选框)
- RadioGroup (单选框组)
- TextArea (文本域)
- DatePicker (日期选择器)
- DateRangePicker (日期范围选择器)
- TimePicker (时间选择器)
- Custom (自定义组件)

### 不能使用 FormItem 的组件

- Container (容器组件)
  - 原因：容器组件本身就是一个布局组件，不需要 FormItem 包裹
- DynamicForm (动态表单组件)
  - 原因：动态表单组件内部已经包含了表单逻辑，不能使用 FormItem 包裹

## 使用方法

### 1. 添加新组件配置

在`ComponentConfig.ts`文件中添加新的组件配置：

```typescript
[ComponentType.NEW_COMPONENT]: {
    canUseFormItem: true, // 或 false
    description: '组件描述',
    note: '特殊说明（可选）',
},
```

### 2. 修改现有组件配置

直接修改`ComponentConfig.ts`文件中对应组件的配置：

```typescript
[ComponentType.EXISTING_COMPONENT]: {
    canUseFormItem: false, // 修改为false
    description: '更新后的描述',
    note: '新增的特殊说明',
},
```

### 3. 在代码中使用

```typescript
import { canUseFormItem, getComponentConfig } from './ComponentConfig';

// 检查组件是否可以使用FormItem
const canUse = canUseFormItem(ComponentType.DYNAMIC_FORM); // false

// 获取组件完整配置
const config = getComponentConfig(ComponentType.DYNAMIC_FORM);
console.log(config.description); // "动态表单组件，用于创建可动态添加/删除行的表单"
```

## 界面效果

### 选择可以使用 FormItem 的组件时

- FormItem 开关正常可用
- 显示正常的说明文字
- 可以自由切换 FormItem 选项

### 选择不能使用 FormItem 的组件时

- FormItem 开关自动取消勾选并禁用
- 显示红色的警告文字
- 显示特殊说明

## 扩展说明

### 添加新的组件类型

1. 在`ComponentTypes.ts`中的`ComponentType`枚举中添加新类型
2. 在`ComponentTypeOptions`数组中添加选项
3. 在`ComponentDisplayNames`中添加显示名称
4. 在`ComponentConfig.ts`中添加配置
5. 在`getDefaultComponentProps`函数中添加默认属性

### 修改组件行为

如果需要修改某个组件的 FormItem 使用行为，只需要修改`ComponentConfig.ts`中对应组件的`canUseFormItem`属性即可。

## 注意事项

1. 所有不能使用 FormItem 的组件都应该在配置中明确标注
2. 组件的描述信息应该准确反映组件的功能
3. 特殊说明应该解释为什么该组件不能使用 FormItem
4. 新增组件时应该仔细考虑是否需要 FormItem 包裹
