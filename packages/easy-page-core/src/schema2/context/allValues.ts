import { ParamDescContext } from './interface';

export const allValues: ParamDescContext = {
	name: 'allValues',
	desc: '表单的所有字段值对象，包含表单中所有字段的当前值',
	type: 'object',
	properties: {
		'[fieldName]': {
			name: '[fieldName]',
			desc: '字段值，可以是任意类型',
			type: 'string', // 实际可以是任意类型
		},
	},
};
