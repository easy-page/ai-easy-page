import { CommonComponentProps, baseProps } from './types';

// 原生 HTML 元素属性 Schema 定义

export interface DivPropsSchema {
	type: 'div';
	properties: CommonComponentProps & {
		children?: string;
	};
}

export interface SpanPropsSchema {
	type: 'span';
	properties: CommonComponentProps & {
		children?: string;
	};
}

export interface PPropsSchema {
	type: 'p';
	properties: CommonComponentProps & {
		children?: string;
	};
}

export interface APropsSchema {
	type: 'a';
	properties: CommonComponentProps & {
		href?: string;
		target?: '_self' | '_blank' | '_parent' | '_top';
		rel?: string;
		children?: string;
	};
}

export interface UlPropsSchema {
	type: 'ul';
	properties: CommonComponentProps & {
		children?: string;
	};
}

export interface LiPropsSchema {
	type: 'li';
	properties: CommonComponentProps & {
		children?: string;
	};
}

export interface CanvasPropsSchema {
	type: 'canvas';
	properties: CommonComponentProps & {
		width?: number;
		height?: number;
	};
}

export interface IframePropsSchema {
	type: 'iframe';
	properties: CommonComponentProps & {
		src?: string;
		width?: number | string;
		height?: number | string;
		allow?: string;
		sandbox?: string;
		allowFullScreen?: boolean;
	};
}

// 默认属性构造（如需在外部使用，可导出）
export const getDefaultDivProps = (): DivPropsSchema => ({
	type: 'div',
	properties: { ...baseProps },
});

export const getDefaultSpanProps = (): SpanPropsSchema => ({
	type: 'span',
	properties: { ...baseProps },
});

export const getDefaultPProps = (): PPropsSchema => ({
	type: 'p',
	properties: { ...baseProps, children: '段落文本' },
});

export const getDefaultAProps = (): APropsSchema => ({
	type: 'a',
	properties: { ...baseProps, href: '#', children: '链接' },
});

export const getDefaultUlProps = (): UlPropsSchema => ({
	type: 'ul',
	properties: { ...baseProps },
});

export const getDefaultLiProps = (): LiPropsSchema => ({
	type: 'li',
	properties: { ...baseProps, children: '列表项' },
});

export const getDefaultCanvasProps = (): CanvasPropsSchema => ({
	type: 'canvas',
	properties: { ...baseProps, width: 300, height: 150 },
});

export const getDefaultIframeProps = (): IframePropsSchema => ({
	type: 'iframe',
	properties: {
		...baseProps,
		src: 'https://example.com',
		width: '100%',
		height: 300,
	},
});
