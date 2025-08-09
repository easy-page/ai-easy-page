import { ComponentSchema } from '../component';
import { ReactNodeProperty } from '../specialProperties';
import { CommonComponentProps, baseProps } from './types';

// 原生 HTML 元素属性 Schema 定义

export interface DivPropsSchema extends ComponentSchema {
	type: 'div';
	properties: CommonComponentProps;
	canHaveChildren: true;
}

export interface SpanPropsSchema extends ComponentSchema {
	type: 'span';
	properties: CommonComponentProps;
	canHaveChildren: true;
}

export interface PPropsSchema extends ComponentSchema {
	type: 'p';
	properties: CommonComponentProps;
	canHaveChildren: true;
}

export interface APropsSchema extends ComponentSchema {
	type: 'a';
	properties: CommonComponentProps & {
		href?: string;
		target?: '_self' | '_blank' | '_parent' | '_top';
		rel?: string;
	};
	canHaveChildren: true;
}

export interface UlPropsSchema extends ComponentSchema {
	type: 'ul';
	properties: CommonComponentProps;
	canHaveChildren: true;
}

export interface LiPropsSchema extends ComponentSchema {
	type: 'li';
	properties: CommonComponentProps;
	canHaveChildren: true;
}

export interface CanvasPropsSchema extends ComponentSchema {
	type: 'canvas';
	properties: CommonComponentProps & {
		width?: number;
		height?: number;
	};
}

export interface IframePropsSchema extends ComponentSchema {
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
	canHaveChildren: true,
});

export const getDefaultSpanProps = (): SpanPropsSchema => ({
	type: 'span',
	properties: { ...baseProps },
	canHaveChildren: true,
});

export const getDefaultPProps = (): PPropsSchema => ({
	type: 'p',
	properties: {
		...baseProps,
	},
	canHaveChildren: true,
});

export const getDefaultAProps = (): APropsSchema => ({
	type: 'a',
	properties: {
		...baseProps,
		href: '#',
	},
	canHaveChildren: true,
});

export const getDefaultUlProps = (): UlPropsSchema => ({
	type: 'ul',
	properties: { ...baseProps },
	canHaveChildren: true,
});

export const getDefaultLiProps = (): LiPropsSchema => ({
	type: 'li',
	properties: {
		...baseProps,
	},
	canHaveChildren: true,
});

export const getDefaultCanvasProps = (): CanvasPropsSchema => ({
	type: 'canvas',
	properties: { ...baseProps, width: 300, height: 150 },
	canHaveChildren: false,
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
