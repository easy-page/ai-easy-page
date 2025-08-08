import React from 'react';
import { Descendant } from 'slate';
import { RenderElementProps } from 'slate-react';
import { CustomRenderElementProps } from '../../interface';

export const PARAGRAPH_ELEMENT = 'paragraph-element';

export type ParagraphElement = {
	type: typeof PARAGRAPH_ELEMENT;
	children: Descendant[];
};

export const ParagraphElementComponent: React.FC<CustomRenderElementProps> = ({
	attributes,
	children,
}) => {
	return (
		<div className="my-2" {...attributes}>
			{children}
		</div>
	);
};
