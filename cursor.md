# 表单框架设计

总体要求：

- 简洁易用、灵活可扩展
- 基于 react + ts + less + vite 实现
- 整个仓库是 monorepo 的，基于 pnpm workspace + changeset：
  - apps/ 放 demos
  - packages/easy-page-core 放核心组件
  - packages/easy-page-pc 组件
  - packages/easy-page-mobile 组件

## 1. 设计目标

- 可以按需展示表单的一部分，比如：这个表单是 n 个组件的多项属性配置，我选中某个组件，就展示对应组件的属性配置表单。
- 可以统一状态管理和联动校验，比如：a 字段变化了，会受 b 的影响，则 a 字段的校验需要根据 b 的值进行校验。
- 和具体的 UI 库无关，我只需要实现核心的:FORM、FORMITEM 组件即可。
- 支持动态增减类型的表单结构，比如：
  - 我有个字表单有：a1、b1、c1 三个字段为一行
  - 我可以点击添加新一行，也有：a2、b2、c2
  - 下一行的值的校验可能和受到上一行的影响，比如：b2 的值不能小于 a2 的值
  - 我可以删除一行
  - 还可以定制的添加一行，比如：第一行第二行都是：a、b、c；第三行字段就是：d

## 2. 设计思路

### 2.1 设计状态管理

- 通过 mobx 实现一个表单的状态管理，是一个独立的 store，和 UI 解耦，管理所有的表单字段的状态和变更。
- 一个字段的变更可能会影响其他字段的值恢复为初始值，需要具备这个变更能力。

1. 这个 store 里应该有如下概念，用于支持表单里的联动特征：

- 副作用：effects，即一个状态的变化会影响其他状态，基于字段可以注册字段变化会带来的副作用
  - 比如：a 字段变化了，需要更新 b 字段的值，这就是一个副作用。
  - 可以注册副作用函数，当 a 字段变化时，会自动触发副作用函数，函数注册通过 FormItem 的 effects 属性实现。
  - effects 配置结构: {effectedKeys?:string[], handler?:(store) => Promise<Record<string, {fieldValue: any, fieldProps: Record<string, any>}>>> }
    - 如果配置了：effectedKeys 就表示，当前字段变化，对应 key 的字段会恢复成默认值
    - 如果配置了：handler，入参数是当前 store，用户可以自己处理影响，返回对应结构,key 是受到影响的字段，value 是受到影响的内容比如：fieldValue 表示状态受到影响了，fieldProps 表示字段属性受到影响了
    - handler 是支持同步和异步
  - 副作用是配置在变化的字段上，比如：a 字段变化，表示 a 变化带来的影响
  - 特点是只注册 1 个，可以影响 n 个字段的东西。
- 动作：actions，当某个字段变了，会影响当前字段的一些内容，如：选项、值、展示。
  - 比如：a 字段变化了，当前字段 b 的选项需要发生变化，禁用状态发生了变化、样式变化、文案变化、extra 提示词变化等等一切字段 props 都可能会受到影响而变化。
  - actions 配置结构：{effectedBy: string[]，handler:(store) => Promise<{fieldValue: any, fieldProps: Record<string, any>}> }
  - actions 配置在被影响的字段上，比如 b，表示：b 在受到 effectedBy 变化后，产生了一些 UI 和状态的影响
  - handler 是支持同步和异步
  - 函数注册通过 FormItem 的 actions 属性实现。

2. 我还想实现，当外部的一些状态发生变化，比如：活动状态或者是一些用户信息变了，store 里的部分字段的值也要更着变化，这个帮我设计下？
3. 我还希望通过 store 控制整个表单里的所有字段的是否可编辑状态，可能需要和外部的一些状态联动，比如：活动状态的不同，内部的字段可编辑状态也不一样，如何设计简单、易用？

注意：

1. actions 和 effects 都是数组， 表明一个字段可以注册多个 actions 和 effects 里
2. 多个 actions 和 effects 的执行顺序是：先执行 effects，再执行 actions，effects 和 actions 内也是顺序执行的，受到影响才执行。
3. 担心全局会存在过多的 actions 和 effects 同时执行，可能需要一个统一的调度中心，统一执行这些内容，并且控制同时执行的数量，保障性能。
4. 在执行异步的这些副作用、actions 、验证的时候，store 要维护一个全局状态么，表明执行中，避免页面卡顿体验差，这个执行中在超过 100 ms 的执行时，再出现，体验好一些。
5. 需要设计检查 effects 和 actions 的循环检测，避免无限循环卡死。

### 2.4 设计验证

- 统一管理函数验证，支持注册验证方法，支持通用规则验证如：正则、接口验证等；
- 验证可以是多种验证顺序组合，比如：先正则验证，再接口验证，再自定义验证；
- 支持字段联动验证，入参里包括：store 实例。

### 2.3 设计 Form 组件

- 实现一个 Form 组件，接收一个 children 属性，children 是一个数组，数组中的每一项是一个 FormItem 组件，也可以是其他装饰性的组件，比如一些：div tips 什么的。
- Form 可以注入：store 实例，表单里都是用这个 store 来做管理；
- Form 可以注入：验证实例，表单里都用这个来管理验证。

### 2.4 设计 FormItem 组件

- 实现一个 FormItem 组件，接收一个 children 属性，要求：children 属性具备：value、onChange、onBlur 等基础属性
- FormItem 具备 validate 函数，这个属性将被自动注册到 Form 里的验证实例中。
- FormItem 具备：label、id、validate、extra（字段下方的提示文案）、tips（字段问好提示文案）、required(是否必填) 等基本要素。
- FormItem 相关能力参考 antd 的 Form.item 一些属性。
- FormItem 的 extra 文案支持为一个组件，可以获得 store 对象，根据其属性做相关联动展示。

### 2.5 设计默认的通用组件

- 基于 antd 的 pc 和 mobile 库的组件，分别设计一套适配这个表单的基本组件：Input、Select、RadioGroup、Radio、Checkbox、TextArea 等常用组件
- 设计出动态增减类型的组件，如上述要求里的。
- Select 支持：远程搜索、本地搜索；远程搜索的值在回填的时候可能会基于 keyword 进行再次搜索回填展示，要具备这个能力。

### 2.6 使用 Demo 展示

- 帮我写一些使用 Demo，分别是 PC/Mobile 的

现在这个 Demo 太乱了，把示例分文件组织一下吧, 从简单到复杂。

