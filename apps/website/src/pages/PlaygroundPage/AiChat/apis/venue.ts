import { postReq, getReq, RequestHandler } from './axios';

// 会场状态枚举
export enum VenueStatus {
	NORMAL = 'normal', // 正常
	DELETED = 'deleted', // 已删除
}

// 会场状态映射常量
export const VENUE_STATUS_CONFIG = {
	[VenueStatus.NORMAL]: {
		color: 'green',
		text: '正常',
	},
	[VenueStatus.DELETED]: {
		color: 'red',
		text: '已删除',
	},
} as const;

// 会场基础信息
export interface VenueBase {
	name: string;
	description?: string;
	icon?: string;
	git_repo?: string;
	tags?: string;
	venueId?: number;
	members?: string;
}

// 创建会场请求
export interface VenueCreateParams extends VenueBase {
	team_id: number;
}

// 修改会场请求
export interface VenueUpdateParams extends Partial<VenueBase> {
	status?: VenueStatus;
}

// 查询会场列表请求
export interface VenueQueryParams {
	team_id?: number;
	status?: VenueStatus;
	keyword?: string;
	page_size?: number;
	page_num?: number;
}

// 会场信息
export interface VenueInfo extends VenueBase {
	id: number;
	status: VenueStatus;
	team_id: number;
	created_by: string;
	view_count: number;
	created_at: string;
	updated_at: string;
}

// 会场列表响应
export interface VenueListResponse {
	data: VenueInfo[];
	total: number;
}

// 会场统计信息
export interface VenueStats {
	total_views: number;
	unique_visitors: number;
	bounce_rate: number;
	avg_duration: number;
	conversion_rate: number;
}

// 创建本地仓库参数
export interface CreateLocalRepoParams {
	venueName: string;
	venueDescription: string;
	venueId: number;
	gitTemplate?: string;
}

// 创建本地仓库结果
export interface CreateLocalRepoResult {
	path: string;
	projectId: string;
}

// 创建会场
export const createVenue: RequestHandler<VenueCreateParams, VenueInfo> = (
	params
) => {
	return postReq('/zspt-agent-api/v1/venues/create', params);
};

// 修改会场
export const updateVenue: RequestHandler<
	{ venue_id: string; venue_data: VenueUpdateParams },
	VenueInfo
> = (params) => {
	return postReq('/zspt-agent-api/v1/venues/update', params);
};

// 查询会场列表
export const queryVenues: RequestHandler<
	VenueQueryParams,
	VenueListResponse
> = (params) => {
	return postReq('/zspt-agent-api/v1/venues/query', params);
};

// 查询会场详情
export const getVenueDetail: RequestHandler<{ venueId: number }, VenueInfo> = (
	params
) => {
	return postReq('/zspt-agent-api/v1/venues/detail', {
		venue_id: params.venueId,
	});
};

// 删除会场
export const deleteVenue: RequestHandler<
	{ venue_id: string },
	{ success: boolean }
> = (params) => {
	return postReq('/zspt-agent-api/v1/venues/delete', params);
};

// 发布会场
export const publishVenue: RequestHandler<{ venue_id: string }, VenueInfo> = (
	params
) => {
	return postReq('/zspt-agent-api/v1/venues/publish', params);
};

// 归档会场
export const archiveVenue: RequestHandler<{ venue_id: string }, VenueInfo> = (
	params
) => {
	return postReq('/zspt-agent-api/v1/venues/archive', params);
};

// 复制会场
export const copyVenue: RequestHandler<
	{ venue_id: string; name: string },
	VenueInfo
> = (params) => {
	return postReq('/zspt-agent-api/v1/venues/copy', params);
};

// 获取会场统计
export const getVenueStats: RequestHandler<
	{ venue_id: string; date_range?: string },
	VenueStats
> = (params) => {
	return getReq('/zspt-agent-api/v1/venues/stats', params);
};

// 创建本地仓库
export const createLocalRepo: RequestHandler<
	CreateLocalRepoParams,
	CreateLocalRepoResult
> = (params) => {
	return postReq('/zspt-agent-api/v1/venues/create-local-repo', params);
};
