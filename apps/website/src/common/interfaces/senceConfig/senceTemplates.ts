import { SenceTemplateComponentEnum } from '../../constants/scence';

export type SenceTemplateComponentBaseConfig = {
	style?: React.CSSProperties;
	prompt: string;
};

export type SenceTemplateComponentSelectConfig =
	SenceTemplateComponentBaseConfig & {
		items: {
			label:
				| string
				| {
						items: {
							value: string;
							type: 'img' | 'text';
							style: React.CSSProperties;
						}[];
						style: React.CSSProperties;
				  };
			value: string;
		}[];
	};

export type SenceTemplateComponentCardBaseConfig = {
	useCategory: boolean; // 是否使用分类，如果使用在每个选项里的category 属性就会被用起来
};
export type SenceTemplateComponentImageCardConfig =
	SenceTemplateComponentCardBaseConfig & {
		items: {
			desc: string;
			background: string;
			category: string;
			title: string;
			icon?: string;
		}[];
	};

export type SenceTemplateComponentAudioCardConfig =
	SenceTemplateComponentCardBaseConfig & {
		items: { background: string; title: string; desc: string }[];
	};

export type SenceTemplateComponentTextCardConfig =
	SenceTemplateComponentCardBaseConfig & {
		items: {
			title: string;
			desc: string;
			bottomImage?: string;
			topIcon?: string;
			tag?: {
				label: string;
				style: React.CSSProperties;
			}[];
		}[];
	};

export type SenceTemplateComponent = {
	type: SenceTemplateComponentEnum;
	select?: SenceTemplateComponentSelectConfig;
	imageCard?: SenceTemplateComponentImageCardConfig;
	audioCard?: SenceTemplateComponentAudioCardConfig;
	textCard?: SenceTemplateComponentTextCardConfig;
};

/**
 * - 选择的形式太定制了，卡片各种各样，卡片还是提供一些固定的选择形式吧！
 */
export type SenceTemplateConfig = {
	title: string;
	expand: boolean; // 默认是否展开
	sendDirect: boolean; // 选择之后是否直接发送
	component: SenceTemplateComponent;
};