- 展示所有基本组件的基础使用。
- 展示字段的完整内容：label、id、validate、extra、tips、required 等。其中 extra 和 tips 根据其他字段变化展示联动文字展示。
- 展示字段联动使用：effects 和 actions
- 展示外部状态影响内部字段值。
- 展示表单的 disabled 状态控制，根据外部的状态变化，比如：活动状态或者是：创建、编辑、查看不同模式下的不同编辑态。

demo 展示页，也可以展示出单个 demo：

- demo 效果
- demo 标题和功能描述
  组织更有条理一些。

## 额外功能

1. formItem 的字段可以多个水平布局，也可以垂直布局，不是整个表单的，可能是某些字段之间。
2. formItem 的 error 信息支持返回 react.ReactNode，支持自定义渲染。
3. store 支持请求管理，当字段配置了数据加载的时候，store 统一管理数据加载，避免频繁请求，字段可以对请求进行配置：

- 请求路径、method、参数、headers 等请求基本信息
- 结果处理方法，处理返回结果和错误信息
- store 里针对同一个请求，同样的参数，只请求一次，并存储，避免重复请求，所有请求的数据结果也由 store 保存，在所有字段地方都能拿到。

4. 实现选择某个选项后展示更多字段！！
5. When 函数、formItem 的数据处理：postprocess 和 preprocess
6.

## 动态表单问题

1. 你应该是使用我的 Form 和 FormItem 等我的框架能力去实现这个，包括他们之间的各种联动。
2. 我的 DynamicForm 显然封装的太过于定制，他应该重点关注：添加、删除 核心逻辑，对于字表单如何布局比如： Tab 或者表格形态，它应该支持灵活的定制；而且添加行的信息。

帮我合理的设计：DynamicForm 让其具备一定的易用性，同时能满足刚才的需求，通过这个 dynamicForm 实现如图效果。

1. 可以添加一行，添加按钮在最下方，删除按钮只有 1 行的时候没有，有 2 行的时候第二行有删除。
2. 券门槛的最大值是下一行的最小值
3. 如果是最后一行，最大值为不限
4. 商家最高补贴要求要比上一行的值要大，但是要比券门槛最大值小
5. 添加可以设置最大添加行 10

## 动态表单组件设计

### 要求

基于 @easy-page/pc 和 @easy-page/core 设计 动态表单组件，实现如下功能：

1. 动态表单能增加、删除小表单（几个 FormItem 字段组成）
2. 动态表单的布局可以被选择和自定义，比如自定义成：Tab 形式、表格形式
3. 动态表单只有 1 个表单的时候，删除按钮不显示
4. 动态表单可以限制增加的个数，比如：只允许增加 3 个，超过不允许。
5. 状态管理、验证、联动、数据加载、数据保存、数据回显等能力由 @easy-page/core 提供，动态表单组件只需要关注：添加、删除、布局等核心逻辑。
6. 如果和辛苦的能力不满足，不够抽象，则可以帮忙完善，但一定是要抽象的，不要和具体的业务耦合。

### 使用示例 1 - 默认的自增组件 Tab 形式

```tsx
import { Form, FormItem } from '@easy-page/core';
<DynamicForm
	maxRow={4}
	id={'baseInfos'}
	containerType={'tab'} // 'table' | 'tab'
	rows={[
		{
			rowIndexs: [1, 2],
			fields: [
				<FormItem id="name">
					<Input />
				</FormItem>,
				<FormItem id="desc">
					<TextArea />
				</FormItem>,
			],
		},
		{
			rowIndexs: [3],
			restAll: true,
			fields: [
				<FormItem id="age">
					<Input />
				</FormItem>,
			],
		},
	]}
></DynamicForm>;
```

如上形式：rows 里的含义为：

- rowIndexs: [1,2]，表示第一行和第二行都是这个 fields 表单
- rowIndexs: [3]，表示第三行是这个 fields 表单
- restAll 表示剩余的行都是这个 fields
- containerType 表示这个字表单的容器是 Tab 形式
- id 表示这个表单的值都放在这个 key 下，比如：
  {
  baseInfos: [{
  name: 'xxx',
  desc: 'xxxx'
  }, // 第一行表单值
  {
  name: 'xxx11',
  desc: 'xxxx222'
  }, // 第二行
  {age: '2'}] // 第三行
  }

### 使用示例 2 - 自定义表格形式

```tsx
import { Form, FormItem } from '@easy-page/core';
import { Table } from 'antd';
<DynamicForm
	maxRow={4}
	id={'baseInfos'}
	customContainer={({
    onAdd,
    value,
    onDelete
  }) => {
    // 实现一个自增的容器，增加和删除按钮
    return <div>
    {value.map((item, index) => {
      return <div key={index}>
       // 根据当前的 index 从 rows 找到对应的 fields，并将表单放入这里
       // 比如如下示例的：1 - 2 行都是一样的，id 也是重复的，可能得加 index 前缀或者后缀，
       // 但是在提交数据的时候注意数据结构如上示例 1
      <div>
    })
    }
    </div>
  }}
	rows={[
		{
			rowIndexs: [1, 2],
			fields: [
				<FormItem id="name">
					<Input />
				</FormItem>,
				<FormItem id="desc">
					<TextArea />
				</FormItem>,
			],
		},
		{
			rowIndexs: [3],
			restAll: true,
			fields: [
				<FormItem id="age">
					<Input />
				</FormItem>,
			],
		},
	]}
></DynamicForm>;
```

### 联动逻辑

结合现有的能力，能否实现：券门槛上一行的最大值就是下一行的最小值，且下一行最小值不可改，第一行最小值 0 也不可改，帮我看看这个联动怎么通过 easy-page/core 这个包里的 store 和 action 或者 effect 实现, 你仔细阅读阅读代码和文档

### 联动验证

如何结合已有的 DynamicForm 和 easy-page/core 能力实现：

- 补贴要求的值，要比券门槛范围最大值小
- 补贴要求的下一行的值，要比上一行补贴要求值要大
  如果已有的 dynamicForm 和 easy-page/core 能力不足，则看看如何合理抽象实现

现在有两个问题：

1. 一开始补贴要求是：4，全门槛最大值是 5，符合预期，然后调整了券门槛最大值为 3 ，补贴要求没有错误提示，这时候应该券门槛变化会验证同行的补贴要求。
2. 补贴要求第一行是 3，第二行是 4 ，是正确的，但是我修改了第一行为 5，第二行也没报错，同样道理：补贴要求变化需要验证其他行是否正确。
   所以如何做到：

- 同行某个字段变化，验证指定字段
- 上下行某个字段变化，跨行验证指定字段，结合已有的 DynamicForm 和 easy-page/core 能力实现， 如果已有的 dynamicForm 和 easy-page/core 能力不足，则看看如何合理抽象实现。

