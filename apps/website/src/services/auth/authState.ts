import { LiveData } from '../../infra/liveData';
import { UserInfo } from '@/apis/auth';
import { Entity } from '@/infra';

export interface AuthState {
	isAuthenticated: boolean;
	user: UserInfo | null;
	token: string | null;
	loading: boolean;
}

export class AuthStateEntity extends Entity {
	private _authState$: LiveData<AuthState> = new LiveData<AuthState>({
		isAuthenticated: false,
		user: null,
		token: localStorage.getItem('token'),
		loading: false,
	});

	constructor() {
		super();
		// 初始化时，如果有token就设置认证状态
		const token = localStorage.getItem('token');
		if (token) {
			this._authState$.next({
				...this._authState$.value,
				isAuthenticated: true,
				token,
			});
		}
	}

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
		localStorage.setItem('token', token);
		this._authState$.next({
			isAuthenticated: true,
			user,
			token,
			loading: false,
		});
	}

	clearAuth() {
		localStorage.removeItem('token');
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
