import {
	login as loginApi,
	register as registerApi,
	getUserInfo as getUserInfoApi,
	updateUserInfo as updateUserInfoApi,
	changePassword as changePasswordApi,
	logout as logoutApi,
	LoginParams,
	RegisterParams,
	UpdateUserInfoParams,
	ChangePasswordParams,
	UserInfo,
} from '@/apis/auth';
import { authState } from './authState';

export class AuthService {
	/**
	 * 用户登录
	 */
	async login(params: LoginParams) {
		try {
			authState.setLoading(true);
			const result = await loginApi(params);

			if (result.success && result.data) {
				const { access_token, user } = result.data;
				authState.setAuth(access_token, user);
				return { success: true, data: result.data };
			} else {
				return { success: false, message: result.message || '登录失败' };
			}
		} catch (error: any) {
			return { success: false, message: error.message || '登录失败' };
		} finally {
			authState.setLoading(false);
		}
	}

	/**
	 * 用户注册
	 */
	async register(params: RegisterParams) {
		try {
			authState.setLoading(true);
			const result = await registerApi(params);

			if (result.success && result.data) {
				return { success: true, data: result.data };
			} else {
				return { success: false, message: result.message || '注册失败' };
			}
		} catch (error: any) {
			return { success: false, message: error.message || '注册失败' };
		} finally {
			authState.setLoading(false);
		}
	}

	/**
	 * 获取用户信息
	 */
	async getUserInfo() {
		try {
			const result = await getUserInfoApi({});

			if (result.success && result.data) {
				authState.updateUser(result.data);
				return { success: true, data: result.data };
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

	/**
	 * 修改用户信息
	 */
	async updateUserInfo(params: UpdateUserInfoParams) {
		try {
			authState.setLoading(true);
			const result = await updateUserInfoApi(params);

			if (result.success && result.data) {
				authState.updateUser(result.data);
				return { success: true, data: result.data };
			} else {
				return {
					success: false,
					message: result.message || '修改用户信息失败',
				};
			}
		} catch (error: any) {
			return { success: false, message: error.message || '修改用户信息失败' };
		} finally {
			authState.setLoading(false);
		}
	}

	/**
	 * 修改密码
	 */
	async changePassword(params: ChangePasswordParams) {
		try {
			authState.setLoading(true);
			const result = await changePasswordApi(params);

			if (result.success) {
				return { success: true, message: '密码修改成功' };
			} else {
				return { success: false, message: result.message || '密码修改失败' };
			}
		} catch (error: any) {
			return { success: false, message: error.message || '密码修改失败' };
		} finally {
			authState.setLoading(false);
		}
	}

	/**
	 * 用户登出
	 */
	async logout() {
		try {
			await logoutApi({});
		} catch (error) {
			console.error('登出失败:', error);
		} finally {
			authState.clearAuth();
		}
	}

	/**
	 * 检查登录状态
	 */
	async checkAuthStatus() {
		const token = authState.token;
		if (!token) {
			return false;
		}

		try {
			const result = await this.getUserInfo();
			if (result.success) {
				return true;
			} else {
				authState.clearAuth();
				return false;
			}
		} catch (error) {
			authState.clearAuth();
			return false;
		}
	}
}

// 创建全局认证服务实例
export const authService = new AuthService();
