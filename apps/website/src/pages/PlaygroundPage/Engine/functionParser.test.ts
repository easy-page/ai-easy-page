import {
	parseFunctionString,
	createFunctionFromString,
} from './functionParser';

// 测试函数解析器
console.log('=== 函数解析器测试 ===');

const testCases = [
	{
		name: '完整函数定义 - 解构参数',
		input: `function onSubmit({store, values}) {
   console.log('values:', values)
}`,
		expectedParams: ['store', 'values'],
	},
	{
		name: '箭头函数 - 解构参数',
		input: `({store, values}) => {
   console.log('values:', values)
}`,
		expectedParams: ['store', 'values'],
	},
	{
		name: '纯函数体',
		input: `console.log('values:', values)`,
		expectedParams: ['store', 'values'],
	},
	{
		name: '普通参数函数',
		input: `function test(store, values, rowInfo) {
   return store.getValues();
}`,
		expectedParams: ['store', 'values', 'rowInfo'],
	},
	{
		name: 'async 函数',
		input: `async function onSubmit({store, values}) {
   await store.submit(values);
}`,
		expectedParams: ['store', 'values'],
	},
];

testCases.forEach((testCase, index) => {
	console.log(`\n测试 ${index + 1}: ${testCase.name}`);
	console.log('输入:', testCase.input);

	const parsed = parseFunctionString(testCase.input);
	console.log('解析结果:', {
		params: parsed.params,
		body: parsed.body.substring(0, 50) + (parsed.body.length > 50 ? '...' : ''),
	});

	// 验证参数是否正确
	const paramsMatch =
		JSON.stringify(parsed.params) === JSON.stringify(testCase.expectedParams);
	console.log('参数匹配:', paramsMatch ? '✅' : '❌');

	// 测试创建函数
	const func = createFunctionFromString(testCase.input);
	console.log('函数创建:', func ? '✅' : '❌');

	if (func) {
		// 模拟调用函数
		const mockStore = { getValues: () => ({ test: 'value' }) };
		const mockValues = { name: 'test' };

		try {
			// 根据参数数量调用函数
			if (parsed.params.length === 2) {
				func(mockStore, mockValues);
			} else if (parsed.params.length === 3) {
				func(mockStore, mockValues, { rowIndex: 0 });
			}
			console.log('函数调用: ✅');
		} catch (error) {
			console.log('函数调用: ❌', error.message);
		}
	}
});

console.log('\n=== 测试完成 ===');
