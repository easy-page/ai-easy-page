import {
	IconsName,
	SenceInputComponentEnum,
	SenceInputComponentOperationEnum,
} from '../../constants/scence';

export type SenceInputComponentBaseConfig = {
	style?: React.CSSProperties;
};

export type SenceInputComponentInputConfig = SenceInputComponentBaseConfig & {
	placeholder?: string;
};

export type SenceInputComponentSelectConfig = SenceInputComponentBaseConfig & {
	title?: string; // 选项上方的标题
	options: {
		label:
			| string
			| {
					icon?: string;
					text: string;
					extra?: string;
			  };
		value: string | number;
	}[];
	defaultOption: string | number;
};

export type SenceInputComponentFileConfig = SenceInputComponentBaseConfig & {
	title: string;
	tips?: string[];
	fileCount?: number;
	operations: SenceInputComponentOperationEnum[];
};

export type SenceInputComponentImageConfig = SenceInputComponentBaseConfig & {
	title: string;
	tips?: string[];
	imgCount?: number;
};

export type SenceInputComponentIconsConfig = SenceInputComponentBaseConfig & {
	iconName: IconsName;
};

export type SenceInputComponentTextConfig = SenceInputComponentBaseConfig & {
	text: string;
};

export type SenceInputComponent = {
	type: SenceInputComponentEnum;
	input?: SenceInputComponentInputConfig;
	select?: SenceInputComponentSelectConfig;
	file?: SenceInputComponentFileConfig;
	image?: SenceInputComponentImageConfig;
	icons?: SenceInputComponentIconsConfig;
	text?: SenceInputComponentTextConfig;
};