## 增加 When 组件

在 packages/easy-page-pc/src/components/DynamicForm，增加一个 When 组件

- 里面可以传入 children
- 这个 when 可以根据配置条件，来决定里面的 children 是否渲染

```tsx
<When show={({store, rowInfo?}) => boolean} >
<FormItem name="field1"></FormItem>
<FormItem name="field2"></FormItem>
</When>
```

表示当条件满足的时候，展示 field1 和 field2

apps/pc-demo/src/demos/when 在这个目录下，写一些关于 when 组件在各种场景下的使用示例吧。

- 当选择某个单选框的时候，出现一个字段 1，2，3，选择另一个单选框，出现:4，5
- 当选择多选框的时候，出现一个字段 1，2，3，再选择一个的时候，出现：1，2，3，4
- 当选择下拉框的时候，出现一个字段 1，2，3，再选择一个的时候，出现：1，2，3，4

这样设计的 when 是不是不好，store 任何变化都会重新执行 when？
我们应该这样：

```tsx
<When effectedBy={['field3']} show={({store, effectedValues,rowInfo?}) => boolean} >
<FormItem name="field1"></FormItem>
<FormItem name="field2"></FormItem>
</When>
```

这样，只有当 effectedBy 的字段变化的时候，才会重新执行 when，effectedValues 是影响我的字段的值，比如上述配置中就是：{field3: xxx}

可以通过 store 去统一管理 when 的精准执行，不要全局刷新；帮我优化 when 组件

## 合并单元格

## 合并单元格的效果

结合现有框架的能力和 demo，帮我实现如图的表格，其中：

- 时段第一行是包括时段配置的
- 时段第二行及以后都是没配置的，复用第一行的配置
  帮我看看这个 demo 如何实现，用 grid-table 和 table 容器分别实现这个“合并单元格”的效果。

如果底层组件不满足要求，看看如何进行合理的抽象提供相关能力。
比如：grid-table ，应该充分应用 rows 这个配置：
rows = [{
rowIndexs: [1],
fields: [<FormItem name="field31"></FormItem>, <FormItem name="field32"></FormItem>,<FormItem name="field33"></FormItem>,<FormItem name="field34"></FormItem>],

},{
rowIndexs: [2],
fields: [<FormItem name="field41"></FormItem>, <FormItem name="field42"></FormItem>,],
rowSpan: [2, 4],

}
]

如上，第二行，rowSpan 表示从第二列到第四列合并展示，展示元素是第 2 个元素
，基于上述思路，再帮我实现多列合并单元格的效果。

## 基于 When 组件实现一个容器组件

在 packages/easy-page-pc/src/components/Container 实现一个容器组件，结合 When 组件，实现如下功能：

```tsx
<Container
containerType = "Card" // 可以是卡片、可以是有边框的容器
layout="horizontal" // 容器内可以是水平布局、垂直布局
customContainer = {({children}) => <div>{children}</div>} // 自定义容器
title="标题" // 容器标题，可以是一个 ReactNode
titleType=""// 标题类型，默认几个，如：一级标题、二级标题、三级标题
effectedBy={['field3']}
show={({store, effectedValues,rowInfo?}) => boolean}  >
 <FormField name="field1"></FormField>
 <FormField name="field2"></FormField>
</Container>
```

- 如上定义：show 和 effectedBy 是 When 组件的属性，当 When 组件的 show 返回 true 时，Container 才会渲染，当 When 组件的 show 返回 false 时，Container 不渲染。
- titleType 默认的几个类型值英文为：h1,h2,h3、h4

# 实现统一的表单请求管理

## 表单字段的请求

store 应该统一管理表单的数据请求，在表单内，相关具备请求数据的字段的，需要在 store 中注册，在 store 中统一管理，避免重复请求，比如：下拉框、多选框、单选框等
一般的请求注册，使用方式应该是这样：

```tsx
<FormItem
	name="field1"
	req={{
		effectedBy: ['field2'],
		handler: async ({
			store,
			rowInfo,
			rowValues,
			keyword,
			value,
		}: {
			store: FormStore;
			rowInfo?: any;
			rowValues?: any;
			keyword?: string;
			value: any; // 当前字段的值
		}) => {
			// 可能需要依赖一些数据，比如：rowInfo、rowValues来做请求，这里定义请求逻辑，返回请求结果标准形式
			// {success: true, data: T, error?: '请求成功'}
		},
	}}
>
	<Select />
</FormItem>
```

1. 如上，进行字段的请求定义，然后将数据加载，注册到 store 里进行统一管理。
2. 初始化表单的时候，一定是所有的 effects 和 actions 初始化执行后（如果有），再统一执行初始化的 req 请求，将数据加载到 store 里。
3. 在表单内，使用 Select、Radio、Checkbox 等组件的时候，需要使用 store 中的数据，那么就需要在组件内使用 useFormContext，获取 store.getData('field1') 中的数据，然后渲染到组件内。

在 select 组件为例子：

1. 通过 store.getData('field1') 中的数据，然后渲染到组件内。
2. 在 select 中根据关键词搜索的时候，可以：store.dispatch('field1', { keyword: 'xxx' })，然后 store 里也会调用对应的方法进行数据记载，并传递 keyword 过去。

3. 在 store 里：

- 会在 effectedBy 的字段状态变化的时候，执行完所有 effects 和 actions 初始化执行后（如果有）后，进行数据查询
- 会在表单初始化的时候，根据选择字段的 ID，调用 req 进行初始化查询，同时也会查询一次没有 id 参数的数据，来保证回填的时候有选项，且选中的选项也在其中，不能重复也不漏。

如果是一个 checkbox 类型的需要请求的下拉框，则逻辑是：

1. 通过 store.getData('field1') 中的数据，然后渲染到组件内。
2. 在 store 里：

- 会在 effectedBy 的字段状态变化的时候，执行完所有 effects 和 actions 初始化执行后（如果有）后，进行数据查询
- 表单初始化的时候，也会默认查询一次选项，根据依赖的字段状态等，执行 req 请求，将数据加载到 store 里。

## 统一的表单上下文请求

在表单里，往往会用到一些上下文的信息，如：

- 在编辑的时候需要请求详情数据
- 表单里可能需要请求一些开关数据
- 表单里可能需要请求用户信息等等

我们可以在 Form 上定义这些全局请求，然后在 Store 里统一管理，这样任意地方都可以使用到，比如这样：

