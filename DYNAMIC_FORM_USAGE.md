# DynamicForm 动态表单组件使用指南

## 概述

DynamicForm 是一个灵活的动态表单组件，支持多种布局方式（Tab、表格、自定义容器），可以动态添加和删除表单行，与 @easy-page/core 的表单框架完美集成。

## 主要特性

- 🎯 **多种布局**: 支持 Tab、表格、自定义容器等多种布局方式
- 🔄 **动态操作**: 支持动态添加、删除表单行
- 📊 **行数限制**: 支持设置最大和最小行数限制
- 🎨 **完全自定义**: 支持完全自定义容器渲染方式
- 🔗 **表单集成**: 与 Form、FormItem 等组件完美集成
- ✅ **验证支持**: 支持完整的表单验证功能
- 🏷️ **字段唯一性**: 自动处理字段的唯一性标识

## 基础用法

### 1. Tab 布局

```tsx
import { Form, FormItem } from '@easy-page/core';
import { DynamicForm, Input, TextArea, InputNumber } from '@easy-page/pc';

<Form
	initialValues={{
		baseInfos: [
			{
				name: '张三',
				desc: '这是第一个用户',
				age: 25,
			},
		],
	}}
	onSubmit={handleSubmit}
>
	<DynamicForm
		id="baseInfos"
		maxRow={4}
		minRow={1}
		containerType="tab"
		rows={[
			{
				rowIndexs: [1, 2], // 第1、2行使用这个配置
				fields: [
					<FormItem
						id="name"
						label="姓名"
						required
						validate={[{ required: true, message: '请输入姓名' }]}
					>
						<Input placeholder="请输入姓名" />
					</FormItem>,
					<FormItem id="desc" label="描述">
						<TextArea placeholder="请输入描述" />
					</FormItem>,
				],
			},
			{
				rowIndexs: [3], // 第3行使用这个配置
				restAll: true, // 剩余所有行都使用这个配置
				fields: [
					<FormItem
						id="age"
						label="年龄"
						validate={[{ min: 1, max: 120, message: '年龄必须在1-120之间' }]}
					>
						<InputNumber
							min={1}
							max={120}
							placeholder="请输入年龄"
							style={{ width: '100%' }}
						/>
					</FormItem>,
				],
			},
		]}
	/>
</Form>;
```

### 2. 表格布局

```tsx
<DynamicForm
	id="userInfos"
	maxRow={5}
	minRow={1}
	containerType="table"
	rows={[
		{
			rowIndexs: [1, 2, 3, 4, 5], // 所有行都使用相同配置
			fields: [
				<FormItem
					id="name"
					label="姓名"
					required
					validate={[{ required: true, message: '请输入姓名' }]}
				>
					<Input placeholder="请输入姓名" />
				</FormItem>,
				<FormItem
					id="email"
					label="邮箱"
					validate={[
						{
							pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: '邮箱格式不正确',
						},
					]}
				>
					<Input placeholder="请输入邮箱" />
				</FormItem>,
				<FormItem id="role" label="角色">
					<Select
						placeholder="请选择角色"
						options={[
							{ label: '管理员', value: 'admin' },
							{ label: '用户', value: 'user' },
							{ label: '访客', value: 'guest' },
						]}
					/>
				</FormItem>,
			],
		},
	]}
/>
```

### 3. 自定义容器

```tsx
<DynamicForm
	id="customInfos"
	maxRow={3}
	minRow={1}
	customContainer={({
		onAdd,
		onDelete,
		value,
		canAdd,
		canDelete,
		renderFields,
	}) => {
		return (
			<div>
				{value.map((_, index) => (
					<div
						key={index}
						style={{
							border: '1px solid #d9d9d9',
							borderRadius: '6px',
							padding: '16px',
							marginBottom: '16px',
							backgroundColor: '#fafafa',
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '12px',
							}}
						>
							<h4 style={{ margin: 0 }}>自定义表单 {index + 1}</h4>
							{canDelete(index) && (
								<Button
									type="text"
									danger
									size="small"
									onClick={() => onDelete(index)}
								>
									删除
								</Button>
							)}
						</div>
						<div style={{ display: 'flex', gap: '16px' }}>
							{renderFields(index, <div style={{ flex: 1 }} />)}
						</div>
					</div>
				))}
				{canAdd && (
					<div style={{ textAlign: 'center' }}>
						<Button type="dashed" onClick={onAdd}>
							添加自定义表单
						</Button>
					</div>
				)}
			</div>
		);
	}}
	rows={[
		{
			rowIndexs: [1, 2, 3],
			fields: [
				<FormItem
					id="title"
					label="标题"
					required
					validate={[{ required: true, message: '请输入标题' }]}
				>
					<Input placeholder="请输入标题" />
				</FormItem>,
				<FormItem id="content" label="内容">
					<TextArea placeholder="请输入内容" />
				</FormItem>,
			],
		},
	]}
/>
```

