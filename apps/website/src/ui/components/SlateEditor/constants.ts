import { INPUT_ELEMENT } from './components/InputElement';
import { PARAGRAPH_ELEMENT } from './components/PragraphElement';
import { SENCE_ELEMENT } from './components/SenceElement';
import {
	Editor,
	Element,
	Text,
	Transforms,
	Node,
	Path,
	NodeEntry,
} from 'slate';
import { UPLOAD_FILE_ELEMENT } from './components/UploadElement';

// 定义所有可用的元素类型
export const ELEMENT_TYPES = {
	PARAGRAPH: PARAGRAPH_ELEMENT,
	SENCE: SENCE_ELEMENT,
	INPUT: INPUT_ELEMENT,
	UPLOAD_FILE: UPLOAD_FILE_ELEMENT,
} as const;

// 将元素类型导出为类型
export type ElementType = (typeof ELEMENT_TYPES)[keyof typeof ELEMENT_TYPES];

// 自定义 Element 类型定义
export interface BaseElement {
	type: string;
	children: Node[];
}

export interface SenceElementType extends BaseElement {
	type: typeof SENCE_ELEMENT;
	title: string;
}

export interface InputElementType extends BaseElement {
	type: typeof INPUT_ELEMENT;
	config: {
		style?: {
			width?: string;
			[key: string]: any;
		};
		[key: string]: any;
	};
}

export interface ParagraphElementType extends BaseElement {
	type: typeof PARAGRAPH_ELEMENT;
}

// 节点规范化函数类型
export type NormalizeFunction = (
	editor: Editor,
	element: Element,
	path: Path
) => boolean; // 返回true表示已处理，false表示继续使用默认处理

// 定义节点配置接口
export interface NodeConfig {
	type: string;
	isInline?: boolean;
	isVoid?: boolean;
	normalize?: NormalizeFunction;
	canContainText?: boolean;
	canContainInline?: boolean;
	minChildren?: number;
	patterns?: {
		// 用于检测文本是否符合该节点类型的模式
		detect: RegExp;
		// 用于处理匹配文本并转换为对应节点
		transform: (text: string, match: RegExpMatchArray) => Partial<Element>;
	}[];
	defaults?: {
		// 节点默认属性
		[key: string]: any;
	};
}

// 为各种节点定义配置
export const NODE_CONFIGS: Record<string, NodeConfig> = {
	// 段落元素配置
	[ELEMENT_TYPES.PARAGRAPH]: {
		type: ELEMENT_TYPES.PARAGRAPH,
		isInline: false,
		isVoid: false,
		canContainText: true,
		canContainInline: true,
		minChildren: 1,
		normalize: (editor, element, path) => {
			// 使用类型断言，确保element被视为ParagraphElementType
			const paragraphElement = element as ParagraphElementType;

			// 如果段落没有子节点，添加空文本节点
			if (paragraphElement.children.length === 0) {
				Transforms.insertNodes(editor, { text: '' }, { at: [...path, 0] });
				return true;
			}
			return false;
		},
	},

	// 场景元素配置
	[ELEMENT_TYPES.SENCE]: {
		type: ELEMENT_TYPES.SENCE,
		isInline: false,
		isVoid: false,
		canContainText: true,
		normalize: (editor, element, path) => {
			// 使用类型断言，确保element被视为SenceElementType
			const senceElement = element as SenceElementType;

			// 如果场景元素没有子节点，添加空文本节点
			if (senceElement.children.length === 0) {
				Transforms.insertNodes(editor, { text: '' }, { at: [...path, 0] });
				return true;
			}
			// 确保场景元素有title属性
			if (!senceElement.title) {
				Transforms.setNodes(editor, { title: '' } as Partial<Element>, {
					at: path,
				});
				return true;
			}
			return false;
		},
		defaults: {
			title: '',
		},
	},

	// 输入元素配置
	[ELEMENT_TYPES.INPUT]: {
		type: ELEMENT_TYPES.INPUT,
		isInline: true,
		isVoid: false,
		canContainText: true,
		minChildren: 1,
		// 文本模式匹配，用于检测和恢复
		patterns: [
			{
				// 简单示例：检测a1、a2这样的模式
				detect: /a(\d+)/,
				transform: (text, match) =>
					({
						type: ELEMENT_TYPES.INPUT,
						children: [{ text: match[0] }],
						config: {
							style: {
								width: '100%',
							},
						},
					} as Partial<Element>),
			},
		],
		normalize: (editor, element, path) => {
			// 使用类型断言，确保element被视为InputElementType
			const inputElement = element as InputElementType;

			// 如果输入元素没有子节点，添加空文本节点
			if (inputElement.children.length === 0) {
				Transforms.insertNodes(editor, { text: '' }, { at: [...path, 0] });
				return true;
			}

			// 确保输入元素有config属性
			if (!inputElement.config) {
				Transforms.setNodes(
					editor,
					{
						config: {
							style: {
								width: '100%',
							},
						},
					} as Partial<Element>,
					{ at: path }
				);
				return true;
			}
			return false;
		},
		defaults: {
			config: {
				style: {
					width: '100%',
				},
			},
		},
	},
};

// 辅助函数：根据文本内容和模式匹配恢复节点
export const detectAndTransformNode = (text: string): Element | null => {
	// 遍历所有节点配置
	for (const config of Object.values(NODE_CONFIGS)) {
		// 检查该节点是否有文本模式匹配配置
		if (config.patterns) {
			for (const pattern of config.patterns) {
				const match = text.match(pattern.detect);
				if (match) {
					const transformedNode = pattern.transform(text, match);
					// 确保转换后的节点至少包含必要的属性
					return {
						...transformedNode,
						children: transformedNode.children || [{ text }],
					} as Element;
				}
			}
		}
	}
	return null;
};

// 辅助函数：获取节点配置
export const getNodeConfig = (type: string): NodeConfig | undefined => {
	return NODE_CONFIGS[type];
};

// 辅助函数：根据配置应用规范化
export const normalizeByConfig = (
	editor: Editor,
	[node, path]: NodeEntry
): boolean => {
	if (!Element.isElement(node) || !node.type) {
		return false;
	}

	const config = getNodeConfig(node.type);
	if (config && config.normalize) {
		return config.normalize(editor, node, path);
	}

	return false;
};