```tsx
<Form
mode="edit" // create、edit、view
initReqs={{
  detail: {
    req: async ({
			store,
			effectedData
		}: {
			store: FormStore;
      effectedData?: any;
		}) => {},
    mode: ['edit', 'view']
  },
  mccKeys: {
    req: async ({
			store,
			effectedData
		}: {
			store: FormStore;
      effectedData?: any;
		}) => {},,
    depends: ['detail'],
  },
  userInfo: {
    req: ...,
  }
}}/>
```

如上，这些请求也是有依赖性的，比如：

- mccKeys 依赖 detail 的数据，到时候等待 detail 请求完成后，放到 effectedData 里，再请求 mccKeys
- 没有依赖的请求，可以并发请求，有依赖的需要先发完依赖的请求，比如：mccKeys
- 控制并发请求数量不超过 5 个，可以设置一个队列，控制并行为 5 个，发送完 1 个就继续取。
- 请求的数据存储：Record<string, any> 其中 key 就是上方的：detail 和 mccKeys 这个样，方便后续使用。
- 请求结果应该存储：successed: boolean, data: any, error: any 这样，便于判断是否成功。

1. form 上应该有个 mode 参数，方便后续做判断，比如：create、edit、view
2. initReqs 里也有 mode 参数，表示在哪种模式下才发请求，比如 detail，配置了后只有查看和编辑的时候才查询，没有配置，则所有模式都查询

3. 这个应该用成枚举
4. 刚才并发数量应该有控制，比如并发请求 5 个，超过 5 个则需要排队进行请求，这个 5 可以作为 store 的参数配置。
5. 请求的时候，表单是不是得有全局 loading 管理
6. 在对应的表单上应该也有 loading 效果

## Select Demo

帮我写一个针对这个 Select 的 demo，要求如下：

- 初始化的时候从远程加载数据
- 能当 A 字段变化后，触发 B 字段的选项加载
- B 字段支持远程搜索，搜索时候，触发远程数据请求

在编辑模式下：

- 原先 B 字段是根据关键词搜索到的结果
- 在编辑模式表单初始化的时候，能根据之前选择的 id 进行自动搜索回填，并再搜索一次初始化的选项，结合起来，即有回填了，又有初始化选项。

# demo

- 动态表单内外联动
- 动态表单 tab 之间联动校验，联动选项
- 基于 form 的 mode 优化一下 disabed 逻辑，现在太复杂了

# 官网

帮我把 apps/pc-demo

帮我写一个表单框架的官网，要求如下：

- 官网风格科幻、深色风格、具备一些合适的动画效果，比如边框、鼠标悬浮等等动画效果。
  目录结构：
- 指南和 API
- 指南下面有：核心概念、基础、进阶，下面都还有二级主题

基于：vite + less + react + antd + ts + react-router-dom + react-markdown

## 框架特点

1. 强大的动态表单能力，支持各种动态表单布局场景。
2. 强大的状态管理能力，将 effects、actions、apis 均统一管理内敛，降低复杂度。
3. 超强的联动能力，多字段联动、父子表单联动，都非常游刃有余。
4. 强大的性能，基于 mobx，针对全局的副作用、请求都做了统一的调度管理；准对所有的变更都是精准渲染。
5. 超强的扩展性，可以轻松扩展任意组件库。
6. 超强的复用性，一个字段可以描述出所有联动逻辑，轻松闭环完整能力，提升模块化复用。
7. 沉淀了表单的禁用/非禁用字段切换能力，可以轻松指定字段的禁用、非禁用状态。
8. 能和外部上下文轻松联动表单状态，如；身份信息变化、开关控制等，都可以影响表单内的交互表现。
9. 即可开发，也可以配置，面向开发友好，支持：JSON 化，下发表单动态渲染。
10. 沉淀了显示与字段隐藏的控制能力，轻松的让表单可以实现各种场景展示。
11. 超强的校验能力，支持上下文联动校验。

## 设计理念

1. 我们希望内敛所有表单复杂度，让用户更专注于业务。
   高内聚低耦合，我希望将所有表单场景的通用复杂度下沉到表单底层解决，让用户只需关注自己的业务逻辑即可。比如：

- 通过抽象 effects 和 actions 并设计调度器，解决复杂的联动处理。
- 通过 apis 请求的统一管理和数据共享，避免重复请求，解决请求依赖先后顺序问题。
- 通过统一的状态管理，解决内外状态变化导致的表单的一系列变化状态管理问题。
- 通过下沉动态表单能力，提供基础动态表单组件和容器扩展，解决在动态增删表单场景下的复杂度。
- ...

2. 我们希望没有任何复杂繁重的认知负担，我们尽可能用最少的概念、最熟悉的写法去描述表单逻辑。

- 我们对开发者友好，所有的写法和正常的写法保持一致，组件扩展也不存在额外概念。
- 我们的组件扩展，无需感知太多额外的概念，正常的开发组件即可。

3. 我们既要又要：既希望对开发者友好，又足够灵活，支持动态下发场景。
   我们提供两种模式：

- 开发模式，像正常的组件一样开发即可；JSON 模式，通过 JSON 配置表单，可以实现动态加载；
- 我们可以和 AI 对话生成表单（代码 / JSON）模式。

## 转化 Schema 的函数属性管理

我们希望通过 AI 生成 SChema 的方式来描述表单，因此需要将表单的一些属性转化成可描述的 Schema，因此我们读取：packages/easy-page-core/src/components 这下面组件的 props，并转化成 Schema 结构到：packages/easy-page-core/src/schema

你先帮我把 packages/easy-page-core/src/components/Form.tsx 这个组件的 Props 转化成 Schema 结构，要求：

- 普通属性字段，按照 Props 定义转换即可
- 如果是枚举值
- 遇到了组件属性，则转化成：{type: 'static'| 'dynamic', value: string}
- 遇到了函数组件，转化成如下结构，参数和返回值具体的参考下面的详细描述：

```ts
{
  name: '函数名称',
	desc: 'xxxx',
  params: string[],
	returnResultType: 'object',
	returnResultDesc: {

	}
}
```

### 函数整体结构

1. 要用 Schema 来描述表单，避免不了对函数属性做处理，未来函数属性是 AI 生成，因此需要让 AI 理解函数里的参数含义和可使用的函数定义，所以我们需要用结构描述出函数。
2. 考虑到函数的参数具有极高的复用性，我们不用为每一个函数参数都详细描述，我们可以整体描述参数，在函数那里进行参数 key 配置，因此函数的描述可以结构化为：

```ts
{
  name: '函数名称',
	desc: 'xxxx',
  params: string[],
	returnResultType: 'object',
	returnResultDesc: {

	}
}
```

