import { Service } from '@/infra';
import { AuthStateEntity } from './authState';
import {
	UserInfo,
	login as loginApi,
	register as registerApi,
	getUserInfo as getUserInfoApi,
	logout as logoutApi,
	updateUserInfo as updateUserInfoApi,
	changePassword as changePasswordApi,
	UpdateUserInfoParams,
	ChangePasswordParams,
} from '@/apis/auth';

export interface LoginParams {
	username: string;
	password: string;
}

export interface RegisterParams {
	username: string;
	email: string;
	password: string;
	nickname?: string;
}

export interface AuthResponse {
	success: boolean;
	message?: string;
	data?: {
		token: string;
		user: UserInfo;
	};
}

export class AuthService extends Service {
	authState = this.framework.createEntity(AuthStateEntity);

	async login(params: LoginParams): Promise<AuthResponse> {
		this.authState.setLoading(true);

		try {
			const result = await loginApi(params);

			if (result.success && result.data) {
				const { access_token, user } = result.data;
				this.authState.setAuth(access_token, user);
				return { success: true, data: { token: access_token, user } };
			} else {
				return { success: false, message: result.message || '登录失败' };
			}
		} catch (error: any) {
			return { success: false, message: error.message || '登录失败' };
		} finally {
			this.authState.setLoading(false);
		}
	}

	async register(params: RegisterParams): Promise<AuthResponse> {
		this.authState.setLoading(true);

		try {
			const result = await registerApi(params);

			if (result.success && result.data) {
				return { success: true, message: '注册成功' };
			} else {
				return { success: false, message: result.message || '注册失败' };
			}
		} catch (error: any) {
			return { success: false, message: error.message || '注册失败' };
		} finally {
			this.authState.setLoading(false);
		}
	}

	async logout(): Promise<void> {
		try {
			await logoutApi({});
		} catch (error) {
			console.error('登出失败:', error);
		} finally {
			this.authState.clearAuth();
		}
	}

	async getCurrentUser(): Promise<UserInfo | null> {
		return this.authState.user;
	}

	async getUserInfo(): Promise<AuthResponse> {
		try {
			const result = await getUserInfoApi({});

			if (result.success && result.data) {
				this.authState.updateUser(result.data);
				return {
					success: true,
					data: { token: this.authState.token || '', user: result.data },
				};
			} else {
				return {
					success: false,
					message: result.message || '获取用户信息失败',
				};
			}
		} catch (error: any) {
			return { success: false, message: error.message || '获取用户信息失败' };
		}
	}

	async refreshToken(): Promise<boolean> {
		try {
			// 这里应该是实际的token刷新逻辑
			// const response = await api.refreshToken();
			return true;
		} catch (error) {
			this.authState.clearAuth();
			return false;
		}
	}

	async checkAuthStatus(): Promise<boolean> {
		const token = this.authState.token;
		if (!token) {
			return false;
		}

		try {
			const result = await this.getUserInfo();
			if (result.success) {
				return true;
			} else {
				this.authState.clearAuth();
				return false;
			}
		} catch (error) {
			this.authState.clearAuth();
			return false;
		}
	}

	async updateUserInfo(params: UpdateUserInfoParams): Promise<AuthResponse> {
		try {
			const result = await updateUserInfoApi(params);

			if (result.success && result.data) {
				this.authState.updateUser(result.data);
				return {
					success: true,
					data: { token: this.authState.token || '', user: result.data },
				};
			} else {
				return {
					success: false,
					message: result.message || '修改用户信息失败',
				};
			}
		} catch (error: any) {
			return { success: false, message: error.message || '修改用户信息失败' };
		}
	}

	async changePassword(params: ChangePasswordParams): Promise<AuthResponse> {
		try {
			const result = await changePasswordApi(params);

			if (result.success) {
				return { success: true, message: '密码修改成功' };
			} else {
				return { success: false, message: result.message || '密码修改失败' };
			}
		} catch (error: any) {
			return { success: false, message: error.message || '密码修改失败' };
		}
	}
}
