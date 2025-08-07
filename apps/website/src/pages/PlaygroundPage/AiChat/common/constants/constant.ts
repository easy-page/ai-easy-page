export const ELECTRON_BRIDGE_NAME = 'tn_editor_api';
export enum EVENT_NAME {
	GetSettings = 'get-settings',
	GetAllSettings = 'get-all-settings',
	UpdateSettings = 'update-settings',
	DeleteSettings = 'delete-settings',
	UploadFiles = 'upload-files',
	ChooseFile = 'choose-file',
	CreateLocalRepo = 'create-local-repo',
	CreateGitRepo = 'create-git-repo',
	PushToGitRepo = 'push-to-git-repo',
	SaveVenue = 'save-venue',
	StartProject = 'start-project',
	StopProject = 'stop-project',
	RestartProject = 'restart-project',
	AddDependencies = 'add-dependencies',
	CleanProject = 'clean-project',
	// 窗口管理器相关事件
	WindowMessageRequest = 'window-message-request',
	WindowMessageResponse = 'window-message-response',
	WindowMessage = 'window-message',
	WindowId = 'window-id',
	// 仓库执行相关事件
	RepoExecStart = 'repo-exec-start',
	RepoExecLog = 'repo-exec-log',
	RepoExecInteraction = 'repo-exec-interaction',
	RepoExecWaiting = 'repo-exec-waiting',
	RepoExecComplete = 'repo-exec-complete',
	RepoCreationSuccess = 'repo-creation-success',

	// AI 消息
	SendMessageStream = 'send-message-stream',
	AbortMessageStream = 'abort-message-stream',
	// 增加一些 AI 过程消息
	AiStreamMsg = 'ai-stream-msg',
	AiToolCallOutput = 'ai-tool-call-output',
	AiToolCallComplete = 'ai-tool-call-complete',
	AiToolCallUpdate = 'ai-tool-call-update',
	AiToolCallConfirm = 'ai-tool-call-confirm',
	AiAddHistory = 'ai-add-history',
	// 日志
	GetCvChunkLogs = 'get-cv-chunk-logs',
	// 获取某个会话里消息列表
	GetMsgChunkLogs = 'get-msg-chunk-logs',
	// 获取消息内容
	GetMsgContent = 'get-msg-content',

	// 保存消息
	SaveMsg = 'save-msg',

	// LoadServerHierarchicalMemory
	LoadServerHierarchicalMemory = 'load-server-hierarchical-memory',

	InitClient = 'init-client',

	GetVenueConfig = 'get-venue-config',
	UpdateVenueConfig = 'update-venue-config',
}

// 仓库操作步骤枚举
export enum REPO_STEP_KEYS {
	CREATE_LOCAL_REPO = 'create_local_repo',
	CREATE_REMOTE_REPO = 'create_remote_repo',
	LINK_REPOS = 'link_repos',
	PUSH_TO_REMOTE = 'push_to_remote',
	INSTALL_DEPENDENCIES = 'install_dependencies',
	CREATE_VITE_PROJECT = 'create_vite_project',
	INSTALL_LESS = 'install_less',
	INSTALL_TAILWIND = 'install_tailwind',
	INIT_TAILWIND = 'init_tailwind',
	ADD_DEPENDENCIES = 'add_dependencies',
}

/**
 * Git仓库初始化步骤枚举
 * 用于替代原来的数字命名步骤（stepOne, stepTwo等）
 */
export enum GitRepoStep {
	CREATE_LOCAL_REPO = 'CREATE_LOCAL_REPO',
	CREATE_REMOTE_REPO = 'CREATE_REMOTE_REPO',
	LINK_REPOS = 'LINK_REPOS',
	PUSH_TO_REMOTE = 'PUSH_TO_REMOTE',
}

/**
 * 步骤显示名称
 */
export const STEP_DISPLAY_NAMES: Record<GitRepoStep, string> = {
	[GitRepoStep.CREATE_LOCAL_REPO]: '创建本地仓库',
	[GitRepoStep.CREATE_REMOTE_REPO]: '创建远程仓库',
	[GitRepoStep.LINK_REPOS]: '关联仓库',
	[GitRepoStep.PUSH_TO_REMOTE]: '推送代码',
};

// 仓库操作步骤中文名称映射
export const REPO_STEP_NAMES: Record<REPO_STEP_KEYS, string> = {
	[REPO_STEP_KEYS.CREATE_LOCAL_REPO]: '创建本地仓库',
	[REPO_STEP_KEYS.CREATE_REMOTE_REPO]: '创建远程仓库',
	[REPO_STEP_KEYS.LINK_REPOS]: '关联Git仓库',
	[REPO_STEP_KEYS.PUSH_TO_REMOTE]: '推送到远程仓库',
	[REPO_STEP_KEYS.INSTALL_DEPENDENCIES]: '安装项目依赖',
	[REPO_STEP_KEYS.CREATE_VITE_PROJECT]: '创建Vite项目',
	[REPO_STEP_KEYS.INSTALL_LESS]: '安装Less',
	[REPO_STEP_KEYS.INSTALL_TAILWIND]: '安装Tailwind CSS',
	[REPO_STEP_KEYS.INIT_TAILWIND]: '初始化Tailwind CSS',
	[REPO_STEP_KEYS.ADD_DEPENDENCIES]: '添加依赖',
};

// GitRepoInitializer组件中的步骤映射
export const REPO_STEP_MAP: Record<GitRepoStep, REPO_STEP_KEYS[]> = {
	[GitRepoStep.CREATE_LOCAL_REPO]: [
		REPO_STEP_KEYS.CREATE_LOCAL_REPO,
		REPO_STEP_KEYS.CREATE_VITE_PROJECT,
		REPO_STEP_KEYS.INSTALL_LESS,
		REPO_STEP_KEYS.INSTALL_TAILWIND,
		REPO_STEP_KEYS.INIT_TAILWIND,
		REPO_STEP_KEYS.INSTALL_DEPENDENCIES,
		REPO_STEP_KEYS.ADD_DEPENDENCIES,
	],
	[GitRepoStep.CREATE_REMOTE_REPO]: [REPO_STEP_KEYS.CREATE_REMOTE_REPO],
	[GitRepoStep.LINK_REPOS]: [REPO_STEP_KEYS.LINK_REPOS],
	[GitRepoStep.PUSH_TO_REMOTE]: [REPO_STEP_KEYS.PUSH_TO_REMOTE],
};

// 交互类型枚举
export enum INTERACTION_TYPE {
	TEXT_INPUT = 'text_input',
	RADIO_SELECT = 'radio_select',
	CHECKBOX_SELECT = 'checkbox_select',
	CONFIRMATION = 'confirmation',
	CHOICES = 'choices',
	INFORMATION = 'information',
}
