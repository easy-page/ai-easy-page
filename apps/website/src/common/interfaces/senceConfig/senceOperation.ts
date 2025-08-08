import { ChatMessageContextSettingsEnum } from '../../constants/message';
import {
	ChatMode,
	SenceOperationEnum,
	UploadContentFromEnum,
} from '../../constants/scence';

export type SenceOperationBaseConfig = {
	icon?: string;
};

export type SenceOperationUploadContentConfig = SenceOperationBaseConfig & {
	type: SenceOperationEnum.UploadContent;
	from: {
		type: UploadContentFromEnum;
		cloud?: {
			tips: {
				text?: string;
				image?: string;
				style?: React.CSSProperties;
				type: 'image' | 'text';
			}[];
		};
		local?: {
			title?: string; // 标题可不配置
			source: ('local' | 'clipboard')[];
		};
	}[];
};

export type SenceOperationSwitchConfig = SenceOperationBaseConfig & {
	on: boolean; // 是否默认开启
	label: string; // 文案
	value: ChatMessageContextSettingsEnum; // 一般是表示模型在执行过程中的一些配置，如："useDocEditor"、"useCodeEditor"，应该是固定枚举
};

export type SenceOperationDialogInputConfig = SenceOperationBaseConfig & {
	label: string; // 按钮文案
	extra: string; // 弹窗描述
	title: string; // 弹窗标题
	value: string; // 输入框的值
	placeholder?: string;
	confirmText?: string;
	cancelText?: string;
	disabledBorder?: boolean; // 是否禁用按钮border
};

export type SenceOperationUploadFileConfig = SenceOperationBaseConfig & {
	label: string; // 文案
	operations: ('uploadFile' | 'uploadDir')[];
	count?: number;
};

export type SenceOperationDownloadFileConfig = SenceOperationBaseConfig & {
	label: string; // 文案
	fileUrl: string;
};

export type SenceOperationUploadImageConfig = SenceOperationBaseConfig & {
	label: string; // 文案
};

export type SenceOperationSelectConfig = SenceOperationBaseConfig & {
	title: string; // 文案
	options: {
		label:
			| string
			| {
					icon?: string;
					text: string;
					extra?: string;
			  };
		value: string;
	}[];
};
/**
 * - 选择文件、下拉框选择、上传文件（文件夹）、弹窗输入 github 仓库地址
 * - 本地上传、粘贴文本、从云盘添加内容
 * - 开关选项
 * - 总结：开关组件、上传内容、上传文件（文件夹）、下拉框选择、弹窗输入地址
 */
export type SenceInputComponentOperation = {
	label: string;
	icon?: string;
	type: SenceOperationEnum;
	/** 如果配置了就在对应场景可以使用，比如：新对话，或者会话中，不配置默认都可以 */
	scence?: ChatMode[];
	uploadContentConfig?: SenceOperationUploadContentConfig;
	switchConfig?: SenceOperationSwitchConfig;
	dialogInputConfig?: SenceOperationDialogInputConfig;
	uploadFileConfig?: SenceOperationUploadFileConfig;
	downloadFileConfig?: SenceOperationDownloadFileConfig;
	uploadImageConfig?: SenceOperationUploadImageConfig;
	selectConfig?: SenceOperationSelectConfig;
};
