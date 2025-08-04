import { ParamDescContext } from './interface';

export const changedValues: ParamDescContext = {
	name: 'changedValues',
	desc: '发生变化的字段值对象，只包含本次变化的字段',
	type: 'object',
	properties: {
		'[fieldName]': {
			name: '[fieldName]',
			desc: '变化的字段值',
			type: 'string', // 实际可以是任意类型
		},
	},
};
