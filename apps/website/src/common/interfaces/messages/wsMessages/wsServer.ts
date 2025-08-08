import {
	StepWsMsgTypeEnum,
	TaskProgressContentType,
	TaskStatus,
} from '../../../constants/task';
import {
	ConnectStatus,
	WsMessageRole,
	WsServerMsgType,
} from '../../../constants/wsMessages';

export type StepBaseContent = {
	type: TaskProgressContentType;
	role: WsMessageRole;
	as_result?: boolean;
};

// 定义 BaseInlineCard 类型
export type BaseInlineCard = StepBaseContent & {
	inline: true;
};

// 定义 BaseBlockCard 类型
export type BaseBlockCard = StepBaseContent & {
	inline: false;
};

// 定义 TextContent 类型
export type StepTextContent = StepBaseContent & {
	type: TaskProgressContentType.TEXT;
	text: string;
	role?: WsMessageRole;
	as_result?: boolean;
};

export type ToolCallRes = {
	success: boolean;
	error?: string;
	call_id: string;
	data?: any;
};

export type RenderProps = {
	tool_call_res?: ToolCallRes[];
	json?: any;
};
export type TaskUIComponentCommonProps = {
	// 进入组件渲染的 Props
	renderProps: RenderProps;
	// 回填之前的数据等交互状态
	state?: any;
	// 当步骤结束后，不可再做任何交互
	readonly?: boolean;

	isTaskFailed?: boolean;

	isTaskStepFailed?: boolean;
};

export type StepComponentContent = StepBaseContent & {
	type: TaskProgressContentType.COMPONENT;
	component: string;
	props?: RenderProps;
	initState?: Record<string, any>;
};

// 定义 DocContent 类型
export type StepDocContent = StepBaseContent & {
	type: TaskProgressContentType.DOC;
	text: string;
	role?: WsMessageRole;
	as_result?: boolean;
};

// 定义 ImageContent 类型
export type StepImageContent = StepBaseContent & {
	type: TaskProgressContentType.IMAGE;
	text: string;
	url: string;
	width?: number;
	height?: number;
	role?: WsMessageRole;
	as_result?: boolean;
};
export type TaskProgressContent =
	| StepComponentContent
	| StepTextContent
	| StepDocContent
	| StepImageContent;

// class ToolCallInfo(BaseModel):
// tool_name: str
// tool_id: str
// tool_type: str
// tool_params: dict
// start_time: int
// end_time: int
// duration: int
// tool_result: dict

export type ToolCallContent = {
	tool_name: string;
	tool_id: string;
	tool_type: string;
	tool_params: Record<string, any>;
	start_time: number;
	end_time: number;
	duration: number;
	call_id: string;
	tool_result?: Record<string, any>;
	trace_id: string;
	reason?: string;
};

export type WsServerMsg = {
	source: StepWsMsgTypeEnum.Server;
	type: WsServerMsgType;
	id: string;
	connect_status?: ConnectStatus;
	timestamp?: number;
	content?: string;
	message?: string;
	task_id?: number;
	task_step_index?: number;
	task_status?: TaskStatus;
	task_status_reason?: string;
	task_progress?: TaskProgressContent;
	task_state?: any;
	tool_call_info?: ToolCallContent;
};
