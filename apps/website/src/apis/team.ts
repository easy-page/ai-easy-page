import { postReq, getReq, RequestHandler } from './axios';

// 团队成员信息
export interface TeamMember {
	user_name: string;
	role: string;
	joined_at: string;
}

// 团队基础信息
export interface TeamBase {
	name: string;
	description?: string;
	icon?: string;
}

// 创建团队请求
export interface TeamCreateParams extends TeamBase {
	members?: TeamMember[];
}

// 修改团队请求
export interface TeamUpdateParams {
	name?: string;
	description?: string;
	icon?: string;
	admin_user?: string;
	members?: TeamMember[];
	status?: 'active' | 'inactive';
}

// 查询团队列表请求
export interface TeamQueryParams {
	name?: string;
	page_size?: number;
	page_num?: number;
}

// 查询团队详情请求
export interface TeamDetailParams {
	team_id: number;
}

// 团队响应信息
export interface TeamInfo extends TeamBase {
	id: number;
	admin_user: string;
	members: string;
	status: 'active' | 'inactive';
	created_at: string;
	updated_at: string;
}

// 团队列表响应
export interface TeamListResponse {
	data: TeamInfo[];
	total: number;
}

// 通用API响应
export interface ApiResponse<T = any> {
	code: number;
	message: string;
	data?: T;
}

// 创建团队
export const createTeam: RequestHandler<TeamCreateParams, TeamInfo> = (
	params
) => {
	return postReq('/zspt-agent-api/v1/teams/create', params);
};

// 修改团队
export const updateTeam: RequestHandler<
	{ team_id: number; team_data: TeamUpdateParams },
	ApiResponse
> = (params) => {
	return postReq('/zspt-agent-api/v1/teams/update', params);
};

// 查询团队列表
export const queryTeams: RequestHandler<TeamQueryParams, TeamListResponse> = (
	params
) => {
	return postReq('/zspt-agent-api/v1/teams/query', params);
};

// 查询团队详情
export const getTeamDetail: RequestHandler<TeamDetailParams, TeamInfo> = (
	params
) => {
	return postReq('/zspt-agent-api/v1/teams/detail', params);
};

// 加入团队
export const joinTeam: RequestHandler<{ team_id: number }, ApiResponse> = (
	params
) => {
	return postReq('/zspt-agent-api/v1/teams/join', params);
};

// 离开团队
export const leaveTeam: RequestHandler<{ team_id: number }, ApiResponse> = (
	params
) => {
	return postReq('/zspt-agent-api/v1/teams/leave', params);
};

// 邀请成员
export const inviteMember: RequestHandler<
	{ team_id: number; user_name: string; role?: string },
	ApiResponse
> = (params) => {
	return postReq('/zspt-agent-api/v1/teams/invite', params);
};

// 移除成员
export const removeMember: RequestHandler<
	{ team_id: number; user_name: string },
	ApiResponse
> = (params) => {
	return postReq('/zspt-agent-api/v1/teams/remove-member', params);
};

// 更新成员角色
export const updateMemberRole: RequestHandler<
	{ team_id: number; user_name: string; role: string },
	ApiResponse
> = (params) => {
	return postReq('/zspt-agent-api/v1/teams/update-member-role', params);
};