### 关于参数

参数我们统一放到：packages/easy-page-core/src/schema/context 里进行管理，比如：

```tsx
	onSubmit?: (
		values: Record<string, FieldValue>,
		store: FormStore
	) => void | Promise<void>;
```

这个属性是一个函数，有两个参数，返回结果为空，我们可以这样描述：

```ts
{
  name: 'onSubmit',
	desc: '用于表单提交',
  params: ['values', 'store'],
	returnResultType: 'void'
}
```

其中 values 这个参数，我们可以在：packages/easy-page-core/src/schema/context 新建一个文件：values.ts 来描述，比如：

```ts
export const values: ParamDescContext = {
	name: 'values',
	desc: '表单的值',
	type: 'object',
	properties: {
		// 这里可以描述 values 的结构
	},
};
```

比如 store 参数，则描述为：

```ts
export const store: ParamDescContext = {
	name: 'store',
	desc: '表单的 store',
	type: 'class',
	properties: {
		// 这里可以描述 store 的结构
	},
};
```

整体类型定义参考：packages/easy-page-core/src/schema/context/interface.ts，禁止修改我的这个底层定义

### 关于返回结果

因为返回的结果可能差异挺多，因此具体的描述也可以使用：ParamDescContext 直接放在 Schema 里描述，比如，返回：

```ts
{
	name: 'onSubmit',
	desc: '用于表单提交',
	params: ['values', 'store'],
	returnResultType: 'void',
	returnResultDesc: ParamDescContext
}
```

## 问题

1. 水平垂直布局，在 Form 组件上也能控制，优先级：Form < Field
2. Container 上的 show 属性应该是可选、默认应该是一级标题

## 低代码表单平台

我想做一个基于配置的表单平台，即通过页面配置，动态生成表单页面。
基本交互流程：

- 点击创建页面，有两个选项：表单/页面。
- 选择表单默认选择 Form 节点作为根节点，出现关于 Form 的一堆配置。
- 点击添加按钮，可以添加更多节点，比如 Input、Button 等。
- 可选择组件后，如果是表单模式，默认开启使用 FormItem，否则关闭。
- 选择的组件具备：FormItem 组件的配置、组件本身的配置。

根据如上交互，即可生成表单页面，底层原理就是：

- 通过上述操作，生成一个 JSON 配置文件，描述页面结构。
  - 相关组件的配置用一个表单来展示，不同的组件有不同的配置。
  - 配置属性里如果有组件或者函数的，统一用字符串表示，然后出现一个编辑器可以进行开发。
- 再根据一个解析引擎，将 JSON 配置文件解析成如 FullFormDemo 这样的代码，里面结构和属性都是基于 JSON 配置解析出来的。

整体页面结构，左侧配置，右侧预览效果。

要求

- 相关组件定义参考：packages/easy-page-core、packages/easy-page-pc

1. 帮我实现 Schema 描述以及 Schema 解析引擎，SDK 放到 packages 里。

2. 帮我在 apps 下新建一个项目：form-builder，基于：vite + less + antd + ts + react + react-router-dom + react-markdown + MonacoEditor 实现上述需求。

## 在 website 里增加低代码能力

1. 帮我在顶部导航 API 的右边增加：Playground 页面。
2. 页面是左右结构，左侧分为两个 Tab：AI 搭建、配置搭建，默认是配置搭建。
3. 右侧是基于搭建 JSON Schema 通过 解析引擎的预览页面，你可以先空着。
4. 预览部分顶部可以有个菜单栏：模式切换：创建、编辑、查看

左侧配置搭建页面我清空了，我想要这样，左侧搭建页面：

- 首先维护一个空的 Schema: {}, 表示啥都没有。
- 默认进入的时候，这里有两个选项：创建页面、创建表单，创建页面点击后先空着。
- 点击创建表单，则在 Schema 中描述一个表单组件，然后写一个简单的 SchemaEngine 基于这个描述解析成如下功能：
  注意，这里只是功能的具体示意，表示通过 Schema 解析后要达到的效果和使用的组件，具体还是写法跟解析引擎和 Schema 有关。

```tsx
import React from 'react';

import { Form } from '@easy-page/core';

export const FullFormDemo: React.FC = () => {
	const handleSubmit = async (values: any, _store: any) => {
		console.log('基础表单提交:', values);
	};

	const handleValuesChange = (changedValues: any, allValues: any) => {
		console.log('值变化:', changedValues, allValues);
	};

	const EmptyNode = () => <div>暂无内容</div>;

	return (
		<Form
			initialValues={{}}
			onSubmit={handleSubmit}
			onValuesChange={handleValuesChange}
		>
			<EmptyNode />
		</Form>
	);
};
```

上述大概是这个意思，如何基于 Schema 解析成这样，可能需要写一个引擎，放到：

- apps/website/src/pages/PlaygroundPage/Engine 目录下
  如何描述这个空表单的 Schema 定义放到：apps/website/src/pages/PlaygroundPage/Schema 目录下
- 其中涉及到的函数，如：handleValuesChange、handleSubmit 等都可以根据 Schema 配置的字符串函数来解析成函数

暂时只定义这个表单组件的 Schema，引擎只解析这个表单组件，把上述流程渲染出来

## 配置页面：

沿用当前项目风格，优化当前 FormMode 里的东西，帮我实现配置表单功能，具体描述如下：

- 因为选择了创建表单后，进来就是：FormMode 组件，默认有个 Form 节点。

因此，左侧是基于 FormSchema 的一个节点组件树。

左侧选择节点后，右侧表单预览左侧会出现对应节点的配置项，比如：

- 选择了 form 节点，就会出现 form 的配置项：properties
- 其中如果是：FunctionProperty 和 ReactNodeProperty 的配置项，是一个 monacoreditor，可以编辑函数，有个 AI 编辑按钮，按需实现逻辑。
- 如果是其他普通属性，则是通过正常的表单元素来配置。
- 这个节点树上，节点旁边可以点击添加按钮，进行添加节点到当前组件下，也可以添加并列同级的节点，也可以删除当前节点。

你先结合现在最新的：apps/website/src/pages/PlaygroundPage/Schema/form.ts FormSchema 定义，实现基本交互和配置，具体的添加逻辑先空着。

注意结合当前项目风格，可以不一定使用 antd 的表单组件

## 创建字段

创建表单时候，点击添加按钮出现一个弹窗：

- 包含一个下拉框：可以选择新增组件
- 一个多选框：是否为表单组件，表单模式下，默认为 true，创建页面模式下默认为：false

