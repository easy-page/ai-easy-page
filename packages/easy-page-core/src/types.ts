import { ReactNode } from 'react';

// 通用响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
}

// 表单字段值类型
export type FieldValue =
  | string
  | number
  | boolean
  | Array<any>
  | object
  | null
  | undefined;

// 验证影响配置
export interface ValidateEffect {
  affectFields: string[]; // 影响的字段列表
  effectNextRow?: boolean; // 是否影响下一行
  effectPreviousRow?: boolean; // 是否影响上一行
  message?: string; // 影响说明
}

// 验证规则类型
export interface ValidationRule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  len?: number;
  validator?: (params: {
    value: FieldValue;
    store: FormStore;
    rowInfo?: ExtendedRowInfo;
    rowValues: any;
  }) => boolean | string | Promise<boolean | string>;
  transform?: (value: FieldValue) => FieldValue;
  // 新增：字段依赖验证 - 当指定字段变化时，触发当前字段的验证
  dependentFields?: string[]; // 依赖的字段列表
  // 新增：影响其他字段验证 - 当前字段变化时，需要验证的其他字段
  affectFields?: string[]; // 影响的字段列表
}

// 验证结果类型
export interface ValidationResult {
  valid: boolean;
  message?: string;
  field: string;
}

// 表单字段状态
export interface FieldState {
  value: FieldValue;
  touched: boolean;
  dirty: boolean;
  errors: string[];
  validating: boolean;
  processing?: boolean; // 是否正在处理 effects/actions
}

// 新增：路由参数动作枚举
export enum RouteParamsAction {
  SET = 'set', // 设置单个参数
  BATCH_SET = 'batchSet', // 批量设置参数
  REMOVE = 'remove', // 移除单个参数
  UPDATE = 'update', // 更新参数（合并）
  CLEAR = 'clear', // 清空所有参数
  RESET = 'reset', // 重置到初始状态
  PARSE = 'parse', // 从URL解析
}

// 新增：路由参数变化事件类型
export interface RouteParamsChangeEvent {
  action: RouteParamsAction;
  key?: string; // 操作的参数键（SET、REMOVE 时有值）
  value?: string; // 设置的值（SET 时有值）
  params?: Record<string, string>; // 批量操作的参数（BATCH_SET、UPDATE、RESET、PARSE 时有值）
  previousParams: Record<string, string>; // 变化前的参数
  currentParams: Record<string, string>; // 变化后的参数
}

// 表单状态
export interface FormState {
  // 字段的值
  values: Record<string, FieldValue>;
  // 字段的一些其他状态如：validating 等
  fields: Record<string, FieldState>;
  submitting: boolean;
  submitted: boolean;
  errors: Record<string, string[]>;
  processing: boolean; // 全局处理状态
  disabled: boolean; // 全局禁用状态
  requesting: boolean; // 全局请求状态
  // 新增：路由参数状态
  routeParams: Record<string, string>; // 路由参数
}

// 副作用配置
export interface EffectConfig {
  effectedKeys?: string[]; // 受影响的字段，会恢复为默认值
  handler?: (params: {
    store: FormStore;
    rowInfo?: ExtendedRowInfo;
    value: any;
    rowValue: any;
  }) => Promise<
    Record<string, { fieldValue: any; fieldProps: Record<string, any> }>
  >;
}

// 动作配置
export interface ActionConfig {
  effectedBy: string[]; // 被哪些字段影响
  handler: (params: {
    store: FormStore;
    rowInfo?: ExtendedRowInfo;
    value: any;
    rowValue: any;
  }) => Promise<{ fieldValue: any; fieldProps: Record<string, any> }>;
}

// 外部状态监听配置
export interface ExternalStateListener {
  id: string; // 监听器唯一标识
  fields: string[]; // 需要更新的字段
  handler: (
    externalState: any,
    store: FormStore,
  ) => Promise<
    Record<string, { fieldValue: any; fieldProps?: Record<string, any> }>
  >;
  condition?: (externalState: any) => boolean; // 可选的触发条件
}

// When 组件监听器配置
export interface WhenListener {
  id: string; // 监听器唯一标识
  effectedBy: string[]; // 被哪些字段影响
  show: (params: {
    store: FormStore;
    effectedValues: Record<string, FieldValue>;
    rowInfo?: ExtendedRowInfo;
  }) => boolean;
  rowInfo?: ExtendedRowInfo; // 行信息（用于动态表单）
}

// FormItem 通用渲染上下文
export interface FormItemRenderContext {
  store: FormStore;
  fieldValue: FieldValue;
  fieldState: FieldState;
  fieldProps: Record<string, any>;
  currentRow?: number;
  totalRows?: number;
  isLast?: boolean;
  fieldId: string;
}

