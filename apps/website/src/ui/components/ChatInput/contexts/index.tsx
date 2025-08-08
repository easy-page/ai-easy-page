import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useObservable } from '../../../../hooks/useObservable';
import { useService } from '@/infra';
import { ChatService } from '../../../../services/chatGlobalState';
import './index.less';
import { ArrowLeftIcon, ArrowRightIcon } from '../../Icons';
import { ContextCard } from '../../ContextCard';
import { ChatMessageContextType } from '../../../../common/interfaces/messages/chatMessages/context';

export const Contexts = () => {
	const chatService = useService(ChatService);
	const curMsgContexts = useObservable(
		chatService.globalState.curMsgContexts$,
		[]
	);

	const containerRef = useRef<HTMLDivElement>(null);
	const [showLeft, setShowLeft] = useState(false);
	const [showRight, setShowRight] = useState(false);

	useEffect(() => {
		if (curMsgContexts.length === 0) {
			setShowLeft(false);
			setShowRight(false);
		}
	}, [curMsgContexts]);

	// 检查是否需要显示箭头
	const checkArrows = () => {
		const el = containerRef.current;
		if (!el) return;
		setShowLeft(el.scrollLeft > 0);
		setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
	};

	useEffect(() => {
		checkArrows();
		const el = containerRef.current;
		if (!el) return;
		el.addEventListener('scroll', checkArrows);
		window.addEventListener('resize', checkArrows);
		return () => {
			el.removeEventListener('scroll', checkArrows);
			window.removeEventListener('resize', checkArrows);
		};
	}, []);

	const scroll = (direction: 'left' | 'right') => {
		const el = containerRef.current;
		if (!el) return;
		const scrollAmount = 200;
		el.scrollBy({
			left: direction === 'left' ? -scrollAmount : scrollAmount,
			behavior: 'smooth',
		});
	};

	const handleDelete = (id: string) => {
		// TODO: 实现删除上下文的逻辑
		console.log('Delete context:', id);
		chatService.globalState.removeCurMsgContext(id);
	};

	const msgContexts = useMemo(() => {
		if (curMsgContexts.length === 0) {
			return [];
		}
		return curMsgContexts.filter(
			(x) => x.type !== ChatMessageContextType.SENCE
		);
	}, [curMsgContexts]);

	if (msgContexts.length === 0) {
		return null;
	}

	return (
		<div className="contexts-wrapper" style={{ position: 'relative' }}>
			{showLeft && (
				<>
					<button className="arrow-btn left" onClick={() => scroll('left')}>
						<ArrowLeftIcon />
					</button>
					<div className="left-gradient" />
				</>
			)}
			<div
				className="contexts"
				ref={containerRef}
				style={{
					overflowX: 'auto',
					display: 'flex',
					gap: '12px',
					scrollbarWidth: 'none',
					msOverflowStyle: 'none',
				}}
			>
				{msgContexts.map((e) => (
					<ContextCard key={e.id} card={e} onDelete={handleDelete} />
				))}
			</div>
			{showRight && (
				<>
					<button className="arrow-btn right" onClick={() => scroll('right')}>
						<ArrowRightIcon />
					</button>
					<div className="right-gradient" />
				</>
			)}
		</div>
	);
};
