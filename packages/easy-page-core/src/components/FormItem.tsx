import React, { useEffect, cloneElement, isValidElement } from 'react';
import { observer } from 'mobx-react';
import { FormItemProps, FormItemRenderContext } from '../types';
import {
  useFormContext,
  useFormValue,
  useFormFieldState,
  useFormDisabled,
} from '../context';
import { useRowInfo } from './DynamicForm';
import { Tooltip } from './Tooltip';
import { QuestionCircle } from './Icons/QuestionCircle';

// 通用渲染函数，支持 ReactNode 或函数签名
const renderWithContext = (
  prop:
    | React.ReactNode
    | ((params: FormItemRenderContext) => React.ReactNode)
    | undefined,
  context: FormItemRenderContext,
) => {
  if (!prop) return null;
  return typeof prop === 'function'
    ? (prop as (p: FormItemRenderContext) => React.ReactNode)(context)
    : prop;
};

const FormItemComponent: React.FC<FormItemProps> = (props: FormItemProps) => {
  const {
    id,
    label,
    required = false,
    validate = [],
    validateEffects = [],
    effects = [],
    actions = [],
    req,
    extra,
    tips,
    help,
    children,
    labelLayout = 'vertical',
    labelWidth,
    noLabel = false,
  } = props;
  const { store } = useFormContext();

  // 使用优化的 hooks，只订阅需要的状态
  const fieldValue = useFormValue(id);
  const fieldState = useFormFieldState(id);
  const isFormDisabled = useFormDisabled();

  const hasError = fieldState.errors.length > 0;
  const isProcessing = fieldState.processing;
  const rowInfo = useRowInfo();

  // 获取字段请求状态
  const fieldRequestState = store.getContextRequestState()[id];
  const isFieldRequesting = fieldRequestState?.loading || false;

  // 注册验证规则
  useEffect(() => {
    if (validate.length > 0) {
      // 直接注册验证规则，不需要包装，因为 validator 的参数结构已经在 types.ts 中定义好了
      store.registerFieldValidator(id, validate);

      // 注册字段依赖关系
      validate.forEach((rule) => {
        if (rule.dependentFields && rule.dependentFields.length > 0) {
          store.registerFieldDependencies(id, rule.dependentFields);
        }
        if (rule.affectFields && rule.affectFields.length > 0) {
          store.registerFieldAffects(id, rule.affectFields);
        }
      });
    }
  }, [id, validate, store]);

  // 注册行信息
  useEffect(() => {
    if (rowInfo) {
      console.log(`FormItem ${id} 注册行信息:`, rowInfo);
      store.registerFieldRowInfo(id, rowInfo);
    }
  }, [id, rowInfo, store]);

  // 注册副作用
  useEffect(() => {
    if (effects.length > 0) {
      // 直接注册effects，handler的参数结构已经在store中处理
      store.registerEffects(id, effects);
    }
  }, [id, effects, store]);

  // 注册动作
  useEffect(() => {
    if (actions.length > 0) {
      store.registerActions(id, actions);
    }
  }, [id, actions, store]);

  // 注册验证影响关系
  useEffect(() => {
    if (validateEffects.length > 0) {
      store.registerFieldValidateEffects(id, validateEffects);
    }
  }, [id, validateEffects, store]);

  // 注册字段请求
  useEffect(() => {
    if (req) {
      store.registerFieldRequest(id, req);
    }

    return () => {
      if (req) {
        store.unregisterFieldRequest(id);
      }
    };
  }, [id, req, store]);

  // 处理字段值变化
  const handleChange = (value: any) => {
    console.log(`FormItem ${id} - handleChange:`, value);
    store.setValue(id, value);
  };

  // 处理字段失焦
  const handleBlur = () => {
    console.log(`FormItem ${id} - handleBlur`);
    store.setFieldState(id, { touched: true });
    store.validate(id);
  };

  // 克隆子组件并注入属性
  const renderChildren = () => {
    console.log(`FormItem ${id} - renderChildren called, children:`, children);
    console.log(
      `FormItem ${id} - isValidElement(children):`,
      isValidElement(children),
    );

    if (!isValidElement(children)) {
      console.log(
        `FormItem ${id} - children is not valid element, returning:`,
        children,
      );
      return children;
    }

    const fieldProps = (fieldState as any).fieldProps || {};

    console.log(
      `FormItem ${id} - fieldValue:`,
      fieldValue,
      'type:',
      typeof fieldValue,
      'fieldProps:',
      fieldProps,
      'disabled in fieldProps:',
      fieldProps.disabled,
    );

    try {
      const finalDisabled =
        isProcessing || isFormDisabled || fieldProps.disabled;
      console.log(
        `FormItem ${id} - final disabled:`,
        finalDisabled,
        'fieldProps.disabled:',
        fieldProps.disabled,
        'isProcessing:',
        isProcessing,
        'isFormDisabled:',
        isFormDisabled,
      );

      const clonedElement = cloneElement(children, {
        ...children.props,
        ...fieldProps, // 合并 fieldProps
        value: fieldValue ?? '', // 确保 value 不为 undefined
        onChange: handleChange,
        onBlur: handleBlur,
        disabled: finalDisabled, // 使用最终的禁用状态
      });

      console.log(`FormItem ${id} - cloned props:`, clonedElement.props);
      return clonedElement;
    } catch (error) {
      console.error(`FormItem ${id} - cloneElement error:`, error);
      return children;
    }
  };

  // 生成通用上下文
  const commonContext: FormItemRenderContext = {
    store,
    fieldValue,
    fieldState,
    fieldProps: props || {},
    currentRow: rowInfo?.currentRow,
    totalRows: rowInfo?.totalRows,
    isLast: rowInfo?.isLast,
    fieldId: id,
  };

  // 渲染 extra 内容
  const renderExtra = () => renderWithContext(extra, commonContext);
  // 预先渲染，避免重复执行函数型 props
  const tipsNode = renderWithContext(tips, commonContext);
  const helpNode = renderWithContext(help, commonContext);

  // 渲染 label

  const renderLabel = () => {
    if (noLabel) return null;

    const labelContent = (
      <label
        htmlFor={id}
        className={`form-item-label ${required ? 'form-item-required' : ''}`}
        style={
          labelWidth
            ? {
                width:
                  typeof labelWidth === 'number'
                    ? `${labelWidth}px`
                    : labelWidth,
              }
            : undefined
        }
      >
        {renderWithContext(label, commonContext)}
      </label>
    );

    const helpInline = helpNode ? (
      <div
        className="form-item-help"
        style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}
      >
        <Tooltip content={helpNode} placement="top">
          <QuestionCircle size={14} backgroundColor="#9aa0a6" color="#fff" />
        </Tooltip>
      </div>
    ) : null;
    if (!helpInline && !tipsNode) {
      return labelContent;
    }

    return (
      <div
        className="form-item-label-wrapper"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {labelContent}
        {helpInline}
        {tipsNode && (
          <div
            className="form-item-tips"
            style={{ marginLeft: 8, color: 'rgba(0,0,0,0.4)' }}
          >
            {tipsNode}
          </div>
        )}
      </div>
    );
  };

  // 根据布局渲染
  if (labelLayout === 'horizontal') {
    return (
      <div
        className={`form-item ${hasError ? 'form-item-has-error' : ''} ${
          isProcessing ? 'form-item-processing' : ''
        } ${isFieldRequesting ? 'form-item-requesting' : ''}`}
      >
        {/* 第一行：label、tips、help、children */}
        <div
          className="form-item-row form-item-row-horizontal"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {renderLabel()}
          <div
            className="form-item-control"
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              marginTop: '4px',
            }}
          >
            {renderChildren()}
          </div>
        </div>
        {/* 第二行：extra（在上）、errors（在下） */}
        <div className="form-item-row form-item-row-horizontal-secondary">
          {renderExtra()}
          {hasError && (
            <div className="form-item-error">
              {fieldState.errors.map((error, index) => (
                <div key={index} className="form-item-error-message">
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 垂直布局
  return (
    <div
      className={`form-item ${hasError ? 'form-item-has-error' : ''} ${
        isProcessing ? 'form-item-processing' : ''
      } ${isFieldRequesting ? 'form-item-requesting' : ''}`}
    >
      {/* 第一行：label、tips、help */}
      {renderLabel()}
      {/* 第二行：children */}
      <div
        className="form-item-control"
        style={{ marginTop: '4px', marginBottom: '4px' }}
      >
        {renderChildren()}
      </div>
      {/* 第三行：extra */}
      {renderExtra()}
      {/* 第四行：errors */}
      {hasError && (
        <div className="form-item-error">
          {fieldState.errors.map((error, index) => (
            <div key={index} className="form-item-error-message">
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FormItem = observer(FormItemComponent);
