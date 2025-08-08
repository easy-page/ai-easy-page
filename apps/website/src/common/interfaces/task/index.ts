import { ResourceType, TaskStatus } from '../../constants/task';
import { WsClientMsg } from '../messages/wsMessages/wsClient';
import {
	WsServerMsg,
	TaskProgressContent,
} from '../messages/wsMessages/wsServer';
import { UserClientMessage } from '../messages/chatMessages/client';

/** 用于会话消息里返回的简单任务信息 */
export type SimpleTaskInfo = {
	id: number;
	name: string;
	description: string;
	status: TaskStatus;
	type: TaskType;
};

export type TaskStepRunInfo = {
	status: TaskStatus;
	failed_reason: string | null;
	messages: Array<WsClientMsg | WsServerMsg>;
	agent_result: TaskProgressContent | null;
	state: any;
};

export type TaskRunInfo = {
	status: TaskStatus;
	conclusion?: string;
	failed_reason: string | null;
	step_results: { [key: number | string]: TaskStepRunInfo };
	new_step_results: { [key: string]: any };
	messages: Array<WsClientMsg | WsServerMsg>;
};

export interface ToolConfig {
	resource_type: ResourceType;
	config: any;
	resource_id: string;
	resource_name: string;
}

export interface AgentConfig {
	prompt: string;
	model: any;
	tools: ToolConfig[];
	show_tool_calls: boolean;
	tool_call_limit: null | number;
	tool_choice: null | string;
	markdown: boolean;
	use_json_mode: boolean;
	add_history_to_messages: boolean;
	num_history_responses: number;
	system_message: null | string;
	system_message_role: string;
	create_default_system_message: boolean;
	goal: string;
	instructions: string;
	expected_output: string;
	additional_context: string;
	add_datetime_to_instructions: boolean;
	add_state_in_messages: boolean;
	user_message_role: string;
	parse_response: boolean;
	structured_outputs: boolean;
	save_response_to_file: null | string;
	stream: boolean;
	name: string;
	resource_id: string;
	stream_intermediate_steps: boolean;
}

export interface TaskStep {
	index: number;
	name: string;
	description: string;
	agent_config?: AgentConfig;
	agent_config_id?: string;
}

export enum TaskType {
	LUI = 'language_user_interaction',
	AUTOMATIC = 'automatic',
}

export enum SenceTypeEnum {
	DeleteSqsCoupon = 'delete_sqs_coupon',
	BatchApplyShyAct = 'batch_apply_shy_act',
	CancelShyActApply = 'cancel_shy_act_apply',
	MultiShyActApply = 'multi_shy_act_apply',
	QueryCouponApply = 'query_coupon_apply',
	AppendSqsCoupon = 'append_sqs_coupon',
	QueryApplyShyActRate = 'query_apply_shy_act_rate',
	// 支持为门店已报名的日常神券活动追加美补（上传门店ID的Excel）
	AddMeituanSubsidy = 'add_meituan_subsidy',
	// 支持多门店批量追加美补【录入门店ID】
	ByInputAddMeituanSubsidy = 'by_input_add_meituan_subsidy',
	// 持多门店批量取消美补【上传文件】
	CancalMeituanSubsidy = 'batch_cancal_meituan_subsidy',
	// 持多门店批量取消美补【录入门店ID】
	ByInputCancalMeituanSubsidy = 'by_input_cancal_meituan_subsidy',
	// 支持按品牌ID追加美补【录入品牌ID】
	AddMeituanSubsidyByBrandid = 'add_meituan_subsidy_by_brandId',
	// 支持按品牌ID取消美补【录入品牌ID】
	CancelMeituanSubsidyByBrandId = 'cancel_meituan_subsidy_by_brandId',
}

export interface SenceInfo {
	sence_desc: string;
	sence_type: SenceTypeEnum;
	sence_params: {
		key: string;
		desc: string;
		name: string;
		value: string;
	}[];
}

export interface FullTaskInfo {
	name: string;
	description: string;
	conversation_id: string;
	message_id: string;
	message: UserClientMessage;
	instructions: null | string;
	sence_info: SenceInfo;
	type: TaskType;
	task_steps: TaskStep[];
	id: number;
	failed_reason: string;
	status: TaskStatus;
	created_at: number;
	updated_at: number;
	user_name: string;
	is_deleted: boolean;
	childrens: FullTaskInfo[];
	// TODO pikun 待补充
	agent_team_config: null | any;
	duration: number;
	result?: TaskRunInfo;
}
