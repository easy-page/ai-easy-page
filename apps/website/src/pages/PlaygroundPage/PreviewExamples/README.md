# PreviewExamples 组件示例

这个目录包含了所有组件的示例代码，用于在 Playground 中预览组件效果。

## 目录结构

每个组件都有一个独立的文件夹，文件夹名为组件名，包含一个 `index.tsx` 文件：

```
PreviewExamples/
├── Input/
│   └── index.tsx
├── Select/
│   └── index.tsx
├── Container/
│   └── index.tsx
├── Button/
│   └── index.tsx
└── ...
```

## 组件分类

### 表单组件

表单组件支持 `isFormComponent` 参数，当为 `true` 时会被 Form 和 FormItem 包裹，当为 `false` 时直接展示组件：

- Input
- Select
- Checkbox
- CheckboxGroup
- Radio
- RadioGroup
- TextArea
- DatePicker
- DateRangePicker
- TimePicker
- DynamicForm
- Tab
- Steps
- Drawer
- Switch
- InputNumber
- Slider
- Rate
- AutoComplete
- Cascader
- Transfer
- TreeSelect
- Container (需要 Form 包裹，但不需要 FormItem)

### 非表单组件

非表单组件直接展示组件效果，不需要表单包装：

- Button
- Icon
- Divider
- Alert
- Card
- Tag
- Badge
- Progress
- Spin
- Empty
- Result
- Container

## 使用方式

```tsx
import { getComponentExample, isFormComponent } from './PreviewExamples';

// 获取组件示例
const ComponentExample = getComponentExample('Input');

// 检查是否为表单组件
const isForm = isFormComponent('Input'); // true

// 渲染组件示例
<ComponentExample isFormComponent={isForm} />;
```

## 映射关系

组件示例与 componentMap.tsx 中的组件映射关系通过 `componentExamples` 对象维护，确保每个组件都有对应的示例。