其中可选组件为：packages/easy-page-pc/src/components 下的组件，这些是固定选项，帮我整理到选项里，用枚举定义好，再增加一个自定义组件的选项

- 针对固定组件，他的属性配置表单就是各个属性下的 Props，参考 Form 组件的给我定义一下。
- 如果选择了是表单组件，则除了组件本身外，还会被包裹 FormItem 组件，所以配置面板里需要是一个 Tab，一个是组件属性，一个是 FormItem 属性。
- 自定义组件的配置只有一个：组件内容，是一个 monacoreditor，可以编辑函数，有个 AI 编辑按钮，按需实现逻辑。

1. 首先基于：packages/easy-page-pc/src/components 的每个组件的 Props，比如：DatePickerProps
2. 参考：apps/website/src/pages/PlaygroundPage/Schema/form.ts 组件的定义方式，将这个 Props 转化成 Schema 定义，比如：apps/website/src/pages/PlaygroundPage/Schema/form.ts 中的 FormSchema
3. 基于这个 Schema 解析成表单配置，比如：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/FormConfigPanel/index.tsx
   将组件对应的配置面板写在：apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel 里，
   每个组件单独一个文件夹放自己的配置面板

目前已经实现弹窗逻辑和添加组件的逻辑，还需要补充组件对应配置面板的逻辑。

- 实现了组件 schema 定义：apps/website/src/pages/PlaygroundPage/Schema/componentProps.ts

## 节点树问题

### 需求

将 ReactNodeProperty 增加了 ComponentSchema 的支持后：

1. 属性配置面板应对这种复杂配置，就显得有点鸡肋了，而且无法做到新增和选择更多节点配置到属性中，因为这时候属性节点也是一个节点树
2. 左侧的节点树也很难再描述一个节点上某个属性的节点树
   帮我设计下，如何展现现在的：FormSchema 节点树和配置节点树

以动态表单为例子：DynamicFormPropsSchema 中：

- rows.fields 里是需要配置组件的，它可以是一个 ComponentSchema，
- headers 也是：ComponentSchema
  这就相当于，左侧的节点树，除了 children 里有子树，
  节点的属性配置里，也可能有子树

要求：

1. 某个节点可能还有 n 个属性子树，这个怎么展现和交互
2. 每个子树的节点的配置同正常的节点配置是一样的交互，一样的配置，如何管理

### 项目结构

- 右侧配置面板位置：apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel
- 左侧节点树：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode
- 字段属性定义：apps/website/src/pages/PlaygroundPage/Schema
- JSXParser：apps/website/src/pages/PlaygroundPage/JSXParser
- 解析引擎：apps/website/src/pages/PlaygroundPage/Engine

## TODO:

1. 没有 children 属性的组件，不应该有添加按钮

# 优化配置面板

- 配置面板位置：apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel
- schema 位置：apps/website/src/pages/PlaygroundPage/Schema

首先

- 针对：FunctionReactNodeProperty 类型设计一个组件：monaco editor 呈现，并具备 AI 编辑能力
- 针对：ReactNodeProperty 配置，设计一个组件：

  - 有一个开关，关闭，则表示使用字符串配置，展示 monacoEditor 组件，并可以进行 AI 编辑
  - 打开，则进入节点配置模式， 展示新建按钮，点击后出现左侧组件树一样的新增节点弹窗，apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/NodeTree.tsx
  - 新增节点后，选中对应节点，节点新增到对应组件对应属性上。
  - 注意考虑：ReactNodeProperty[] 属性的情况

- 针对：FunctionProperty，类型设计一个组件：monaco editor 呈现，并具备 AI 编辑能力，这个和 FunctionReactNodeProperty 用两个组件吧，可能后面会有差别，暂时一样而已。

基于上述描述优化配置，用合适的组件优化我的配置面板：apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel，结合 Schema 里的类型，给相应类型的属性，在配置面板里用对应组件去配置

我用容器组件，点击了标题属性，点击添加节点，选择输入框，然后报错了，
这个 title.useSchema 打开的时候，要用 title.schema 去解析渲染，如果关闭采用 title.content, 帮忙看看是不是这里判断出错了，导致渲染错。

# 丰富组件

1. 在 packages/easy-page-pc/src/components 参考其他组件，再扩展一些 antd 的组件，比如：Tab、步骤条、抽屉等，丰富组件库，方便用户使用。
2. 在 apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/ComponentTypes.ts 增加上面增加的表单组件选择项

3. 有些组件不适合被表单元素包裹，因此不用扩展到：packages/easy-page-pc/src/components 里，比如：Button 等，但是可以添加到创建选项里，比如：Button、Icon、Divider 等，方便选择

# 组件选择页面

现在组件很多了，有什么更好的方式便于选择和创建么，帮我设计下？

# preview examples

应该为每一个组件都添加 examples 示例，放到：apps/website/src/pages/PlaygroundPage/PreviewExamples

然后维护一个组件：apps/website/src/pages/PlaygroundPage/constant/componentMap.tsx 和 example 的映射关系

- 比较复杂的组件如：dynamicForm 和 Container 等参考 pc-demos 目录下的使用方式
- 如果：是否为表单组件的开关打开，则 example 里的组件应该要被 formItem 包裹（easy-page/core 的）

这里面还有很多 Demo 没有实现， 继续实现：

- 非表单模式下，不需要 Form 和 FormItem 包裹
- 表单模式下，需要 Form 和 FormItem 包裹
- 是否为表单组件这个配置要传给 example，表示是否是表单模式

# 优化对话组件样式

基于：apps/website/src/pages/PlaygroundPage/components/AIBuilder/index.less 进行样式优化：

1. 历史对话悬浮弹窗样式修复
2. 对话名称和修改对话的弹窗样式修复，符合当前项目主题
3. 底部输入框样式修复，整体结构参考如图结构，不要调整我的结构和增加边框，就修改主题风格适配我的项目即可。

所有样式的覆盖都放到：apps/website/src/pages/PlaygroundPage/components/AIBuilder/index.less

# 风格修改

对话组件主题管理：

- apps/website/src/pages/PlaygroundPage/theme/ThemeProvider.tsx
- apps/website/src/index.css
- apps/website/tailwind.config.js

结合上面主题管理，通过 tailwind.config.js 和 index.css 主题变量的定义，优化
apps/website/src/pages/PlaygroundPage/AiChat/ui/components/ChatInput/toolbar/operations/SendBtn/index.tsx 这里的 className ，对比度太差了

然后你可以选择在

- apps/website/src/index.css
- apps/website/tailwind.config.js
  增加相关的颜色变量

# 进入 playground 先选择创建会场

