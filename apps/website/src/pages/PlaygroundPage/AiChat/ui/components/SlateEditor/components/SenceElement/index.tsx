import { ReactEditor, RenderElementProps, useSlate } from 'slate-react';
import './index.less';
import { LeftArrowIcon } from '@/views/aiChat/components/Icons';
import { Descendant, Node } from 'slate';
import { CustomRenderElementProps } from '../../interface';

export const SENCE_ELEMENT = 'sence-element';

export type SenceElement = {
	type: typeof SENCE_ELEMENT;
	children: Descendant[];
	title: string;
};

export const SenceElementComponent = ({
	attributes,
	children,
	element,
	chatService,
}: CustomRenderElementProps) => {
	const editor = useSlate();
	const senceElement = element as SenceElement;
	const path = ReactEditor.findPath(editor, senceElement);
	const isEmpty =
		senceElement.children.length === 1 && Node.string(senceElement) === '';

	return (
		<div
			className="my-2 mx-0 leading-6"
			{...attributes}
			data-is-empty={isEmpty ? 'true' : 'false'}
		>
			<div className="pl-0 relative">
				<span
					contentEditable={false}
					onClick={() => {
						chatService.globalState.setCurSenceConfig(null);
					}}
					style={{ userSelect: 'none' }}
				>
					<span className="sence-button-wrapper">
						<span className="sence-button">
							<LeftArrowIcon />
						</span>
						{senceElement.title}
					</span>
				</span>
				<span
					style={{
						position: 'relative',
						display: 'inline-block',
						minWidth: isEmpty ? '150px' : 'auto',
						minHeight: '24px',
					}}
				>
					{children}
				</span>
			</div>
		</div>
	);
};
