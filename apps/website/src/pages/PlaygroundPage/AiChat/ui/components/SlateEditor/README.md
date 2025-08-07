# SlateEditor 自定义编辑器组件

基于 Slate.js 构建的富文本编辑器组件，支持自定义元素，左侧按钮并且文本换行左对齐的聊天界面输入区域。

## 功能特性

- 每个元素左侧有"图像生成"按钮，为行内元素，包含左箭头图标
- 文字会自动换行，换行后文字与页面左侧边缘完全对齐
- 按钮的样式和位置与截图一致，不会影响文本整体布局
- 按回车键会创建新的自定义元素，保持相同的元素类型和样式
- 编辑器整体带有蓝色边框，视觉效果与截图一致

## 使用方法

```tsx
import { SlateEditor } from 'path/to/SlateEditor';
import { Descendant } from 'slate';

// 初始值（可选）
const initialValue: Descendant[] = [
	{
		type: 'custom-element',
		children: [{ text: '初始内容' }],
	},
];

// 在组件中使用
const MyComponent = () => {
	// 处理发送内容
	const handleSend = (value: Descendant[]) => {
		console.log('编辑器内容:', value);
		// 处理编辑器内容
	};

	return <SlateEditor initValue={initialValue} onSend={handleSend} />;
};
```

## 属性 (Props)

| 属性名    | 类型                          | 必需 | 默认值       | 描述                 |
| --------- | ----------------------------- | ---- | ------------ | -------------------- |
| initValue | Descendant[]                  | 否   | 空自定义元素 | 编辑器的初始内容     |
| onSend    | (value: Descendant[]) => void | 否   | -            | 发送内容时的回调函数 |

## 自定义元素详情

编辑器的自定义元素实现了以下特点：

- 按钮为行内元素，不使用绝对定位
- 左侧包含一个带左箭头图标的"图像生成"按钮
- 文字换行后与左侧边缘完全对齐，而不是与按钮对齐
- 整体布局与截图完全一致

## 回车键行为

编辑器对回车键行为进行了精确控制：

- 在行末按回车：创建一个新的空白自定义元素
- 在行中间按回车：将当前位置后的内容自动移动到新的自定义元素中

## 快捷键

编辑器支持以下快捷键：

- `Enter`: 在当前自定义元素下创建新的自定义元素
- `Ctrl+Enter`: 发送编辑器内容（触发 onSend 回调）

## 样式特点

- 编辑器整体有蓝色边框
- 自定义元素按钮为蓝色背景，带左箭头图标
- 按钮为行内元素，不影响文本布局
- 文本换行后与左侧边缘完全对齐
- 整体布局与截图完全一致

## 数据结构

Slate 编辑器使用特定的数据结构表示内容。基本结构如下：

```js
[
	{
		type: 'custom-element', // 自定义元素
		children: [{ text: '自定义元素中的内容' }],
	},
	{
		type: 'custom-element', // 又一个自定义元素
		children: [{ text: '另一个自定义元素中的内容' }],
	},
];
```

## 示例

请参考 `example.tsx` 获取完整的使用示例，其中展示了与截图相同的效果。
