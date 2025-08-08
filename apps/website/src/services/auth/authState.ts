import { LiveData } from '../../infra/liveData';
import { UserInfo } from '@/apis/auth';

export interface AuthState {
	isAuthenticated: boolean;
	user: UserInfo | null;
	token: string | null;
	loading: boolean;
}

export class AuthStateEntity {
	private _authState$: LiveData<AuthState> = new LiveData<AuthState>({
		isAuthenticated: false,
		user: null,
		token: localStorage.getItem('access_token'),
		loading: false,
	});

	get authState$() {
		return this._authState$;
	}

	get isAuthenticated() {
		return this._authState$.value.isAuthenticated;
	}

	get user() {
		return this._authState$.value.user;
	}

	get token() {
		return this._authState$.value.token;
	}

	get loading() {
		return this._authState$.value.loading;
	}

	setLoading(loading: boolean) {
		this._authState$.next({
			...this._authState$.value,
			loading,
		});
	}

	setAuth(token: string, user: UserInfo) {
		localStorage.setItem('access_token', token);
		this._authState$.next({
			isAuthenticated: true,
			user,
			token,
			loading: false,
		});
	}

	clearAuth() {
		localStorage.removeItem('access_token');
		this._authState$.next({
			isAuthenticated: false,
			user: null,
			token: null,
			loading: false,
		});
	}

	updateUser(user: UserInfo) {
		this._authState$.next({
			...this._authState$.value,
			user,
		});
	}
}

// 创建全局认证状态实例
export const authState = new AuthStateEntity();
