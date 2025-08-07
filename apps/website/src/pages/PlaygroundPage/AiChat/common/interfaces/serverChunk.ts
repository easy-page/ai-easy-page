import { PartListUnion } from './message';

export type FrontCompletedToolCall =
	| FrontSuccessfulToolCall
	| FrontCancelledToolCall
	| FrontErroredToolCall
	| FrontWaitingToolCall
	| FrontExecutingToolCall
	| FrontValidatingToolCall
	| FrontScheduledToolCall;

export type FrontSuccessfulToolCall = {
	status: 'success';
	request: ToolCallRequestInfo;
	response: ToolCallResponseInfo;
	durationMs?: number;
	outcome?: ToolConfirmationOutcome;
};

// export type FrontWaitingToolCall = {
// 	status: 'awaiting_approval';
// 	request: ToolCallRequestInfo;
// 	confirmationDetails: FrontToolCallConfirmationDetails;
// 	startTime?: number;
// 	outcome?: ToolConfirmationOutcome;
// };

export type FrontErroredToolCall = {
	status: 'error';
	request: ToolCallRequestInfo;
	response: ToolCallResponseInfo;
	durationMs?: number;
	outcome?: ToolConfirmationOutcome;
};

export type FrontCancelledToolCall = {
	status: 'cancelled';
	request: ToolCallRequestInfo;
	response: ToolCallResponseInfo;
	durationMs?: number;
	outcome?: ToolConfirmationOutcome;
};

export type FrontValidatingToolCall = {
	status: 'validating';
	request: ToolCallRequestInfo;
	startTime?: number;
	outcome?: ToolConfirmationOutcome;
};

export type FrontScheduledToolCall = {
	status: 'scheduled';
	request: ToolCallRequestInfo;
	startTime?: number;
	outcome?: ToolConfirmationOutcome;
};

export type FrontToolCall =
	| FrontValidatingToolCall
	| FrontScheduledToolCall
	| FrontErroredToolCall
	| FrontSuccessfulToolCall
	| FrontExecutingToolCall
	| FrontCancelledToolCall
	| FrontWaitingToolCall;

export type FrontExecutingToolCall = {
	status: 'executing';
	request: ToolCallRequestInfo;
	liveOutput?: string;
	startTime?: number;
	outcome?: ToolConfirmationOutcome;
};

export type FrontToolCallConfirmationDetails = Omit<
	ToolCallConfirmationDetails,
	'onConfirm'
>;

export type FrontWaitingToolCall = {
	status: 'awaiting_approval';
	request: ToolCallRequestInfo;
	confirmationDetails: FrontToolCallConfirmationDetails;
	startTime?: number;
	outcome?: ToolConfirmationOutcome;
};

export enum ToolConfirmationOutcome {
	ProceedOnce = 'proceed_once',
	ProceedAlways = 'proceed_always',
	ProceedAlwaysServer = 'proceed_always_server',
	ProceedAlwaysTool = 'proceed_always_tool',
	ModifyWithEditor = 'modify_with_editor',
	Cancel = 'cancel',
}

export interface ToolConfirmationPayload {
	// used to override `modifiedProposedContent` for modifiable tools in the
	// inline modify flow
	newContent: string;
}

export interface ToolEditConfirmationDetails {
	type: 'edit';
	title: string;
	onConfirm: (
		outcome: ToolConfirmationOutcome,
		payload?: ToolConfirmationPayload
	) => Promise<void>;
	fileName: string;
	fileDiff: string;
	isModifying?: boolean;
}

export interface ToolExecuteConfirmationDetails {
	type: 'exec';
	title: string;
	onConfirm: (outcome: ToolConfirmationOutcome) => Promise<void>;
	command: string;
	rootCommand: string;
}

export interface ToolMcpConfirmationDetails {
	type: 'mcp';
	title: string;
	serverName: string;
	toolName: string;
	toolDisplayName: string;
	onConfirm: (outcome: ToolConfirmationOutcome) => Promise<void>;
}

export interface ToolInfoConfirmationDetails {
	type: 'info';
	title: string;
	onConfirm: (outcome: ToolConfirmationOutcome) => Promise<void>;
	prompt: string;
	urls?: string[];
}

export type ToolCallConfirmationDetails =
	| ToolEditConfirmationDetails
	| ToolExecuteConfirmationDetails
	| ToolMcpConfirmationDetails
	| ToolInfoConfirmationDetails;

