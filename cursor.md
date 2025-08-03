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
