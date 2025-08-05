import { JSXParser } from './JSXParser';
import { ComponentMapper } from './ComponentMapper';
import { ParserOptions } from './types';

// 创建默认的解析器实例
const defaultParser = new JSXParser();

// 便捷的解析函数
export const parseJSX = (jsxString: string): React.ReactNode => {
	const result = defaultParser.parse(jsxString);
	return result.success ? result.result : jsxString;
};

// 创建自定义解析器的函数
export const createJSXParser = (
	componentMapper?: ComponentMapper,
	options?: ParserOptions
): JSXParser => {
	return new JSXParser(componentMapper, options);
};

// 创建带自定义组件的解析器
export const createJSXParserWithComponents = (
	customComponents: Record<string, React.ComponentType<any>>,
	options?: ParserOptions
): JSXParser => {
	const componentMapper = new ComponentMapper(customComponents);
	return new JSXParser(componentMapper, options);
};

// 导出默认解析器
export { defaultParser };
