import { SenceInputComponentFileConfig } from '@/common/interfaces';
import { Descendant } from 'slate';
import { CustomRenderElementProps } from '../../interface';

export const UPLOAD_FILE_ELEMENT = 'upload-element';

export type UploadElement = {
	type: typeof UPLOAD_FILE_ELEMENT;
	children: Descendant[];
	config: SenceInputComponentFileConfig;
	url?: string;
	fileName?: string;
};

export const UploadElementComponent = ({
	attributes,
	children,
	element,
}: CustomRenderElementProps) => {
	const uploadElement = element as UploadElement;
	const config = uploadElement.config;
	return (
		<div
			{...attributes}
			className="bg-background-brand-tertiary mx-2 inline-block relative min-w-[80px] rounded-md my-2"
		>
			<div className="px-2 py-1">{children}</div>
		</div>
	);
};
