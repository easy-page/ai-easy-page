/**
 * - 场景可以包含：
 *   - 是否禁用默认的输入形式
 *   - 是否扩展输入形式菜单
 *   - 指定单个内容输入形式，如：单文件传输
 *   - 内容模版：标题、内容（React.ReactNode）
 * - 场景输入的数据，交互形式可以在输入框里指定，如：选择形式或者弹出其他面板进行选择，最终作为字符串输出
 * - 场景的输入分为：必填、可选，可选的作为下方的按钮，插入后可以做值的选择（枚举的值采用下拉框）、其他可以是
 * 文件或者是 placeholder 形式提示
 */

import { InputToolsEnum } from '../../constants/inputTools';
import { SenceInputComponentOperation } from './senceOperation';
import { SenceTemplateConfig } from './senceTemplates';
import { Descendant } from 'slate';

export interface InputToolConfig {
	tool: InputToolsEnum;
	disabled?: boolean;
}
export type InputToolsConfig = {
	left: (InputToolsEnum | InputToolConfig)[];
	right: (InputToolsEnum | InputToolConfig)[];
};
export interface SenceInput {
	placeholder?: string;
	mainTitle?: string; // 选择场景后，在新对话模式下，标题会改成 MainTitle
	/** 默认的输入组件， 会按照顺序进行组合渲染 */
	defaultInputs?: Descendant[];
	/** 在 NewChat 模式下，如果配置了这个，defaultInputs 在 NewChat 模式下就会失效 */
	defaultInputsForNewChat?: Descendant[];

	/** 每个操作对应一个prompt */
	operations: SenceInputComponentOperation[];
	inputTools?: InputToolsConfig;
	/** 每个模板选择对应一个prompt */
	template?: SenceTemplateConfig;
}