// 原名：GeminiEventType
export enum TurnEventType {
	Content = 'content',
	ToolCallRequest = 'tool_call_request',
	ToolCallResponse = 'tool_call_response',
	ToolCallOutput = 'tool_call_output',
	ToolCallUpdate = 'tool_call_update',
	ToolCallComplete = 'tool_call_complete',
	ToolCallConfirmation = 'tool_call_confirmation',
	UserCancelled = 'user_cancelled',
	Error = 'error',
	ChatCompressed = 'chat_compressed',
	Thought = 'thought',
}

export interface StructuredError {
	message: string;
	status?: number;
}

export interface GeminiErrorEventValue {
	error: StructuredError;
}

export interface ToolCallRequestInfo {
	callId: string;
	name: string;
	args: Record<string, unknown>;
	isClientInitiated: boolean;
	prompt_id: string;
}

export interface FileDiff {
	fileDiff: string;
	fileName: string;
}

export type ToolResultDisplay = string | FileDiff;

export interface ToolCallResponseInfo {
	callId: string;
	responseParts: PartListUnion;
	resultDisplay: ToolResultDisplay | undefined;
	error: Error | undefined;
}

export interface ServerToolCallConfirmationDetails {
	request: ToolCallRequestInfo;
	details: ToolCallConfirmationDetails;
}

export type ThoughtSummary = {
	subject: string;
	description: string;
};

export type ServerContentEvent = {
	type: TurnEventType.Content;
	value: string;
};

export type ServerThoughtEvent = {
	type: TurnEventType.Thought;
	value: ThoughtSummary;
};

export type ServerToolCallRequestEvent = {
	type: TurnEventType.ToolCallRequest;
	value: ToolCallRequestInfo;
};

export type ServerToolCallResponseEvent = {
	type: TurnEventType.ToolCallResponse;
	value: ToolCallResponseInfo;
};

export type ServerToolCallConfirmationEvent = {
	type: TurnEventType.ToolCallConfirmation;
	value: ServerToolCallConfirmationDetails;
};

export type ServerUserCancelledEvent = {
	type: TurnEventType.UserCancelled;
};

export type ServerErrorEvent = {
	type: TurnEventType.Error;
	value: GeminiErrorEventValue;
};

export interface ChatCompressionInfo {
	originalTokenCount: number;
	newTokenCount: number;
}

export type ServerChatCompressedEvent = {
	type: TurnEventType.ChatCompressed;
	value: ChatCompressionInfo | null;
};

export type ServerToolCallOutputEvent = {
	type: TurnEventType.ToolCallOutput;
	value: {
		toolCallId: string;
		outputChunk: string;
	};
};

export type ServerToolCallUpdateEvent = {
	type: TurnEventType.ToolCallUpdate;
	value: FrontToolCall[];
};

export type ServerToolCallCompleteEvent = {
	type: TurnEventType.ToolCallComplete;
	value: FrontCompletedToolCall[];
};

// The original union type, now composed of the individual types
export type ServerStreamEvent =
	| ServerContentEvent
	| ServerToolCallRequestEvent
	| ServerToolCallResponseEvent
	| ServerToolCallConfirmationEvent
	| ServerUserCancelledEvent
	| ServerErrorEvent
	| ServerChatCompressedEvent
	| ServerThoughtEvent
	| ServerToolCallOutputEvent
	| ServerToolCallUpdateEvent
	| ServerToolCallCompleteEvent;

export type TrackedScheduledToolCall = FrontScheduledToolCall & {
	responseSubmittedToGemini?: boolean;
};
export type TrackedValidatingToolCall = FrontValidatingToolCall & {
	responseSubmittedToGemini?: boolean;
};
export type TrackedWaitingToolCall = FrontWaitingToolCall & {
	responseSubmittedToGemini?: boolean;
};
export type TrackedExecutingToolCall = FrontExecutingToolCall & {
	responseSubmittedToGemini?: boolean;
};
export type TrackedCompletedToolCall = FrontCompletedToolCall & {
	responseSubmittedToGemini?: boolean;
};
export type TrackedCancelledToolCall = FrontCancelledToolCall & {
	responseSubmittedToGemini?: boolean;
};

export type TrackedToolCall =
	| TrackedScheduledToolCall
	| TrackedValidatingToolCall
	| TrackedWaitingToolCall
	| TrackedExecutingToolCall
	| TrackedCompletedToolCall
	| TrackedCancelledToolCall;
