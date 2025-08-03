import { useEffect, useRef } from 'react';
import { FormStore, ExternalStateListener } from '../types';

/**
 * 外部状态监听 Hook
 * @param store 表单 store 实例
 * @param externalState 外部状态
 * @param listeners 监听器配置数组
 */
export function useExternalStateListener(
	store: FormStore,
	externalState: any,
	listeners: Omit<ExternalStateListener, 'id'>[]
): void {
	const listenerIdsRef = useRef<string[]>([]);

	useEffect(() => {
		// 清理之前的监听器
		listenerIdsRef.current.forEach((id) => {
			store.unregisterExternalStateListener(id);
		});
		listenerIdsRef.current = [];

		// 注册新的监听器
		listeners.forEach((listener, index) => {
			const id = `listener-${Date.now()}-${index}`;
			store.registerExternalStateListener({
				...listener,
				id,
			});
			listenerIdsRef.current.push(id);
		});

		// 清理函数
		return () => {
			listenerIdsRef.current.forEach((id) => {
				store.unregisterExternalStateListener(id);
			});
			listenerIdsRef.current = [];
		};
	}, [store, listeners]);

	// 当外部状态变化时，更新表单字段
	useEffect(() => {
		if (externalState !== undefined) {
			store.updateFromExternalState(externalState);
		}
	}, [store, externalState]);
}
