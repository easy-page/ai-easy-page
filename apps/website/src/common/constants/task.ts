export enum TaskStatus {
    PLANNING = 'planning',
    PENDING = 'pending',
    STARTING = 'starting',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed',
    PAUSED = 'paused',
}

export const TaskStatusChineseMap: { [key in TaskStatus]: string } = {
    [TaskStatus.PLANNING]: '规划中',
    [TaskStatus.PENDING]: '待确认',
    [TaskStatus.STARTING]: '开始执行',
    [TaskStatus.RUNNING]: '运行中',
    [TaskStatus.COMPLETED]: '已完成',
    [TaskStatus.FAILED]: '已失败',
    [TaskStatus.PAUSED]: '已暂停',
};

export const TaskStatusColorMap = {
    [TaskStatus.PLANNING]: 'green',
    [TaskStatus.PENDING]: 'green',
    [TaskStatus.STARTING]: 'green',
    [TaskStatus.RUNNING]: 'green',
    [TaskStatus.COMPLETED]: 'green',
    [TaskStatus.FAILED]: 'grey',
    [TaskStatus.PAUSED]: 'red',
};

export enum StepWsMsgTypeEnum {
    Server = 'server',
    Client = 'client',
}

// TODO 下面这个定义有问题，应该统一只有 CARD，
export enum TaskProgressContentType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    TASK_CARD = 'TASK_CARD',
    VECTOR_SEARCH_CARD = 'VECTOR_SEARCH_CARD',
    DOC = 'DOC',
    COMPONENT = 'COMPONENT',
}

export enum ResourceType {
    // 本地 agent_team 信息
    LOCAL_AGENT_TEAM = 'localAgentTeam',
    // 本地 agent 信息
    LOCAL_AGENT = 'localAgent',
    // 本地 tools 信息
    LOCAL_TOOLS = 'localTools',
    // 远程 agent_team 信息
    REMOTE_AGENT_TEAM = 'remoteAgentTeam',
    // 远程 agent 信息,
    REMOTE_AGENT = 'remoteAgent',
    // 远程 tools 信息
    REMOTE_TOOLS = 'remoteTools',
    // 模型信息
    MODEL = 'model',
    // 组件信息
    COMPONENT = 'component',
}
