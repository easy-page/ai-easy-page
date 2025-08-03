import { FormStoreImpl } from './store/store';
import { FieldValue } from './types';

export const createFormStore = (
	initialValues: Record<string, FieldValue> = {}
): FormStoreImpl => {
	return new FormStoreImpl(initialValues);
};
