import { useFormContext } from '../context';
import { FormStore } from '../types';

/**
 * 获取表单 Store 实例的 Hook
 */
export const useFormStore = (): FormStore => {
	const context = useFormContext();
	return context.store;
};
