import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { UNSAFE_NavigationContext } from 'react-router-dom';
import type { FormSchema } from '../Schema';
import { updateVenue } from '@/apis/venue';

interface UseSchemaSaveQueueOptions {
	venueId?: number;
	latestSchema: FormSchema;
	intervalMs?: number;
	enableNavigationBlock?: boolean;
}

interface UseSchemaSaveQueueResult {
	enqueueChange: (propertyPath: string, value: unknown) => void;
	hasPending: boolean;
	flush: (reason?: string) => Promise<void>;
}

export function useSchemaSaveQueue(
	options: UseSchemaSaveQueueOptions
): UseSchemaSaveQueueResult {
	const {
		venueId,
		latestSchema,
		intervalMs = 1500,
		enableNavigationBlock = true,
	} = options;

	const { navigator } = useContext(UNSAFE_NavigationContext) as any;

	const pendingChangesRef = useRef<Record<string, unknown>>({});
	const hasPendingRef = useRef(false);
	const isSavingRef = useRef(false);
	const latestSchemaRef = useRef<FormSchema>(latestSchema);
	const [hasPending, setHasPending] = useState(false);

	useEffect(() => {
		latestSchemaRef.current = latestSchema;
	}, [latestSchema]);

	const enqueueChange = useCallback((propertyPath: string, value: unknown) => {
		pendingChangesRef.current[propertyPath] = value;
		hasPendingRef.current = true;
		setHasPending(true);
	}, []);

	const flush = useCallback(
		async (reason: string = 'interval') => {
			if (isSavingRef.current) return;
			if (!hasPendingRef.current) return;
			if (!venueId) return;

			isSavingRef.current = true;
			try {
				const schemaToSave = latestSchemaRef.current;
				await updateVenue({
					venue_id: String(venueId),
					venue_data: { page_schema: schemaToSave },
				});
				pendingChangesRef.current = {};
				hasPendingRef.current = false;
				setHasPending(false);
			} catch (error) {
				// 失败时保留队列，等待下次 flush
				// eslint-disable-next-line no-console
				console.error(`保存队列（${reason}）失败:`, error);
			} finally {
				isSavingRef.current = false;
			}
		},
		[venueId]
	);

	// 周期性 flush
	useEffect(() => {
		const timer = setInterval(() => {
			flush('interval');
		}, intervalMs);
		return () => clearInterval(timer);
	}, [flush, intervalMs]);

	// 浏览器关闭/刷新拦截（仅能提示，无法等待异步保存）
	useEffect(() => {
		const handler = (e: BeforeUnloadEvent) => {
			if (hasPendingRef.current || isSavingRef.current) {
				e.preventDefault();
				e.returnValue = '你有未保存的更改，确定要离开吗？';
				return e.returnValue;
			}
			return undefined;
		};
		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	}, []);

	// 应用内路由跳转拦截：保存后再跳
	useEffect(() => {
		if (!enableNavigationBlock) return;
		if (!navigator || typeof navigator.block !== 'function') return;

		const unblock = navigator.block((tx: any) => {
			if (!(hasPendingRef.current || isSavingRef.current)) {
				unblock();
				tx.retry();
				return;
			}
			Modal.confirm({
				title: '有未保存的更改',
				content: '离开前需要保存。是否立即保存并离开？',
				okText: '保存并离开',
				cancelText: '取消',
				onOk: async () => {
					try {
						await flush('navigation');
					} finally {
						unblock();
						tx.retry();
					}
				},
			});
		});
		return unblock;
	}, [navigator, enableNavigationBlock, flush]);

	return { enqueueChange, hasPending, flush };
}
