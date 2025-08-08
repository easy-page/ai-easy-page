import { StepWsMsgTypeEnum } from '../../../constants/task';
import { WsClientMsgType } from '../../../constants/wsMessages';

export type WsClientFinishStepMsg = {
	state: any;
	extra?: {
		reason?: string;
		stopTask?: boolean;
		stop_task_reason?: string;
		stop_task?: boolean;
	};
};

export type WsClientMsg<T = any> = {
	source: StepWsMsgTypeEnum.Client;
	type: WsClientMsgType;
	content: T;
	task_id: number;
	timestamp: number;
	task_step_index?: number;
};
