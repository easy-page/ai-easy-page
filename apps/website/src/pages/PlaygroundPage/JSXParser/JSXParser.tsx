import * as React from 'react';
import { ComponentMapper } from './ComponentMapper';
import { ParserOptions, ParseResult } from './types';

// JSX解析器类
export class JSXParser {
	private componentMapper: ComponentMapper;
	private options: ParserOptions;

	constructor(componentMapper?: ComponentMapper, options: ParserOptions = {}) {
		this.componentMapper = componentMapper || new ComponentMapper();
		this.options = {
			enableDebug: false,
			strictMode: false,
			...options,
		};
	}

	// 解析JSX字符串为React组件
	parse(jsxString: string): ParseResult {
		try {
			const cleanedString = jsxString.trim();

			if (!cleanedString.includes('<') && !cleanedString.includes('>')) {
				return {
					success: true,
					result: cleanedString,
				};
			}

			const result = this.parseJSX(cleanedString);
			return {
				success: true,
				result,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error';
			this.logDebug('JSX解析失败:', errorMessage);

			return {
				success: false,
				result: jsxString,
				error: errorMessage,
			};
		}
	}

	// 解析JSX字符串
	private parseJSX(jsxString: string): React.ReactNode {
		// 简单的JSX解析实现
		// 这里使用一个简化的方法，只处理基本的JSX结构

		// 检查是否包含JSX标签
		if (!jsxString.includes('<') || !jsxString.includes('>')) {
			return jsxString;
		}

		// 尝试解析简单的JSX结构
		try {
			// 匹配自闭合标签
			const selfClosingMatch = jsxString.match(/<(\w+)([^>]*)\/>/);
			if (selfClosingMatch) {
				const [, tagName, attributes] = selfClosingMatch;
				const Component = this.componentMapper.getComponent(tagName);
				if (Component) {
					const props = this.parseAttributes(attributes);
					return React.createElement(Component, props);
				}
			}

			// 匹配普通标签
			const tagMatch = jsxString.match(/<(\w+)([^>]*)>([\s\S]*?)<\/\1>/);
			if (tagMatch) {
				const [, tagName, attributes, content] = tagMatch;
				const Component = this.componentMapper.getComponent(tagName);
				if (Component) {
					const props = this.parseAttributes(attributes);
					// 递归解析子内容
					const children = this.parseContent(content);
					return React.createElement(Component, props, children);
				}
			}
		} catch (error) {
			this.logDebug('JSX解析失败:', error);
		}

		// 如果无法解析，返回原始字符串
		return jsxString;
	}

	// 解析属性
	private parseAttributes(attributesString: string): Record<string, any> {
		const props: Record<string, any> = {};

		let rest = attributesString;

		// 1) 解析 style={{ ... }} 表达式
		const styleExp = /style=\{\{([\s\S]*?)\}\}/m;
		const styleMatch = rest.match(styleExp);
		if (styleMatch) {
			const raw = styleMatch[1];
			props.style = this.parseStyleObject(raw);
			// 移除已处理的 style 片段，避免后续被当作布尔属性
			rest = rest.replace(styleExp, '').trim();
		}

		// 2) 解析 形如 attr="value" 的字符串属性
		const attrRegex = /(\w+)=["']([^"']*)["']/g;
		let m: RegExpExecArray | null;
		while ((m = attrRegex.exec(rest)) !== null) {
			const [, name, value] = m;
			try {
				props[name] = JSON.parse(value);
			} catch {
				props[name] = value;
			}
		}

		// 3) 解析无值布尔属性（排除已解析的 attr=... 以及 style）
		const withoutAssigned = rest.replace(/\w+\s*=\s*[^\s]+/g, '');
		const booleanAttrRegex = /\b(\w+)\b/g;
		let bm: RegExpExecArray | null;
		while ((bm = booleanAttrRegex.exec(withoutAssigned)) !== null) {
			const name = bm[1];
			if (!props.hasOwnProperty(name)) {
				props[name] = true;
			}
		}

		return props;
	}

	// 将 "color: 'red', fontSize: 12px" 这类对象文本解析为 { color: 'red', fontSize: '12px' }
	private parseStyleObject(styleContent: string): Record<string, any> {
		const style: Record<string, any> = {};
		// 简单解析：按逗号分割，再按冒号分割
		const parts = styleContent
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		for (const part of parts) {
			const idx = part.indexOf(':');
			if (idx === -1) continue;
			const key = part.slice(0, idx).trim();
			let value = part.slice(idx + 1).trim();
			// 去掉包裹引号
			if (
				(value.startsWith('"') && value.endsWith('"')) ||
				(value.startsWith("'") && value.endsWith("'"))
			) {
				value = value.slice(1, -1);
			}
			style[key] = value;
		}
		return style;
	}

	// 解析内容
	private parseContent(content: string): React.ReactNode {
		const trimmedContent = content.trim();

		if (trimmedContent.includes('<') && trimmedContent.includes('>')) {
			return this.parseJSX(trimmedContent);
		}

		return trimmedContent;
	}

	// 调试日志
	private logDebug(...args: any[]): void {
		if (this.options.enableDebug) {
			console.log('[JSXParser]', ...args);
		}
	}

	// 获取组件映射器
	getComponentMapper(): ComponentMapper {
		return this.componentMapper;
	}

	// 设置组件映射器
	setComponentMapper(componentMapper: ComponentMapper): void {
		this.componentMapper = componentMapper;
	}

	// 获取选项
	getOptions(): ParserOptions {
		return { ...this.options };
	}

	// 设置选项
	setOptions(options: Partial<ParserOptions>): void {
		this.options = { ...this.options, ...options };
	}

	// 获取所有可用组件名称
	getAvailableComponents(): string[] {
		return this.componentMapper.getComponentNames();
	}

	// 检查组件是否存在
	hasComponent(name: string): boolean {
		return this.componentMapper.hasComponent(name);
	}

	// 注册组件
	registerComponent(
		name: string,
		component: React.ComponentType<any>,
		description?: string
	): void {
		this.componentMapper.register({
			name,
			component,
			description,
		});
	}

	// 注销组件
	unregisterComponent(name: string): boolean {
		return this.componentMapper.unregister(name);
	}

	// 批量注册组件
	registerComponents(
		components: Array<{
			name: string;
			component: React.ComponentType<any>;
			description?: string;
		}>
	): void {
		this.componentMapper.registerBatch(components);
	}

	// 获取组件注册信息
	getComponentRegistration(name: string) {
		return this.componentMapper.getRegistration(name);
	}

	// 获取所有组件注册信息
	getAllComponentRegistrations() {
		return this.componentMapper.getAllRegistrations();
	}

	// 按分类获取组件
	getComponentsByCategory(category: string) {
		return this.componentMapper.getComponentsByCategory(category);
	}

	// 获取所有分类
	getCategories() {
		return this.componentMapper.getCategories();
	}
}