// FormItem 组件属性
export interface FormItemProps {
  id: string;
  required?: boolean;
  validate?: ValidationRule[];
  // 新增：验证影响配置 - 定义当前字段变化时会影响哪些字段的验证
  validateEffects?: ValidateEffect[];
  effects?: EffectConfig[]; // 副作用配置
  actions?: ActionConfig[]; // 动作配置
  req?: FieldRequestConfig; // 字段请求配置
  label?: ReactNode | ((params: FormItemRenderContext) => ReactNode);
  /** 字段底部提示 */
  extra?: ReactNode | ((params: FormItemRenderContext) => ReactNode);
  /** label 旁边纯文字提示 */
  tips?: ReactNode | ((params: FormItemRenderContext) => ReactNode);
  /** label 旁边问号提示文案 */
  help?: ReactNode | ((params: FormItemRenderContext) => ReactNode); // 问号提示文案
  children: ReactNode;
  // 新增布局相关属性
  labelLayout?: 'horizontal' | 'vertical'; // label 布局方式
  labelWidth?: number | string; // label 宽度
  noLabel?: boolean; // 是否不显示 label
}

// Form 组件属性
export interface FormProps {
  initialValues?: Record<string, FieldValue>;
  mode?: FormMode; // 表单模式
  initReqs?: Record<string, FormContextRequestConfig>; // 初始化请求配置
  initialRouteParams?: Record<string, string>; // 初始路由参数
  onSubmit?: (
    values: Record<string, FieldValue>,
    store: FormStore,
  ) => void | Promise<void>;
  onValuesChange?: (
    changedValues: Record<string, FieldValue>,
    allValues: Record<string, FieldValue>,
  ) => void;
  store?: FormStore;
  storeId?: string; // 新增：store 的唯一标识，用于多实例管理
  children: ReactNode;
  loadingComponent?: ReactNode | (() => ReactNode); // 自定义 loading 组件
}

// 验证器接口
export interface Validator {
  validate: (
    value: FieldValue,
    rule: ValidationRule,
    store: FormStore,
    rowInfo?: ExtendedRowInfo,
  ) => Promise<ValidationResult>;
  addRule: (
    name: string,
    validator: (
      value: FieldValue,
      rule: ValidationRule,
      store: FormStore,
    ) => Promise<ValidationResult>,
  ) => void;
  getCustomRule: (
    name: string,
  ) =>
    | ((
        value: FieldValue,
        rule: ValidationRule,
        store: FormStore,
      ) => Promise<ValidationResult>)
    | undefined;
}

// 表单请求配置
export interface FieldRequestConfig {
  effectedBy?: string[]; // 依赖的字段列表
  handler: (params: {
    store: FormStore;
    rowInfo?: ExtendedRowInfo;
    rowValues?: any;
    keyword?: string;
    value: any; // 当前字段的值
  }) => Promise<{
    success: boolean;
    data: any;
    error?: string;
  }>;
  // 新增：根据ID查询选中项的详细信息（主要用于编辑模式）
  searchedById?: (params: {
    store: FormStore;
    rowInfo?: ExtendedRowInfo;
    rowValues?: any;
    value: any; // 当前字段的值（通常是ID）
  }) => Promise<{
    success: boolean;
    data: any;
    error?: string;
  }>;
}

// 表单上下文请求配置
export interface FormContextRequestConfig {
  req: (params: { store: FormStore; effectedData?: any }) => Promise<{
    success: boolean;
    data: any;
    error?: string;
  }>;
  mode?: FormMode[]; // 在哪些模式下执行请求
  depends?: string[]; // 依赖的其他请求
}

// 表单上下文请求状态
export interface FormContextRequestState {
  [key: string]: {
    successed: boolean;
    data: any;
    error: any;
    loading: boolean;
  };
}

// 表单模式枚举
export enum FormMode {
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
}

