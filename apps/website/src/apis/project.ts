import { postReq, getReq, RequestHandler } from './axios';

// 项目状态枚举
export enum ProjectStatus {
	ACTIVE = 'active', // 活跃
	INACTIVE = 'inactive', // 非活跃
	ARCHIVED = 'archived', // 已归档
	DELETED = 'deleted', // 已删除
}

// 项目状态映射常量
export const PROJECT_STATUS_CONFIG = {
	[ProjectStatus.ACTIVE]: {
		color: 'green',
		text: '活跃',
	},
	[ProjectStatus.INACTIVE]: {
		color: 'orange',
		text: '非活跃',
	},
	[ProjectStatus.ARCHIVED]: {
		color: 'blue',
		text: '已归档',
	},
	[ProjectStatus.DELETED]: {
		color: 'red',
		text: '已删除',
	},
} as const;

// 项目基础信息
export interface ProjectBase {
	name: string;
	description?: string;
	icon?: string;
	workspace_id?: number;
	tags?: string;
	members?: string;
}

// 创建项目请求
export interface ProjectCreateParams extends ProjectBase {
	team_id?: number;
}

// 修改项目请求
export interface ProjectUpdateParams extends Partial<ProjectBase> {
	status?: ProjectStatus;
}

// 查询项目列表请求
export interface ProjectQueryParams {
	team_id?: number;
	status?: ProjectStatus;
	keyword?: string;
	page_size?: number;
	page_num?: number;
}

// 项目信息
export interface ProjectInfo extends ProjectBase {
	id: number;
	status: ProjectStatus;
	team_id: number;
	created_by: string;
	venue_count: number; // 关联的会场数量
	created_at: string;
	updated_at: string;
}

// 项目列表响应
export interface ProjectListResponse {
	data: ProjectInfo[];
	total: number;
	page_size: number;
	page_num: number;
}

// 项目统计信息
export interface ProjectStats {
	total_venues: number;
	total_views: number;
	unique_visitors: number;
	avg_duration: number;
}

// 创建项目
export const createProject: RequestHandler<ProjectCreateParams, ProjectInfo> = (
	params
) => {
	return postReq('/zspt-agent-api/v1/project/create-prj', params);
};

// 修改项目
export const updateProject: RequestHandler<
	{ project_id: number; project_data: ProjectUpdateParams },
	ProjectInfo
> = (params) => {
	return postReq('/zspt-agent-api/v1/project/update-prj', params);
};

// 查询项目列表
export const queryProjects: RequestHandler<
	ProjectQueryParams,
	ProjectListResponse
> = (params) => {
	return postReq('/zspt-agent-api/v1/project/query-prj', params);
};

// 查询项目详情
export const getProjectDetail: RequestHandler<
	{ project_id: number },
	ProjectInfo
> = (params) => {
	return postReq('/zspt-agent-api/v1/project/detail-prj', params);
};

// 删除项目
export const deleteProject: RequestHandler<
	{ project_id: number },
	{ success: boolean }
> = (params) => {
	return postReq('/zspt-agent-api/v1/project/delete-prj', params);
};

// 归档项目
export const archiveProject: RequestHandler<
	{ project_id: number },
	ProjectInfo
> = (params) => {
	return postReq('/zspt-agent-api/v1/project/archive-prj', params);
};

// 复制项目
export const copyProject: RequestHandler<
	{ project_id: number; name: string },
	ProjectInfo
> = (params) => {
	return postReq('/zspt-agent-api/v1/project/copy-prj', params);
};

// 获取项目统计
export const getProjectStats: RequestHandler<
	{ project_id: number; date_range?: string },
	ProjectStats
> = (params) => {
	return getReq('/zspt-agent-api/v1/project/stats', params);
};

// 获取项目下的会场列表
export const getProjectVenues: RequestHandler<
	{ project_id: number; page_size?: number; page_num?: number },
	{ data: any[]; total: number }
> = (params) => {
	return postReq('/zspt-agent-api/v1/project/venues', params);
};
