import { useService } from '@/infra';
import { useObservable } from './useObservable';
import { AuthService } from '../services/auth/authService';

export const useAuth = () => {
	const authService = useService(AuthService);
	const authState = useObservable(authService.authState.authState$, null);

	return {
		authService,
		authState,
		isAuthenticated: authState?.isAuthenticated || false,
		user: authState?.user || null,
		token: authState?.token || null,
		loading: authState?.loading || false,
	};
};