## API 参考

### DynamicFormProps

| 属性            | 类型             | 默认值 | 说明                     |
| --------------- | ---------------- | ------ | ------------------------ |
| id              | string           | -      | 表单数据存储的 key，必填 |
| maxRow          | number           | 10     | 最大行数                 |
| minRow          | number           | 1      | 最小行数                 |
| containerType   | 'tab' \| 'table' | 'tab'  | 容器类型                 |
| customContainer | function         | -      | 自定义容器渲染函数       |
| rows            | DynamicFormRow[] | -      | 行配置，必填             |
| store           | FormStore        | -      | 表单 store               |
| style           | CSSProperties    | -      | 容器样式                 |
| className       | string           | -      | 容器类名                 |

### DynamicFormRow

| 属性      | 类型        | 说明                     |
| --------- | ----------- | ------------------------ |
| rowIndexs | number[]    | 指定哪些行使用这个配置   |
| restAll   | boolean     | 剩余所有行都使用这个配置 |
| fields    | ReactNode[] | 表单字段数组             |

### customContainer 函数参数

| 参数         | 类型                                                            | 说明                   |
| ------------ | --------------------------------------------------------------- | ---------------------- |
| onAdd        | () => void                                                      | 添加行的函数           |
| onDelete     | (index: number) => void                                         | 删除行的函数           |
| value        | any[]                                                           | 当前表单数据           |
| canAdd       | boolean                                                         | 是否可以添加           |
| canDelete    | (index: number) => boolean                                      | 判断是否可以删除的函数 |
| rows         | DynamicFormRow[]                                                | 行配置                 |
| store        | FormStore                                                       | 表单 store             |
| renderFields | (index: number, container?: React.ReactNode) => React.ReactNode | 渲染字段的辅助函数     |

## 数据格式

DynamicForm 组件会将数据存储为数组格式：

```javascript
{
	baseInfos: [
		{
			name: '张三',
			desc: '这是第一个用户',
			age: 25,
		},
		{
			name: '李四',
			desc: '这是第二个用户',
			age: 30,
		},
	];
}
```

## 字段唯一性

组件会自动为字段添加索引前缀以确保唯一性：

- 原始字段 ID: `name`
- 实际字段 ID: `0_name`, `1_name`, `2_name` 等

## 注意事项

1. **行配置优先级**: `rowIndexs` 的优先级高于 `restAll`
2. **字段渲染**: 使用 `renderFields` 辅助函数自动处理字段的唯一性和渲染
3. **数据同步**: 组件会自动与 Form 组件的 store 同步数据
4. **验证集成**: 字段验证会正常工作，包括跨行验证
5. **性能优化**: 大量数据时建议使用虚拟滚动等优化方案

## 最佳实践

1. **合理设置行数限制**: 根据业务需求设置合适的 `maxRow` 和 `minRow`
2. **使用语义化的 ID**: 使用有意义的 `id` 便于调试和维护
3. **自定义容器**: 对于复杂布局，使用 `customContainer` 可以获得最大的灵活性
4. **字段渲染**: 使用 `renderFields` 辅助函数简化字段渲染逻辑
5. **字段验证**: 充分利用 FormItem 的验证功能，包括跨字段验证
6. **数据回显**: 通过 `initialValues` 正确设置初始数据格式

## 示例项目

完整的使用示例请参考 `apps/pc-demo/src/demos/DynamicFormDemo.tsx`。
