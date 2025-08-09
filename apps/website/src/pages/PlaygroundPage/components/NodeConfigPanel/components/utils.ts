import { FormSchema } from '../../../Schema/form';

export interface NodeInfo {
	type:
		| 'form'
		| 'component'
		| 'property'
		| 'array'
		| 'reactNode'
		| 'array-item';
	propertyPath: string;
	componentIndex?: number;
	propName?: string;
	index?: number;
	parentPath?: string;
}

export const getValueByPath = (obj: any, path: string): any => {
	const parts = path.split('.');
	let current = obj;
	for (const part of parts) {
		if (current && typeof current === 'object') {
			current = current[part];
		} else {
			return undefined;
		}
	}
	return current;
};

export const setValueByPath = (obj: any, path: string, value: any): any => {
	const parts = path.split('.');
	const newObj = { ...obj };
	let current = newObj;

	for (let i = 0; i < parts.length - 1; i++) {
		const part = parts[i];
		if (!(part in current) || typeof current[part] !== 'object') {
			current[part] = {};
		}
		current = current[part];
	}

	current[parts[parts.length - 1]] = value;
	return newObj;
};

// 解析选中节点ID，返回结构化信息
export const parseNodeId = (
	nodeId: string,
	effectiveSchema: FormSchema | null
): NodeInfo | null => {
	const parts = nodeId.split('-');

	// 数组字段项 (如 rows.fields 中的某个字段)
	if (nodeId.includes('-field-')) {
		const fieldIndex = parts.indexOf('field');
		const parentKey = parts.slice(0, fieldIndex).join('-');
		const index = parseInt(parts[fieldIndex + 1]);

		const parentParse = parseNodeId(parentKey, effectiveSchema);
		if (parentParse && parentParse.type === 'array') {
			return {
				type: 'array-item',
				propertyPath: `${parentParse.propertyPath}.${index}`,
				index,
				parentPath: parentParse.propertyPath,
			};
		}
	}

	// 普通数组项 (如 rows 中的某个 row)
	if (nodeId.includes('-item-')) {
		const itemIndex = parts.indexOf('item');
		const parentKey = parts.slice(0, itemIndex).join('-');
		const index = parseInt(parts[itemIndex + 1]);

		const parentParse = parseNodeId(parentKey, effectiveSchema);
		if (parentParse && parentParse.type === 'array') {
			return {
				type: 'array-item',
				propertyPath: `${parentParse.propertyPath}.${index}`,
				index,
				parentPath: parentParse.propertyPath,
			};
		}
	}

	// ReactNode 属性下的子节点
	if (nodeId.includes('-reactnode-')) {
		const reactNodeIndex = parts.indexOf('reactnode');
		const parentKey = parts.slice(0, reactNodeIndex).join('-');
		const index = parseInt(parts[reactNodeIndex + 1]);

		const parentParse = parseNodeId(parentKey, effectiveSchema);
		if (parentParse && parentParse.type === 'property') {
			return {
				type: 'reactNode',
				parentPath: parentParse.propertyPath,
				index,
				propertyPath: `${parentParse.propertyPath}.children.${index}`,
			};
		}
	}

	// 属性节点
	if (nodeId.includes('-prop-')) {
		const propIndex = parts.indexOf('prop');
		const componentIndex = parseInt(parts[1]);
		const propName = parts[propIndex + 1];

		const propertyPath = `properties.children.${componentIndex}.props.${propName}`;

		// 根据当前 schema 判定该属性是否为直接的组件 schema
		const children = effectiveSchema?.properties?.children || [];
		const parentComponent = children[componentIndex];
		const propertyValue = parentComponent?.props?.[propName];

		if (
			propertyValue &&
			typeof propertyValue === 'object' &&
			'type' in propertyValue &&
			(propertyValue as any).type !== 'reactNode'
		) {
			return {
				type: 'component',
				componentIndex,
				propName,
				propertyPath,
			};
		}

		return {
			type: 'property',
			componentIndex,
			propName,
			propertyPath,
		};
	}

	// 子组件节点
	if (nodeId.startsWith('child-')) {
		const componentIndex = parseInt(parts[1]);
		return {
			type: 'component',
			componentIndex,
			propertyPath: `properties.children.${componentIndex}`,
		};
	}

	// 根 form 节点
	if (nodeId === 'form') {
		return {
			type: 'form',
			propertyPath: 'properties',
		};
	}

	return null;
};
