import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { UNSAFE_NavigationContext } from 'react-router-dom';
import { updateVenue } from '@/apis/venue';
import { useService } from '@/infra';
import { ChatService } from '@/services/chatGlobalState';
import { useObservable } from '@/hooks/useObservable';
import { EMPTY_FORM_SCHEMA } from '@/pages/PlaygroundPage/Schema/form';

interface UseSchemaSaveQueueOptions {
	venueId?: number;
	enableNavigationBlock?: boolean;
}

interface UseSchemaSaveQueueResult {
	saveNow: () => Promise<boolean>;
	saving: boolean;
}

export function useSchemaSaveQueue(
	options: UseSchemaSaveQueueOptions
): UseSchemaSaveQueueResult {
	const { venueId, enableNavigationBlock = true } = options;

	const chatService = useService(ChatService);
	const curVenue = useObservable(chatService.globalState.curVenue$, null);
	const currentSchema = curVenue?.page_schema || EMPTY_FORM_SCHEMA;

	const [saving, setSaving] = useState(false);
	const isSavingRef = useRef(false);
	const { navigator } = useContext(UNSAFE_NavigationContext) as any;

	const saveNow = useCallback(async (): Promise<boolean> => {
		if (!venueId) return false;
		if (isSavingRef.current) return false;
		isSavingRef.current = true;
		setSaving(true);
		try {
			const res = await updateVenue({
				venue_id: String(venueId),
				venue_data: { page_schema: currentSchema },
			});
			if (!res.success) {
				console.log('save failed result:', res);
				if (res.message) message.error(res.message);
				return false;
			}
			return true;
		} catch (err) {
			message.error('保存失败，请稍后重试');
			return false;
		} finally {
			isSavingRef.current = false;
			setSaving(false);
		}
	}, [venueId, currentSchema]);

	// 应用内路由跳转拦截：自动保存后再跳转
	useEffect(() => {
		if (!enableNavigationBlock) return;
		if (!navigator || typeof navigator.block !== 'function') return;

		const unblock = navigator.block((tx: any) => {
			const modal = Modal.info({
				title: '正在保存更改',
				content: '请稍候，保存完成后将自动离开当前页面…',
				okButtonProps: { style: { display: 'none' } as any },
				closable: false,
				maskClosable: false,
				centered: true,
			}) as any;

			(async () => {
				try {
					await saveNow();
				} finally {
					if (modal && typeof modal.destroy === 'function') {
						modal.destroy();
					} else {
						Modal.destroyAll();
					}
					unblock();
					tx.retry();
				}
			})();
		});
		return unblock;
	}, [navigator, enableNavigationBlock, saveNow]);

	// 刷新/关闭页面前：尝试使用 keepalive 发送保存请求，并显示离开前提示
	useEffect(() => {
		if (!venueId) return;

		const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
			// 使用 keepalive 异步保存，无法真正阻塞，但能尽量在关闭前发送
			try {
				const payload = JSON.stringify({
					venue_id: String(venueId),
					venue_data: { page_schema: currentSchema },
				});
				// 相对路径与应用相同 origin 的接口路径保持一致
				window.navigator?.sendBeacon?.(
					'/zspt-agent-api/v1/venues/update',
					new Blob([payload], { type: 'application/json' })
				);
			} catch {}

			e.preventDefault();
			e.returnValue = '正在保存更改，确定要离开吗？';
			return e.returnValue;
		};

		const pageHideHandler = () => {
			// 双保险：在页面隐藏时也尝试 keepalive 保存
			try {
				const payload = JSON.stringify({
					venue_id: String(venueId),
					venue_data: { page_schema: currentSchema },
				});
				fetch('/zspt-agent-api/v1/venues/update', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: payload,
					keepalive: true,
				}).catch(() => void 0);
			} catch {}
		};

		window.addEventListener('beforeunload', beforeUnloadHandler);
		window.addEventListener('pagehide', pageHideHandler);
		document.addEventListener('visibilitychange', pageHideHandler);
		return () => {
			window.removeEventListener('beforeunload', beforeUnloadHandler);
			window.removeEventListener('pagehide', pageHideHandler);
			document.removeEventListener('visibilitychange', pageHideHandler);
		};
	}, [venueId, currentSchema]);

	// 监听 Command+S / Ctrl+S 进行保存
	useEffect(() => {
		const keydownHandler = async (e: KeyboardEvent) => {
			const isSaveCombo =
				(e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S');
			if (!isSaveCombo) return;
			e.preventDefault();
			const ok = await saveNow();
			if (ok) message.success('保存成功');
		};
		window.addEventListener('keydown', keydownHandler);
		return () => window.removeEventListener('keydown', keydownHandler);
	}, [saveNow]);

	return { saveNow, saving };
}
