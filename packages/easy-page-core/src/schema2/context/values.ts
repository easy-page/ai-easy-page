import { ParamDescContext } from './interface';

export const values: ParamDescContext = {
	name: 'values',
	desc: '表单的值对象，包含所有字段的当前值',
	type: 'object',
	properties: {
		// 动态字段，键为字段名，值为字段值
		'[fieldName]': {
			name: '[fieldName]',
			desc: '字段值，可以是任意类型',
			type: 'string', // 实际可以是任意类型
		},
	},
};
