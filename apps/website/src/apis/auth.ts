import { postReq, RequestHandler } from './axios';

// 用户信息接口
export interface UserInfo {
	id: number;
	username: string;
	email: string;
	nickname?: string;
	avatar?: string;
	roles?: Array<Role>;
	mis: string;
	created_at: string;
	updated_at: string;
}

export interface Role {
	id: number;
	name: string;
}

// 登录请求参数
export interface LoginParams {
	username: string;
	password: string;
}

// 登录响应
export interface LoginResponse {
	access_token: string;
	token_type: string;
	user: UserInfo;
}

// 注册请求参数
export interface RegisterParams {
	username: string;
	email: string;
	password: string;
	nickname?: string;
}

// 修改用户信息参数
export interface UpdateUserInfoParams {
	nickname?: string;
	email?: string;
	avatar?: string;
}

// 修改密码参数
export interface ChangePasswordParams {
	old_password: string;
	new_password: string;
}

// 登录接口
export const login: RequestHandler<LoginParams, LoginResponse> = async (
	params
) => {
	const result = await postReq('/api/auth/login', params);
	return result;
};

// 注册接口
export const register: RequestHandler<RegisterParams, UserInfo> = async (
	params
) => {
	const result = await postReq('/api/auth/register', params);
	return result;
};

// 获取用户信息接口
export const getUserInfo: RequestHandler<any, UserInfo> = async () => {
	const result = await postReq('/api/auth/user', {});
	return result;
};

// 修改用户信息接口
export const updateUserInfo: RequestHandler<
	UpdateUserInfoParams,
	UserInfo
> = async (params) => {
	const result = await postReq('/api/auth/user', params);
	return result;
};

// 修改密码接口
export const changePassword: RequestHandler<ChangePasswordParams, any> = async (
	params
) => {
	const result = await postReq('/api/auth/change-password', params);
	return result;
};

// 登出接口
export const logout: RequestHandler<any, any> = async () => {
	const result = await postReq('/api/auth/logout', {});
	return result;
};
