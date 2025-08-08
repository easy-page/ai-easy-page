import { postReq, RequestHandler } from './axios';

// 用户信息接口 - 根据服务器端schema修正
export interface UserInfo {
	id: number;
	username: string;
	english_name: string;
	avatar_url?: string;
	email?: string;
	phone?: string;
	status: string;
	created_at: number;
	updated_at: number;
	is_deleted: boolean;
}

// 登录请求参数
export interface LoginParams {
	username: string;
	password: string;
}

// 登录响应 - 根据服务器端schema修正
export interface LoginResponse {
	user: UserInfo;
	token: string;
}

// 注册请求参数 - 根据服务器端schema修正
export interface RegisterParams {
	username: string;
	english_name: string;
	password: string;
	avatar_url?: string;
	email?: string;
	phone?: string;
}

// 修改用户信息参数 - 根据服务器端schema修正
export interface UpdateUserInfoParams {
	username?: string;
	english_name?: string;
	avatar_url?: string;
	email?: string;
	phone?: string;
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
	const result = await postReq('/zspt-agent-api/v1/users/user/login', params);
	return result;
};

// 注册接口
export const register: RequestHandler<RegisterParams, UserInfo> = async (
	params
) => {
	const result = await postReq('/zspt-agent-api/v1/users/user/create', params);
	return result;
};

// 获取用户信息接口
export const getUserInfo: RequestHandler<any, UserInfo> = async () => {
	const result = await postReq('/zspt-agent-api/v1/users/user/me', {});
	return result;
};

// 修改用户信息接口 - 需要用户ID
export const updateUserInfo: RequestHandler<
	{ user_id: number; user_data: UpdateUserInfoParams },
	UserInfo
> = async (params) => {
	const result = await postReq(
		`/zspt-agent-api/v1/users/user/${params.user_id}/update`,
		params.user_data
	);
	return result;
};

// 修改密码接口 - 需要用户ID
export const changePassword: RequestHandler<
	{ user_id: number; password_data: ChangePasswordParams },
	any
> = async (params) => {
	const result = await postReq(
		`/zspt-agent-api/v1/users/user/${params.user_id}/password`,
		params.password_data
	);
	return result;
};

// 登出接口
export const logout: RequestHandler<any, any> = async () => {
	const result = await postReq('/zspt-agent-api/v1/users/user/logout', {});
	return result;
};
