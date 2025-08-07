export enum WsClientMsgType {
    START = 'start',
    STOP = 'stop',
    PAUSE = 'pause',
    RESUME = 'resume',
    PING = 'ping',
    UPDATE_TASK_STEP_STATE = 'update_task_step_state',
    FINISH_TASK_STEP = 'finish_task_step',
}

export enum ConnectStatus {
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
    CANCELLED = 'cancelled',
}

export enum WsServerMsgType {
    /** 表示执行完成 **/
    COMPLETION = 'completion',
    /** 心跳消息 */
    PONG = 'pong',
    /** 连接消息 */
    CONNECTION = 'connection',
    /** 状态消息 */
    TASK_STATUS = 'task_status',
    /** 任务过程消息 */
    TASK_STEP_STATUS = 'task_step_status',
    /** 任务内容消息 */
    TASK_STEP_INFO = 'task_step_info',
    /** 任务交互消息 */
    TASK_STEP_RESPONSE = 'task_step_response',
    /** 开始工具调用 */
    START_TOOL_CALL = 'start_tool_call',
    /** 结束工具调用 */
    END_TOOL_CALL = 'end_tool_call',
}

export enum WsMessageRole {
    /** 用户发送的消息 */
    USER = 'user',
    /** agent 发送的消息 */
    ASSISTANT = 'assistant',
    /** 系统发送的消息，比如：一些进程日志等 */
    SYSTEM = 'system',
}
