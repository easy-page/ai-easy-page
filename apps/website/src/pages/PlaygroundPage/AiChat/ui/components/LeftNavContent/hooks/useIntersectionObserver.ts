import { useEffect } from 'react';

type UseIntersectionObserverProps = {
	target: React.RefObject<HTMLElement>;
	onIntersect: (venueId: number) => void;
	enabled?: boolean;
	rootMargin?: string;
	threshold?: number;
	venueId: number;
};

export const useIntersectionObserver = ({
	target,
	onIntersect,
	enabled = true,
	rootMargin = '0px',
	venueId,
	threshold = 0,
}: UseIntersectionObserverProps) => {
	useEffect(() => {
		console.log('enabled', enabled);
		if (!enabled || !target.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						onIntersect(venueId);
					}
				});
			},
			{
				rootMargin,
				threshold,
			}
		);

		observer.observe(target.current);

		return () => {
			observer.disconnect();
		};
	}, [target, enabled, rootMargin, venueId, threshold, onIntersect]);
};
