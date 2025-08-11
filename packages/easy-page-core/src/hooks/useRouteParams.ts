import { useCallback, useEffect, useState } from 'react';
import { useFormStore } from './useFormStore';
import { RouteParamsChangeEvent } from '../types';

/**
 * 路由参数管理 Hook
 * 提供便捷的路由参数获取和设置方法
 */
export const useRouteParams = () => {
	const store = useFormStore();
	const [lastChangeEvent, setLastChangeEvent] = useState<RouteParamsChangeEvent | null>(null);

	// 监听路由参数变化
	useEffect(() => {
		const handleRouteParamsChange = (event: RouteParamsChangeEvent) => {
			setLastChangeEvent(event);
		};

		store.setRouteParamsChangeCallback(handleRouteParamsChange);

		// 清理函数
		return () => {
			store.setRouteParamsChangeCallback(() => {});
		};
	}, [store]);

	// 获取所有路由参数
	const getRouteParams = useCallback(() => {
		return store.getRouteParams();
	}, [store]);

	// 获取单个路由参数
	const getRouteParam = useCallback(
		(key: string) => {
			return store.getRouteParam(key);
		},
		[store]
	);

	// 设置所有路由参数
	const setRouteParams = useCallback(
		(params: Record<string, string>) => {
			store.setRouteParams(params);
		},
		[store]
	);

	// 设置单个路由参数
	const setRouteParam = useCallback(
		(key: string, value: string) => {
			store.setRouteParam(key, value);
		},
		[store]
	);

	// 移除单个路由参数
	const removeRouteParam = useCallback(
		(key: string) => {
			store.removeRouteParam(key);
		},
		[store]
	);

	// 更新路由参数（合并）
	const updateRouteParams = useCallback(
		(params: Record<string, string>) => {
			store.updateRouteParams(params);
		},
		[store]
	);

	// 清空所有路由参数
	const clearRouteParams = useCallback(() => {
		store.clearRouteParams();
	}, [store]);

	// 更新浏览器URL
	const updateBrowserUrl = useCallback(
		(replace: boolean = false) => {
			store.updateBrowserUrl(replace);
		},
		[store]
	);

	// 构建查询字符串
	const buildQueryString = useCallback(() => {
		return store.buildQueryString();
	}, [store]);

	// 重置路由参数
	const resetRouteParams = useCallback(() => {
		store.resetRouteParams();
	}, [store]);

	return {
		// 状态
		routeParams: store.state.routeParams,
		lastChangeEvent, // 最后一次变化事件

		// 方法
		getRouteParams,
		getRouteParam,
		setRouteParams,
		setRouteParam,
		removeRouteParam,
		updateRouteParams,
		clearRouteParams,
		updateBrowserUrl,
		buildQueryString,
		resetRouteParams,
	};
};
