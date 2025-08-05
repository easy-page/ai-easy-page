import { GenerateReactNodeType } from './generateReactNode';

export type BaseFieldValue =
	| 'string'
	| 'number'
	| 'boolean'
	| 'null'
	| 'undefined';

// 描述单个简单属性
export type BaseSchema = {
	name: string;
	desc: string;
	type: BaseFieldValue;
	optional?: boolean; // 是否可选
};

export type EnumSchema = {
	name: string;
	desc: string;
	type: 'enum';
	enum: string[];
	optional?: boolean; // 是否可选
};

// 描述 Object 类型
export type ObjectSchema = {
	name: string;
	desc: string;
	type: 'object';
	properties: {
		[key: string]:
			| BaseSchema
			| EnumSchema
			| GenerateReactNodeType
			| ObjectSchema
			| ArraySchema;
	};
	optional?: boolean; // 是否可选
};

// 可能是数组嵌套描述，数组嵌 object、array 都有可能
export type ArraySchema = {
	name: string;
	desc: string;
	type: 'array';
	items:
		| EnumSchema
		| BaseSchema
		| ArraySchema
		| ObjectSchema
		| GenerateReactNodeType;
	optional?: boolean; // 是否可选
};

export type PropertySchema =
	| BaseSchema
	| ObjectSchema
	| ArraySchema
	| GenerateReactNodeType
	| EnumSchema;

export type ClassSchema = {
	name: string;
	desc: string;
	type: 'class';
	properties: PropertySchema[];
	optional?: boolean; // 是否可选
};

// string 表示一些公共定义，就不重复定义了比如：store
export type ParamDescContext = ClassSchema | PropertySchema | string;

export type GenerateFunctionType = {
	type: 'function';
	name: string;
	desc: string;
	params: ParamDescContext[]; // 参数名称数组，对应 context 中的参数定义
	returnResultType: Array<
		'void' | 'object' | 'array' | 'string' | 'number' | 'boolean'
	>;
	isPromise: boolean;
	returnResultDesc?: ParamDescContext; // 返回结果的详细描述
};
