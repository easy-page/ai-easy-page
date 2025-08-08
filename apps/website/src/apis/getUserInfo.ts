import { postReq, RequestHandler } from './axios';

export interface Role {
	id: number;
	name: string;
}
export interface UserInfo {
	roles?: Array<Role>;
	mis: string;
}

export const getUserInfo: RequestHandler<any, UserInfo> = async () => {
	const result = await postReq('/api/zspt/operation/common/getUserInfo', {});
	return result?.data;
};
