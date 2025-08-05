import { GenerateFunctionType } from './interface/generateFunction';
import { GenerateReactNodeType } from './interface/generateReactNode';

export const GenerateSchemaMap: Record<
	string, // 组件名.属性名
	GenerateFunctionType | GenerateReactNodeType
> = {
	'Form.onSubmit': {
		type: 'function',
		name: 'onSubmit',
		desc: '表单提交事件',
		params: [
			{
				name: 'values',
				desc: '表单值',
				type: 'object',
				properties: {},
			},
			{
				name: 'store',
				desc: '表单存储',
				type: 'object',
				properties: {
					name: {
						type: 'string',
						desc: '姓名',
					},
				},
			},
		],
		returnResultType: ['void'],
		isPromise: false,
	},
};