在 “apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/index.tsx” 里的创建页面和表单的选择，应该放在进入
playground 的时候就选择，而不是在创建页面的时候选择。

- 获取路由参数参考：apps/website/src/pages/PlaygroundPage/AiChat/common/utils/url.ts
- 如果进入 playground 时候，路由上没有 venueId 参数，就弹出这个弹窗，让用户选择创建还是选择已有会场
- 选择后，点击确定，则调用：apps/website/src/pages/PlaygroundPage/AiChat/apis/venue.ts 里的接口进行保存会场，并通过：apps/website/src/pages/PlaygroundPage/AiChat/services/chatGlobalState/chatGlobalStateEntity.ts 管理状态，并如下方式使用状态：

```ts
const chatService = useService(ChatService);
const curVenue = useObservable(chatService.globalState.curVenue$, null);
```

创建成功后，将 venueId 放在路由上，并跳转到 playground 页面

- 添加方式参考：apps/website/src/pages/PlaygroundPage/AiChat/routers/utils.ts#appendParamsToUrl

# 集成登陆能力

目前我是一个文档官网，登陆后可进入个人工作空间因此顶部导航右侧应该增加登陆按钮，提供登陆注册能力

- 结合登陆接口：/Users/kp/Documents/ai-works/easy-page-v2-server/app/api/endpoints/user.py
- 结合用户表：/Users/kp/Documents/ai-works/easy-page-v2-server/app/models/user.py
- 结合授权方式：/Users/kp/Documents/ai-works/easy-page-v2-server/app/middleware/jwt_auth.py
  帮我实现前端的：
  1.  登陆注册功能
  2.  实现用户信息修改、密码修改功能
  3.  登陆后先简单实现一个空白页面留着，我们后续再完善
  4.  实现顶部导航右侧个人用户信息头像展示，点击头像可以进入个人工作空间或者修改资料

现有能力：

- 接口基类：apps/website/src/apis/axios.ts
- 相关接口定义位置： apps/website/src/apis
- 状态数据管理 Model:apps/website/src/services/chatGlobalState/chatGlobalStateEntity.ts
- model 状态使用示例

```ts
const userInfo = useObservable(chatService.globalState.userInfo$, null);
const userTeams = useObservable(chatService.globalState.userTeams$, []);
```

- ioc 机制和服务管理：apps/website/src/infra
- 服务放这里：apps/website/src/services
- ioc 初始化位置：apps/website/src/App.tsx#frameworkProvider
- ioc 相关 hooks: apps/website/src/hooks
- 权限相关状态管理方：apps/website/src/services/auth

- 登陆注册页面放到：apps/website/src/pages 目录下

# 增加项目管理相关功能

目前整体管理链路是：用户 -> 团队（team） -> 项目(project) -> 页面(venue)

现有能力：

- 接口基类：apps/website/src/apis/axios.ts
- 相关接口定义位置： apps/website/src/apis
- 状态数据管理 Model:apps/website/src/services/chatGlobalState/chatGlobalStateEntity.ts
- model 状态使用示例

```ts
const userInfo = useObservable(chatService.globalState.userInfo$, null);
const userTeams = useObservable(chatService.globalState.userTeams$, []);
```

后端接口项目相关 API：/Users/kp/Documents/ai-works/easy-page-v2-server/app/api/endpoints/project.py(项目接口)
项目表：/Users/kp/Documents/ai-works/easy-page-v2-server/app/models/project.py

- project 相关接口前缀都是：/zspt-agent-api/v1
  因此，比如创建 project 结合上面的文档，路径为：/zspt-agent-api/v1/project/create-prj

- ioc 机制和服务管理：apps/website/src/infra
- 服务放这里：apps/website/src/services
- ioc 初始化位置：apps/website/src/App.tsx#frameworkProvider
- ioc 相关 hooks: apps/website/src/hooks

不用新建 service，就在 apps/website/src/services/chatGlobalState/chatGlobalStateEntity.ts 里管理 workspace 相关的状态即可，参考：

```ts
curTeam$: LiveData<TeamInfo | null> = new LiveData<TeamInfo | null>(null);
userTeams$: LiveData<TeamInfo[]> = new LiveData<TeamInfo[]>([]);

curVenue$: LiveData<VenueInfo | null> = new LiveData<VenueInfo | null>(null);
venues$: LiveData<VenueListInfo | null> = new LiveData<VenueListInfo | null>(
	null
);
```

帮我增加项目管理相关 API，结合表和接口优化项目管理 Tab 下内容

# 丰富组件选择

1. 组件选择上，我也希望增加上默认的 html 所有元素，比如：canvas、div、p、iframe 、span、a 、ul、li 等，
2. 每个元素也有对应的配置面板：apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel/components

帮我检查：

- 组件对应关系 Map：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentPropsMap.ts
- 组件 Props 定义：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentProps.ts
- 组件分类：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentCategories.ts
- 组件选项：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentTypeOptions.ts
- 配置面板位置：apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel/components
- 组件解析渲染引擎：apps/website/src/pages/PlaygroundPage/Engine
- JSX 语法解析：apps/website/src/pages/PlaygroundPage/JSXParser
- Schema 定义：apps/website/src/pages/PlaygroundPage/Schema
- 语法树解析：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder

帮我完成上述需求，结合这些上下文

补齐：

- video 等也需要补充
  可以建立 schema 组件市场，选择对应节点加入，如何支持扩展组件 + 组件面板定义～

# 优化队列机制

帮我优化这个：apps/website/src/pages/PlaygroundPage/hooks/useSchemaSaveQueue.ts ，不需要这么复杂，只需设置一段从：curVenue 拿出 schema 并保存即可：

```ts
const curVenue = useObservable(chatService.globalState.curVenue$, null);
const currentSchema = curVenue?.page_schema || EMPTY_FORM_SCHEMA;
```

调用下方接口进行保存

```ts
const res = await updateVenue({
	venue_id: String(venueId),
	venue_data: { page_schema: currentSchema },
});
if (res.message) {
	message.error(res.message);
	return;
}
```

然后保留，在页面离开或者刷新或者关闭前，弹出正在保存窗口，保存完毕继续关闭窗口。

# 修改配置面板

1. 刚才新增的 html 所有元素，比如：canvas、div、p、iframe 、span、a 、ul、li，应该都具备自身特点 + 通用 html 元素配置的配置面板

现在的配置面板：/Users/kp/Documents/ai-works/easy-page-v2/apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel/components/HtmlElementConfigPanel.tsx

因此：

