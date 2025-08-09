import { postReq, getReq, RequestHandler } from './axios';

// 项目类型，与后端保持一致
export enum ProjectType {
	PERSONAL = 'personal',
	TEAM = 'team',
	PUBLIC = 'public',
}

export const PROJECT_TYPE_CONFIG = {
	[ProjectType.PERSONAL]: { color: 'cyan', text: '个人' },
	[ProjectType.TEAM]: { color: 'blue', text: '团队' },
	[ProjectType.PUBLIC]: { color: 'gold', text: '公共' },
} as const;

// 项目基础信息（与表结构对齐）
export interface ProjectBase {
	name: string;
	icon_url?: string;
	tags?: string; // 逗号分隔
	project_type: ProjectType;
	team_id?: number | null; // 团队ID，个人项目时可为null/undefined
}

// 创建项目请求
export type ProjectCreateParams = ProjectBase;

// 修改项目请求
export interface ProjectUpdateParams extends Partial<ProjectBase> {
	is_deleted?: boolean;
}

// 查询项目列表请求
export interface ProjectQueryParams {
	team_id?: number;
	project_type?: ProjectType;
	keyword?: string;
	page_size?: number;
	page_num?: number;
}

// 项目信息（与表结构对齐，保留少量可选字段用于兼容UI）
export interface ProjectInfo extends Omit<ProjectBase, 'team_id'> {
	id: number;
	team_id: number | null;
	admin_users?: any[];
	member_users?: any[];
	created_at: string;
	updated_at: string;
	is_deleted: boolean;
	// 兼容UI的可选字段
	created_by?: string;
	venue_count?: number;
	description?: string;
}

// 项目列表响应
export interface ProjectListResponse {
	total: number;
	items: ProjectInfo[];
}

// 项目统计信息（后端统计结构，保持不变）
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
	return postReq('/zspt-agent-api/v1/projects/create-prj', params);
};

// 修改项目
export const updateProject: RequestHandler<
	{ project_id: number; project_data: ProjectUpdateParams },
	ProjectInfo
> = (params) => {
	return postReq('/zspt-agent-api/v1/projects/update-prj', params);
};

// 查询项目列表
export const queryProjects: RequestHandler<
	ProjectQueryParams,
	ProjectListResponse
> = (params) => {
	return postReq('/zspt-agent-api/v1/projects/query-prj', params);
};

// 查询项目详情
export const getProjectDetail: RequestHandler<
	{ project_id: number },
	ProjectInfo
> = (params) => {
	return postReq('/zspt-agent-api/v1/projects/detail-prj', params);
};

// 删除项目
export const deleteProject: RequestHandler<
	{ project_id: number },
	{ success: boolean }
> = (params) => {
	return postReq('/zspt-agent-api/v1/projects/delete-prj', params);
};

// 归档项目
export const archiveProject: RequestHandler<
	{ project_id: number },
	ProjectInfo
> = (params) => {
	return postReq('/zspt-agent-api/v1/projects/archive-prj', params);
};

// 复制项目
export const copyProject: RequestHandler<
	{ project_id: number; name: string },
	ProjectInfo
> = (params) => {
	return postReq('/zspt-agent-api/v1/projects/copy-prj', params);
};

// 获取项目统计
export const getProjectStats: RequestHandler<
	{ project_id: number; date_range?: string },
	ProjectStats
> = (params) => {
	return getReq('/zspt-agent-api/v1/projects/stats', params);
};

// 获取项目下的会场列表
export const getProjectVenues: RequestHandler<
	{ project_id: number; page_size?: number; page_num?: number },
	{ data: any[]; total: number }
> = (params) => {
	return postReq('/zspt-agent-api/v1/projects/venues', params);
};
