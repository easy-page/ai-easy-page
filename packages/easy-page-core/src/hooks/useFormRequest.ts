import { useMemo } from 'react';
import { useFormContext } from '../context';

/**
 * 表单请求相关的 Hook
 */
export const useFormRequest = () => {
	const { store } = useFormContext();

	const formRequest = useMemo(
		() => ({
			// 获取字段数据
			getFieldData: (field: string) => store.getFieldData(field),

			// 分发字段请求
			dispatchFieldRequest: (field: string, params?: { keyword?: string }) =>
				store.dispatchFieldRequest(field, params),

			// 获取上下文数据
			getContextData: (key: string) => store.getContextData(key),

			// 获取上下文请求状态
			getContextRequestState: () => store.getContextRequestState(),

			// 获取表单模式
			getFormMode: () => store.getFormMode(),

			// 获取特定请求的状态
			getRequestState: (key: string) => store.getContextRequestState()[key],

			// 检查请求是否加载中
			isRequestLoading: (key: string) =>
				store.getContextRequestState()[key]?.loading || false,

			// 检查请求是否成功
			isRequestSuccess: (key: string) =>
				store.getContextRequestState()[key]?.successed || false,

			// 获取请求错误
			getRequestError: (key: string) =>
				store.getContextRequestState()[key]?.error,
		}),
		[store]
	);

	return formRequest;
};

/**
 * 字段请求 Hook
 */
export const useFieldRequest = (field: string) => {
	const { store } = useFormContext();

	const fieldRequest = useMemo(
		() => ({
			// 获取字段数据
			data: store.getFieldData(field),

			// 分发请求
			dispatch: (params?: { keyword?: string }) =>
				store.dispatchFieldRequest(field, params),

			// 获取请求状态
			state: store.getContextRequestState()[field],

			// 是否加载中
			loading: store.getContextRequestState()[field]?.loading || false,

			// 是否成功
			success: store.getContextRequestState()[field]?.successed || false,

			// 错误信息
			error: store.getContextRequestState()[field]?.error,
		}),
		[store, field]
	);

	return fieldRequest;
};

/**
 * 上下文请求 Hook
 */
export const useContextRequest = (key: string) => {
	const { store } = useFormContext();

	const contextRequest = useMemo(
		() => ({
			// 获取上下文数据
			data: store.getContextData(key),

			// 获取请求状态
			state: store.getContextRequestState()[key],

			// 是否加载中
			loading: store.getContextRequestState()[key]?.loading || false,

			// 是否成功
			success: store.getContextRequestState()[key]?.successed || false,

			// 错误信息
			error: store.getContextRequestState()[key]?.error,
		}),
		[store, key]
	);

	return contextRequest;
};
