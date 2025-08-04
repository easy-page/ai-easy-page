import { ParamDescContext } from './interface';

export const store: ParamDescContext = {
	name: 'store',
	desc: '表单的 store 对象，提供表单状态管理和操作方法',
	type: 'class',
	properties: [
		{
			name: 'state',
			desc: '表单的当前状态，包含值、字段状态、提交状态等',
			type: 'object',
			properties: {
				values: {
					name: 'values',
					desc: '所有字段的值',
					type: 'object',
				},
				fields: {
					name: 'fields',
					desc: '所有字段的状态信息',
					type: 'object',
				},
				submitting: {
					name: 'submitting',
					desc: '是否正在提交',
					type: 'boolean',
				},
				submitted: {
					name: 'submitted',
					desc: '是否已提交',
					type: 'boolean',
				},
			},
		},
		{
			type: 'function',
			name: 'setValue',
			desc: '设置字段值',
			params: ['field', 'value'],
			returnResultType: 'void',
		},
		{
			type: 'function',
			name: 'getValue',
			desc: '获取字段值',
			params: ['field'],
			returnResultType: 'object',
		},
		{
			type: 'function',
			name: 'validate',
			desc: '验证指定字段或所有字段',
			params: ['field'],
			returnResultType: 'object',
		},
		{
			type: 'function',
			name: 'reset',
			desc: '重置表单',
			params: [],
			returnResultType: 'void',
		},
		{
			type: 'function',
			name: 'submit',
			desc: '提交表单',
			params: [],
			returnResultType: 'void',
		},
	],
};
