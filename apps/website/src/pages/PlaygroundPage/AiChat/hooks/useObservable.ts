import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

export function useObservable<T>(
	observable: Observable<T>,
	initialValue: T
): T {
	const [value, setValue] = useState<T>(initialValue);

	useEffect(() => {
		const subscription = observable.subscribe((newValue) => {
			setTimeout(() => {
				setValue(newValue);
			}, 10);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [observable]);

	return value;
}
