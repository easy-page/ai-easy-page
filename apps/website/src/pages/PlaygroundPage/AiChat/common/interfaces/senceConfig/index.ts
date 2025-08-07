import { SenceInput } from './senceInput';

export enum SenceCategoryEnum {
    REGISTER = 'register',
    CANCEL = 'cancel',
    MODIFY = 'modify',
    SUBSIDY = 'subsidy',
    QUERY = 'query',
}

export type SenceConfig = {
    senceInput: SenceInput;
    /** 暂时的 */
    senceId: string;

    senceCategory: SenceCategoryEnum;
    /** 是否自动发送 */
    autoSend?: boolean;
    // 场景 ID
    id: number;
    // 场景名称
    name: string;
    // 场景描述
    description: string;
    // 场景图标
    icon?: string;
    // 任务 ID，场景唯一绑定的任务 IDa
    // 流程是根据用户的输入让 ai 识别正确的 prompt 给到任务标题和 prompt 即可
    task_id?: number;
};

export interface SceneCategory {
    id: string;
    title: string;
    icon: string;
    backgroundImage: string;
    moreLink?: string;
}

// 定义场景分类
export const SCENE_CATEGORIES: SceneCategory[] = [
    {
        id: SenceCategoryEnum.REGISTER,
        title: '报名活动',
        icon: 'https://s3plus.meituan.net/zspt-fe/jarvis/apply_act_icon.png',
        backgroundImage: 'https://s3plus.meituan.net/zspt-fe/jarvis/apply_act_menu3.png',
        moreLink: '更多 >',
    },
    {
        id: SenceCategoryEnum.CANCEL,
        title: '取消活动',
        icon: 'https://s3plus.meituan.net/zspt-fe/jarvis/cancel_act_icon.png',
        backgroundImage: 'https://s3plus.meituan.net/zspt-fe/jarvis/cancel_act_menu3.png',
    },
    {
        id: SenceCategoryEnum.MODIFY,
        title: '修改活动',
        icon: 'https://s3plus.meituan.net/zspt-fe/jarvis/modify_act_icon.png',
        backgroundImage: 'https://s3plus.meituan.net/zspt-fe/jarvis/modify_act_menu3.png',
    },
    {
        id: SenceCategoryEnum.SUBSIDY,
        title: '美补设置',
        icon: 'https://s3plus.meituan.net/zspt-fe/jarvis/subsidy_act_icon.png',
        backgroundImage: 'https://s3plus.meituan.net/zspt-fe/jarvis/subsidy_act_menu3.png',
    },
    {
        id: SenceCategoryEnum.QUERY,
        title: '信息查询',
        icon: 'https://s3plus.meituan.net/zspt-fe/jarvis/query_act_icon.png',
        backgroundImage: 'https://s3plus.meituan.net/zspt-fe/jarvis/query_act_menu3.png',
    },
];
