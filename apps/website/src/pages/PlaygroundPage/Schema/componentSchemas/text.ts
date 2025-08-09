import { ComponentSchema } from '../component';

export interface TextPropsSchema extends ComponentSchema {
	type: 'OnlyText';
	properties: {
		text: string;
	};
}

export const getDefaultTextProps = (): TextPropsSchema => ({
	type: 'OnlyText',
	properties: {
		text: '',
	},
});
