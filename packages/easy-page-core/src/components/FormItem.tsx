import React, { useEffect, cloneElement, isValidElement, useMemo } from 'react';
import { observer } from 'mobx-react';
import { FormItemProps } from '../types';
import { useFormContext } from '../context';
import { useRowInfo } from './DynamicForm';

const FormItemComponent: React.FC<FormItemProps> = ({
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
}) => {
	const { store } = useFormContext();
	const fieldState = store.getFieldState(id);
	const hasError = fieldState.errors.length > 0;
	const isProcessing = fieldState.processing;
	const isFormDisabled = store.isDisabled(); // Get global disabled state
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
			// 直接注册actions，handler的参数结构已经在store中处理
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

		// 清理函数
		return () => {
			if (req) {
				store.unregisterFieldRequest(id);
			}
		};
	}, [id, req, store]);

	// 处理子组件的值绑定
	const handleChange = (value: any) => {
		console.log(
			`FormItem ${id} - handleChange called with:`,
			value,
			'type:',
			typeof value
		);
		store.setValue(id, value);
	};

	const handleBlur = () => {
		store.setFieldState(id, { touched: true });
		store.validate(id);
	};

	// 克隆子组件并注入属性
	const renderChildren = () => {
		console.log(`FormItem ${id} - renderChildren called, children:`, children);
		console.log(
			`FormItem ${id} - isValidElement(children):`,
			isValidElement(children)
		);

		if (!isValidElement(children)) {
			console.log(
				`FormItem ${id} - children is not valid element, returning:`,
				children
			);
			return children;
		}

		const fieldValue = store.getValue(id);
		const fieldState = store.getFieldState(id);
		const fieldProps = (fieldState as any).fieldProps || {};

		console.log(
			`FormItem ${id} - fieldValue:`,
			fieldValue,
			'type:',
			typeof fieldValue,
			'fieldProps:',
			fieldProps,
			'disabled in fieldProps:',
			fieldProps.disabled
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
				isFormDisabled
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

	// 渲染 extra 内容
	const renderExtra = () => {
		if (typeof extra === 'function') {
			const fieldValue = store.getValue(id);
			const fieldState = store.getFieldState(id);
			const fieldProps = (fieldState as any).fieldProps || {};

			// 使用在组件顶层获取的行信息
			if (rowInfo) {
				return extra({
					store,
					fieldValue,
					fieldState,
					fieldProps,
					fieldId: id,
					...rowInfo,
				});
			} else {
				// 如果没有行信息，只传递基本字段信息
				return extra({
					store,
					fieldValue,
					fieldState,
					fieldProps,
					fieldId: id,
				});
			}
		}
		return extra;
	};

	// 计算样式
	const getLabelStyle = () => {
		if (labelLayout === 'horizontal' && labelWidth) {
			return {
				width: typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth,
				flexShrink: 0,
			};
		}
		return {};
	};

	const getContainerStyle = () => {
		if (labelLayout === 'horizontal') {
			return {
				display: 'flex',
				alignItems: 'flex-start',
				gap: '8px',
			};
		}
		return {};
	};

	// 渲染问号提示
	const renderHelp = () => {
		if (!help) return null;

		return (
			<span className="form-item-help" title={help}>
				<span className="form-item-help-icon">?</span>
			</span>
		);
	};

	return (
		<div
			className={`form-item form-item-${labelLayout} ${
				isProcessing ? 'form-item-processing' : ''
			} ${isFormDisabled ? 'form-item-disabled' : ''} ${
				isFieldRequesting ? 'form-item-requesting' : ''
			}`}
			style={getContainerStyle()}
		>
			{!noLabel && label && (
				<label className="form-item-label" style={getLabelStyle()}>
					{label}
					{required && <span className="form-item-required">*</span>}
					{renderHelp()}
					{tips && <span className="form-item-tips">{tips}</span>}
					{isProcessing && (
						<span className="form-item-processing-indicator">处理中...</span>
					)}
					{isFieldRequesting && (
						<span className="form-item-requesting-indicator">请求中...</span>
					)}
				</label>
			)}

			<div className="form-item-control">
				{renderChildren()}
				{isFieldRequesting && (
					<div className="form-item-requesting-overlay">
						<div className="form-item-requesting-spinner"></div>
					</div>
				)}
			</div>

			{hasError && (
				<div className="form-item-error">
					{fieldState.errors.map((error, index) => (
						<div key={index} className="form-item-error-message">
							{error}
						</div>
					))}
				</div>
			)}

			{extra && <div className="form-item-extra">{renderExtra()}</div>}
		</div>
	);
};

// 导出组件
export const FormItem: React.FC<FormItemProps> = observer(FormItemComponent);