// 表单 Store 接口
export interface FormStore {
  state: FormState;
  setValue: (field: string, value: FieldValue) => void;
  getValue: (field: string) => FieldValue;
  setFieldState: (field: string, state: Partial<FieldState>) => void;
  getFieldState: (field: string) => FieldState;
  validate: (field?: string) => Promise<ValidationResult[]>;
  validateAll: () => Promise<ValidationResult[]>;
  reset: () => void;
  submit: () => Promise<void>;
  isFieldValid: (field: string) => boolean;
  isFieldTouched: (field: string) => boolean;
  isFieldDirty: (field: string) => boolean;
  getValidator: () => Validator;
  // 内部方法：注册字段验证器
  registerFieldValidator: (field: string, rules: ValidationRule[]) => void;
  // 内部方法：注册字段行信息
  registerFieldRowInfo: (field: string, rowInfo: ExtendedRowInfo) => void;
  // 内部方法：注册字段依赖关系
  registerFieldDependencies: (field: string, dependencies: string[]) => void;
  // 内部方法：注册字段影响关系
  registerFieldAffects: (field: string, affects: string[]) => void;
  // 内部方法：注册字段验证影响关系
  registerFieldValidateEffects: (
    field: string,
    effects: ValidateEffect[],
  ) => void;
  // 新增方法
  registerEffects: (field: string, effects: EffectConfig[]) => void;
  registerActions: (field: string, actions: ActionConfig[]) => void;
  triggerEffects: (field: string) => Promise<void>;
  triggerActions: (field: string) => Promise<void>;
  // 外部状态监听方法
  registerExternalStateListener: (listener: ExternalStateListener) => void;
  unregisterExternalStateListener: (id: string) => void;
  updateFromExternalState: (externalState: any) => Promise<void>;
  // When 组件监听器方法
  registerWhenListener: (listener: WhenListener) => void;
  unregisterWhenListener: (id: string) => void;
  // 全局禁用状态方法
  setDisabled: (disabled: boolean) => void;
  isDisabled: () => boolean;
  // 设置值变化回调
  setOnValuesChange: (
    callback: (changedValues: any, allValues: any) => void,
  ) => void;
  // 新增：请求管理方法
  registerFieldRequest: (field: string, config: FieldRequestConfig) => void;
  unregisterFieldRequest: (field: string) => void;
  getFieldData: <T = any>(field: string) => ApiResponse<T> | null;
  dispatchFieldRequest: (
    field: string,
    params?: { keyword?: string },
  ) => Promise<void>;
  // 新增：表单上下文请求管理方法
  setFormMode: (mode: FormMode) => void;
  getFormMode: () => FormMode;
  setInitReqs: (reqs: Record<string, FormContextRequestConfig>) => void;
  getContextData: (key: string) => any;
  getContextRequestState: () => FormContextRequestState;
  executeInitReqs: () => void;
  // 新增：全局请求状态管理方法
  setRequesting: (requesting: boolean) => void;
  isRequesting: () => boolean;
  isAnyRequestRunning: () => boolean;
  getRequestSchedulerStatus: () => {
    currentRunning: number;
    queueLength: number;
    maxConcurrent: number;
  };
  // 新增：路由参数管理方法
  getRouteParams: () => Record<string, string>;
  getRouteParam: (key: string) => string | undefined;
  setRouteParams: (params: Record<string, string>) => void;
  setRouteParam: (key: string, value: string) => void;
  removeRouteParam: (key: string) => void;
  updateRouteParams: (params: Record<string, string>) => void;
  clearRouteParams: () => void;
  // 新增：额外的路由参数管理方法
  setRouteParamsChangeCallback: (
    callback: (event: RouteParamsChangeEvent) => void,
  ) => void;
  parseRouteParamsFromUrl: (url?: string) => void;
  buildQueryString: () => string;
  updateBrowserUrl: (replace?: boolean) => void;
  resetRouteParams: () => void;
}

// 动态表单行配置
export interface DynamicFormRow {
  id: string;
  fields: string[];
  removable?: boolean;
  addable?: boolean;
}

// 动态表单配置
export interface DynamicFormConfig {
  rows: DynamicFormRow[];
  onAdd?: (index: number) => void;
  onRemove?: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

// 基础行信息类型
export interface BaseRowInfo {
  currentRow: number;
  totalRows: number;
  isLast: boolean;
}

// 行更新相关类型定义
export interface UpdateRowRange {
  rows?: number[]; // 指定行号数组
  fromRow?: number; // 起始行号（包含）
  toRow?: number; // 结束行号（不包含）
}

export interface UpdateRowOptions {
  fieldId: string;
  value: FieldValue;
  fieldProps?: Record<string, any>;
}

export interface UpdateRowsConfig {
  range?: UpdateRowRange;
  updates: UpdateRowOptions[];
}

// 扩展的行信息类型（包含更新方法）
export interface ExtendedRowInfo extends BaseRowInfo {
  updateRows: (
    config: UpdateRowsConfig,
  ) => Record<string, { fieldValue: any; fieldProps: Record<string, any> }>;
  updateRowsField: (
    fieldId: string,
    value: any,
    range?: UpdateRowRange,
    fieldProps?: Record<string, any>,
  ) => Record<string, { fieldValue: any; fieldProps: Record<string, any> }>;
  updateNextRow: (
    fieldId: string,
    value: any,
    fieldProps?: Record<string, any>,
  ) => Record<string, { fieldValue: any; fieldProps: Record<string, any> }>;
  updateNextRows: (
    fieldId: string,
    value: any,
    rowsCount: number,
    fieldProps?: Record<string, any>,
  ) => Record<string, { fieldValue: any; fieldProps: Record<string, any> }>;
  updateRowsFields: (
    updates: UpdateRowOptions[],
    range?: UpdateRowRange,
  ) => Record<string, { fieldValue: any; fieldProps: Record<string, any> }>;
  // 新增：获取行值的工具方法
  getRowValues: (index?: number, key?: string) => any;
}
