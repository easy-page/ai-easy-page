export enum UserTypeEnum {
    New = 1,
}

export const UserTypeDesc = {
    [UserTypeEnum.New]: '门店新客',
};

export enum ChargeSideEnum {
    Poi = 1,
    Mtb = 2,
    Agent = 3,
}

export enum ChargeSideEnumKey {
    ChargeSidePoi = 'chargeSidePoi',
    ChargeSideMtb = 'chargeSideMtb',
    ChargeSideAgent = 'chargeSideAgent',
}

export const ChargeSideKey = {
    [ChargeSideEnum.Poi]: 'chargeSidePoi',
    [ChargeSideEnum.Mtb]: 'chargeSideMtb',
    [ChargeSideEnum.Agent]: 'chargeSideAgent',
};

export const BudgetRuleKey = {
    [ChargeSideEnum.Poi]: 'budget4PoiDaily',
    [ChargeSideEnum.Mtb]: 'budget4MtbDaily',
    [ChargeSideEnum.Agent]: 'budget4AgentDaily',
};

export const ChargeSideDesc = {
    [ChargeSideEnum.Poi]: '商家',
    [ChargeSideEnum.Mtb]: '美团',
    [ChargeSideEnum.Agent]: '合作商',
};

export enum SubsidyTypeEnum {
    Base = 'base',
    Expand = 'expand',
}

export enum ActivityStatusEnum {
    UNREVIEWED = 0,
    CHECKED = 1,
    OUTOFCOURT = 2,
    REVIEWING = 3,
    BECLEARED = 6,
    CONFIRM = 9,
}

export const ActivityStatusDesc = {
    [ActivityStatusEnum.UNREVIEWED]: '待审核',
    [ActivityStatusEnum.CHECKED]: '审核通过',
    [ActivityStatusEnum.OUTOFCOURT]: '审核驳回',
    [ActivityStatusEnum.REVIEWING]: '审核中',
    [ActivityStatusEnum.BECLEARED]: '已清退',
    [ActivityStatusEnum.CONFIRM]: '商家确认中',
};

export enum AuditScene {
    Low = 9, // 低效审批流
    Double = 10, // 双确
}
export enum StockSideEnum {
    /* 基础库存 */
    BASE = 1,
    /** 膨胀库存 */
    EXPAND = 2,
    /**商家库存 */
    POI_DAILY = 3,
    /**美团库存 */
    MTB_DAILY = 4,
    /**合作商库存 */
    AGENT_DAILY = 5,
}

export enum StockRuleKeyEnum {
    BASE = 'stock4Base',
    EXPAND = 'stock4Expand',
    POI_DAILY = 'stock4PoiDaily',
    MTB_DAILY = 'stock4MtbDaily',
    AGENT_DAILY = 'stock4AgentDaily',
}
// export const StockRuleKey = {
//   /**基础库存 */
//   [StockSideEnum.BASE]: 'stock4Base',
//   /**膨胀档位*/
//   [StockSideEnum.EXPAND]: 'stock4Expand',
//   /**商家日库存*/
//   [StockSideEnum.POI_DAILY]: 'stock4PoiDaily',
//   /**美团日库存*/
//   [StockSideEnum.MTB_DAILY]: 'stock4MtbDaily',
//   /**代理商日库存*/
//   [StockSideEnum.AGENT_DAILY]: 'stock4AgentDaily',
// }
