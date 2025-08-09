import { ComponentSchema } from '../../../../../Schema';
import { ReactNodeProperty } from '../../../../../Schema/specialProperties';

export const isReactNodeProperty = (value: any): value is ReactNodeProperty => {
	if (!value || typeof value !== 'object') return false;
	if (!('type' in value)) return false;
	if (value.type === 'reactNode' && 'content' in value) return true;
	return false;
};

export const canAddChildren = (component: ComponentSchema): boolean => {
	if (typeof (component as any).canHaveChildren === 'boolean') {
		return (component as any).canHaveChildren as boolean;
	}
	// New structure: children is separated from props
	if (Array.isArray((component as any).children)) {
		return true;
	}
	if (component && (component as any).properties) {
		const maybeChildren = (
			(component as any).properties as Record<string, unknown>
		)['children'];
		if (isReactNodeProperty(maybeChildren)) {
			return true;
		}
	}
	const legacyContainerTypes = new Set(['Container', 'DynamicForm', 'Custom']);
	return legacyContainerTypes.has(component.type);
};

export const supportsArrayProps = (componentType: string): boolean => {
	const componentsWithArrayProps = ['DynamicForm', 'Container'];
	return componentsWithArrayProps.includes(componentType);
};