- 现在已经有了：apps/website/src/pages/PlaygroundPage/Schema/componentSchemas/native.ts 定义
- 应该和其他组件一样，基于这个定义去给每个元素增加配置面板：自身属性 + 通用 html 元素配置

# 优化 style 配置面板

还是太丑了，你可以把这个文件拆成文件夹，放多个属性配置的各种组件，如果有比较复杂的。
我的要求是：

- 颜色需要使用颜色选择器
- 字体大小为输入框
- 布局结构可以采用一些图标来表达各种布局可能
- 其他属性，比如：边框、阴影、圆角、背景色、透明度、动画、过渡等，可以采用丰富的组件来表达
  属性名用中文展示，配置到 JSON 里是 style 的属性。
  帮我设计的交互科技感、美观、易用。

# 优化 preview 这里

1. 优化：apps/website/src/pages/PlaygroundPage/components/PreviewPanel 这里，增加一个 panel 叫做 canvasPanel，将 schema 渲染的内容展示到这个里面
2. canvasPanel 内容：

- 里面是一个可缩放的画布，当前页面就是其中一个可编辑的 schema 节点树页面。
- 下方有一个工具栏，可以选择画布上的节点和页面
  - 可以如图一样，在画布上画线、画正方形、画原型
  - 可以选择一个地方进行打字，输入文字

在画布上的任意操作，我希望都能映射到一个 schema 动作，对 schema 做对应动作：

- 比如：画了一个长方形，我希望这个正方形能映射到一个 schema 节点，这个节点是 div，div 的宽高就是所画长方形宽高，切换到预览页面就可以看到添加 schema 节点后的效果
- 比如：在画布上打字，我希望这个打字能映射到一个 schema 节点，这个节点是 OnlyText，
  在哪个 div 上画的字，就放到对应的 div children 里，切换到预览页面就可以看到添加 schema 节点后的效果

## 重要

- CanvasPanel 放在 apps/website/src/pages/PlaygroundPage/components/CanvasPanel 目录下
- 每个文件不要太大，注意合理拆分文件大小

## 相关项目上下文：

- 组件对应关系 Map：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentPropsMap.ts
- 组件 Props 定义：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentProps.ts
- 组件分类：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentCategories.ts
- 组件选项：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentTypeOptions.ts
- 配置面板位置：apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel/components
- 组件解析渲染引擎：apps/website/src/pages/PlaygroundPage/Engine
- JSX 语法解析：apps/website/src/pages/PlaygroundPage/JSXParser
- Schema 定义：apps/website/src/pages/PlaygroundPage/Schema
- 语法树解析：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder

# 实现一个 Canvas 画布

1. 帮我实现一个 Canvas 画布，CanvasPanel 放在 apps/website/src/pages/PlaygroundPage/components/CanvasPanel 目录下

- 里面是一个可缩放的画布，当前页面就是其中一个可编辑的 schema 节点树页面。
- 下方有一个工具栏，可以选择画布上的节点和页面
  - 可以如图一样，在画布上画线、画正方形、画原型
  - 可以选择一个地方进行打字，输入文字
- 给每一个操作都定义一个操作对象，并根据操作能在画布上画出对应内容，比如画线、画正方形、画原型、打字 - 比如打字：{opType: 'text', content: 'hello world'}
  帮我合理的设计所有操作对象，在画布上操作的结果应该是一个节点树，在画布左侧展示

## 重要

- CanvasPanel 和 PreviewPanel 都放在表单预览这里，一个是预览，一个是画布
- 每个文件不要太大，注意合理拆分文件大小
- 画布所有内容都放在 CanvasPanel 里
- 画布结构分为：左侧节点树、中间画布、右侧属性面板

## 相关项目上下文：

- 组件对应关系 Map：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentPropsMap.ts
- 组件 Props 定义：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentProps.ts
- 组件分类：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentCategories.ts
- 组件选项：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder/components/FormMode/types/componentTypeOptions.ts
- 配置面板位置：apps/website/src/pages/PlaygroundPage/components/NodeConfigPanel/components
- 组件解析渲染引擎：apps/website/src/pages/PlaygroundPage/Engine
- JSX 语法解析：apps/website/src/pages/PlaygroundPage/JSXParser
- Schema 定义：apps/website/src/pages/PlaygroundPage/Schema
- 语法树解析：apps/website/src/pages/PlaygroundPage/components/ConfigBuilder

# 设计一个前端框架

基于 javascript + html + css，设计一个前端框架，使用方式如下：

1. 启动应用

```js
import { createApp } from 'my-framework';
import App from './App';
const app = createApp({
	el: '#app',
	root: App,
});
app.mount();
```

2. 组件写法

```js
export const App = {
	state: {
		message: 'Hello, World!',
	},
};
```

1. 组件需要考虑生命周期：挂载、卸载、状态变更时

```js
import { createApp } from 'my-framework';

const app = createApp({
	el: '#app',
	data: {
		message: 'Hello, World!',
	},
	methods: {
		handleClick() {
			this.message = 'Hello, World!';
		},
	},
	template: `
    <div>
      <h1>{{ message }}</h1>
      <button @click="handleClick">Click me</button>
    </div>
  `,
});

app.mount();
```

## 功能

- 支持组件化开发
- 支持数据绑定

## 示例场景

1. 发送请求，并回填数据，支持 loading 效果

```js
import { createApp } from 'my-framework';

const app = createApp({
	el: '#app',
	data: {
		loading: false,
		data: null,
	},
	methods: {
		async fetchData() {
			this.loading = true;
			const response = await fetch('https://api.example.com/data');
			const data = await response.json();
			this.data = data;
			this.loading = false;
		},
	},
	template: `
    <div>
      <button @click="fetchData">Fetch Data</button>
      <div v-if="loading">Loading...</div>
      <div v-else>{{ data }}</div>
    </div>
  `,
});

app.mount();
```

2. 表单验证

```js
``;
import { createApp } from 'my-framework';

const app = createApp({
	el: '#app',
	data: {
		form: {
			username: '',
			password: '',
		},
		errors: {},
	},
	methods: {
		async handleSubmit() {
			if (!this.form.username) {
				this.errors.username = 'Username is required';
			}
			if (!this.form.password) {
				this.errors.password = 'Password is required';
			}
			if (!this.errors.username && !this.errors.password) {
				// Submit form
			}
		},
	},
	template: `
    <div>
      <h1>Login</h1>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="form.username" />
          <span v-if="errors.username">{{ errors.username }}</span>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="form.password" />
          <span v-if="errors.password">{{ errors.password }}</span>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  `,
});

app.mount();
```

3. 路由

```js

```
