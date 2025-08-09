import { ComponentSchema } from '../component';

export interface TextSchema extends ComponentSchema {
	type: 'text';
	properties: {
		text: string;
	};
}

export const getDefaultTextProps = (): TextSchema => ({
	type: 'text',
	properties: {
		text: '',
	},
});
