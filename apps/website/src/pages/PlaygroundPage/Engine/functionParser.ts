/**
 * 函数解析器 - 将字符串形式的函数转换为可执行的函数
 */

export interface ParsedFunction {
	params: string[];
	body: string;
}

// 函数解析缓存，避免重复解析相同的函数字符串
const functionCache = new Map<string, Function>();

/**
 * 解析函数字符串，支持以下格式：
 * 1. function onSubmit({store, values}) { console.log('values:', values) }
 * 2. ({store, values}) => { console.log('values:', values) }
 * 3. async function onSubmit({store, values}) { ... }
 * 4. async ({store, values}) => { ... }
 * 5. 纯函数体: console.log('values:', values)
 */
export function parseFunctionString(content: string): ParsedFunction {
	const trimmedContent = content.trim();

	// 1. 处理 function 关键字定义的函数
	const functionMatch = trimmedContent.match(
		/function\s+(\w+)\s*\(([^)]*)\)\s*\{([\s\S]*)\}/
	);
	if (functionMatch) {
		const [, funcName, paramStr, body] = functionMatch;
		const params = parseParameters(paramStr);
		return { params, body: body.trim() };
	}

	// 2. 处理箭头函数
	const arrowMatch = trimmedContent.match(/\(([^)]*)\)\s*=>\s*\{([\s\S]*)\}/);
	if (arrowMatch) {
		const [, paramStr, body] = arrowMatch;
		const params = parseParameters(paramStr);
		return { params, body: body.trim() };
	}

	// 3. 处理 async function
	const asyncFunctionMatch = trimmedContent.match(
		/async\s+function\s+(\w+)\s*\(([^)]*)\)\s*\{([\s\S]*)\}/
	);
	if (asyncFunctionMatch) {
		const [, funcName, paramStr, body] = asyncFunctionMatch;
		const params = parseParameters(paramStr);
		return { params, body: body.trim() };
	}

	// 4. 处理 async 箭头函数
	const asyncArrowMatch = trimmedContent.match(
		/async\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*)\}/
	);
	if (asyncArrowMatch) {
		const [, paramStr, body] = asyncArrowMatch;
		const params = parseParameters(paramStr);
		return { params, body: body.trim() };
	}

	// 5. 如果都不匹配，说明是纯函数体，使用默认参数
	// 这里不使用固定的三个参数，而是根据实际需要提供参数
	return {
		params: ['store', 'values'], // 默认提供最常用的两个参数
		body: trimmedContent,
	};
}

/**
 * 解析函数参数，支持解构参数
 * @param paramStr 参数字符串，如 "{store, values}" 或 "store, values"
 * @returns 参数名数组
 */
function parseParameters(paramStr: string): string[] {
	const trimmed = paramStr.trim();

	// 处理解构参数，如 {store, values}
	const destructureMatch = trimmed.match(/\{([^}]*)\}/);
	if (destructureMatch) {
		return destructureMatch[1]
			.split(',')
			.map((p) => p.trim())
			.filter((p) => p);
	}

	// 处理普通参数，如 store, values
	return trimmed
		.split(',')
		.map((p) => p.trim())
		.filter((p) => p);
}

/**
 * 将函数字符串转换为可执行的函数
 * @param funcProp 函数属性对象
 * @returns 可执行的函数或 undefined
 */
export function createFunctionFromString(
	content: string
): Function | undefined {
	try {
		// 检查缓存
		if (functionCache.has(content)) {
			return functionCache.get(content);
		}

		const { params, body } = parseFunctionString(content);
		const func = new Function(...params, body);

		// 缓存结果
		functionCache.set(content, func);

		return func;
	} catch (error) {
		console.warn('函数解析失败:', error);
		return undefined;
	}
}

/**
 * 清除函数缓存
 */
export function clearFunctionCache(): void {
	functionCache.clear();
}

/**
 * 获取缓存统计信息
 */
export function getFunctionCacheStats(): { size: number } {
	return { size: functionCache.size };
}

/**
 * 测试函数解析是否正确
 */
export function testFunctionParser() {
	const testCases = [
		`function onSubmit({store, values}) {
   console.log('values:', values)
}`,
		`({store, values}) => {
   console.log('values:', values)
}`,
		`async function onSubmit({store, values}) {
   console.log('values:', values)
}`,
		`console.log('values:', values)`,
		`function test(store, values, rowInfo) {
   return store.getValues();
}`,
	];

	testCases.forEach((testCase, index) => {
		console.log(`测试用例 ${index + 1}:`);
		console.log('输入:', testCase);
		const result = parseFunctionString(testCase);
		console.log('解析结果:', result);
		console.log('---');
	});
}
