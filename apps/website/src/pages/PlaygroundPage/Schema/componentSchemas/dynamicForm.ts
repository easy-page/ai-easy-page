import { FunctionProperty, ReactNodeProperty } from '../specialProperties';
import { CommonComponentProps, baseProps } from './types';

// DynamicForm 组件属性 Schema
export interface DynamicFormPropsSchema {
	type: 'dynamicForm';
	properties: CommonComponentProps & {
		id?: string;
		maxRow?: number;
		minRow?: number;
		containerType?: 'tab' | 'table' | 'grid-table' | 'card';
		customContainer?: FunctionProperty;
		rows?: Array<{
			rowIndexs: number[];
			restAll?: boolean;
			fields: ReactNodeProperty[];
			rowSpan?: number[];
		}>;
		gridColumns?: number[];
		headers?: ReactNodeProperty[];
	};
}

// DynamicForm 默认属性
export const getDefaultDynamicFormProps = (): DynamicFormPropsSchema => ({
	type: 'dynamicForm',
	properties: {
		...baseProps,
		id: 'dynamic-form',
		maxRow: 10,
		minRow: 1,
		containerType: 'tab',
		rows: [
			{
				rowIndexs: [1],
				fields: [
					{
						type: 'reactNode',
						content: `<FormItem id="field1" label="字段1" required={false}><Input id="field1" placeholder="请输入内容" /></FormItem>`,
					},
				],
			},
		],
		gridColumns: [12],
		headers: [],
	},
});
