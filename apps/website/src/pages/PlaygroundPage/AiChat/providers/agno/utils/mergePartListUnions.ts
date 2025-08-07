import { PartListUnion } from '@shared/message';

export function mergePartListUnions(list: PartListUnion[]): PartListUnion {
	const resultParts: PartListUnion = [];
	for (const item of list) {
		if (Array.isArray(item)) {
			resultParts.push(...item);
		} else {
			resultParts.push(item);
		}
	}
	return resultParts;
}
