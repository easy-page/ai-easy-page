import { makeAutoObservable, runInAction } from 'mobx';
import {
	FormState,
	FieldState,
	FormStore,
	FieldValue,
	ValidationResult,
	ValidationRule,
	EffectConfig,
	ActionConfig,
	ExternalStateListener,
	ExtendedRowInfo,
	ValidateEffect,
	WhenListener,
	FieldRequestConfig,
	FormContextRequestConfig,
	FormContextRequestState,
	FormMode,
	ApiResponse,
} from '../types';
import { FormValidator } from '../validator';
import { Scheduler } from './scheduler';

export class FormStoreImpl implements FormStore {
	state: FormState;
	private validator: FormValidator;
	private fieldValidators: Map<string, ValidationRule[]> = new Map();
	private fieldEffects: Map<string, EffectConfig[]> = new Map();
	private fieldActions: Map<string, ActionConfig[]> = new Map();
	private externalStateListeners: Map<string, ExternalStateListener> =
		new Map();
	private whenListeners: Map<string, WhenListener> = new Map();
	private fieldRowInfo: Map<string, ExtendedRowInfo> = new Map();
	private fieldDependencies: Map<string, Set<string>> = new Map();
	private fieldAffects: Map<string, Set<string>> = new Map();
	private fieldValidateEffects: Map<string, any[]> = new Map();

	// 两个独立的调度器
	private effectsScheduler = new Scheduler(3); // effects/actions 调度器
	private requestScheduler = new Scheduler(5); // 请求调度器
	private processingTimeout: NodeJS.Timeout | null = null;
	private onValuesChange?: (changedValues: any, allValues: any) => void;

	// 请求管理相关属性
	private fieldRequests: Map<string, FieldRequestConfig> = new Map();
	private fieldData: Map<string, any> = new Map();
	private formMode: FormMode = FormMode.CREATE;
	private initReqs: Record<string, FormContextRequestConfig> = {};
	private contextData: Map<string, any> = new Map();
	private contextRequestState: FormContextRequestState = {};
	private initReqsExecuted = false;
	private fieldRequestDependencies: Map<string, Set<string>> = new Map();

	constructor(
		initialValues: Record<string, FieldValue> = {},
		maxConcurrentRequests: number = 5
	) {
		this.validator = new FormValidator();
		this.requestScheduler.setMaxConcurrent(maxConcurrentRequests);

		// 初始化状态
		const fields: Record<string, FieldState> = {};
		Object.keys(initialValues || {}).forEach((key) => {
			fields[key] = {
				value: initialValues[key],
				touched: false,
				dirty: false,
				errors: [],
				validating: false,
				processing: false,
			};
		});

		this.state = makeAutoObservable({
			values: { ...initialValues },
			fields,
			submitting: false,
			submitted: false,
			errors: {},
			processing: false,
			disabled: false,
			requesting: false,
		});

		makeAutoObservable(this);
	}

	setValue(field: string, value: FieldValue): void {
		const oldValue = this.state.values[field];

		runInAction(() => {
			this.state.values[field] = value;

			if (!this.state.fields[field]) {
				this.state.fields[field] = {
					value,
					touched: false,
					dirty: false,
					errors: [],
					validating: false,
					processing: false,
				};
			} else {
				this.state.fields[field].value = value;
				this.state.fields[field].dirty = true;
			}

			this.state.fields[field].errors = [];
			if (this.state.errors[field]) {
				delete this.state.errors[field];
			}
		});

		if (this.onValuesChange && oldValue !== value) {
			this.onValuesChange({ [field]: value }, { ...this.state.values });
		}

		// 异步触发 effects 和 actions，不阻塞 UI 更新
		setTimeout(() => {
			this.triggerEffectsAndActions(field);
		}, 0);

		// 异步触发依赖字段验证
		setTimeout(() => {
			this.triggerDependentFieldValidation(field);
		}, 0);

		// 异步触发受影响的字段验证
		setTimeout(() => {
			this.triggerAffectedFieldValidation(field);
		}, 0);

		// 异步触发 When 组件重新计算
		setTimeout(() => {
			this.triggerWhenListeners(field);
		}, 0);
	}

	private async triggerEffectsAndActions(field: string): Promise<void> {
		// 先执行 effects
		await this.triggerEffects(field);

		// 再执行 actions
		await this.triggerActions(field);

		// 等待 effects 和 actions 全部完成后再触发字段请求
		await this.effectsScheduler.waitForCompletion();
		await this.triggerFieldRequests(field);
	}

	getValue(field: string): FieldValue {
		return this.state.values[field];
	}

	setFieldState(field: string, state: Partial<FieldState>): void {
		runInAction(() => {
			if (!this.state.fields[field]) {
				this.state.fields[field] = {
					value: undefined,
					touched: false,
					dirty: false,
					errors: [],
					validating: false,
					processing: false,
				};
			}

			Object.assign(this.state.fields[field], state);
		});
	}

	getFieldState(field: string): FieldState {
		return (
			this.state.fields[field] || {
				value: undefined,
				touched: false,
				dirty: false,
				errors: [],
				validating: false,
				processing: false,
			}
		);
	}

	async validate(field?: string): Promise<ValidationResult[]> {
		const results: ValidationResult[] = [];

		if (field) {
			// 验证单个字段
			const fieldValidators = this.fieldValidators.get(field);
			if (fieldValidators) {
				this.setFieldState(field, { validating: true });

				try {
					for (const rule of fieldValidators) {
						// 尝试获取行信息，支持两种格式：完整ID和原始ID
						let rowInfo = this.fieldRowInfo.get(field);
						if (!rowInfo) {
							// 如果是动态表单字段（格式：row_fieldId），尝试用原始ID获取行信息
							const match = field.match(/^(\d+)_(.+)$/);
							if (match) {
								const [, rowIndex, originalFieldId] = match;
								rowInfo = this.fieldRowInfo.get(originalFieldId);
							}
						}

						const result = await this.validator.validate(
							this.getValue(field),
							rule,
							this,
							rowInfo
						);
						if (!result.valid) {
							results.push({ ...result, field });
						}
					}
				} catch (error) {
					console.error(`验证字段 ${field} 时出错:`, error);
					results.push({
						valid: false,
						message: '验证过程中发生错误',
						field,
					});
				} finally {
					this.setFieldState(field, {
						validating: false,
						errors: results.map((r) => r.message || ''),
					});
				}
			}
		} else {
			// 验证所有字段
			for (const [fieldName, validators] of this.fieldValidators) {
				this.setFieldState(fieldName, { validating: true });

				try {
					for (const rule of validators) {
						const rowInfo = this.fieldRowInfo.get(fieldName);
						const result = await this.validator.validate(
							this.getValue(fieldName),
							rule,
							this,
							rowInfo
						);
						if (!result.valid) {
							results.push({ ...result, field: fieldName });
						}
					}
				} catch (error) {
					console.error(`验证字段 ${fieldName} 时出错:`, error);
					results.push({
						valid: false,
						message: '验证过程中发生错误',
						field: fieldName,
					});
				} finally {
					const fieldErrors = results
						.filter((r) => r.field === fieldName)
						.map((r) => r.message || '');
					this.setFieldState(fieldName, {
						validating: false,
						errors: fieldErrors,
					});
				}
			}
		}

		// 更新全局错误状态
		runInAction(() => {
			this.state.errors = {};
			results.forEach((result) => {
				if (!this.state.errors[result.field]) {
					this.state.errors[result.field] = [];
				}
				if (result.message) {
					this.state.errors[result.field].push(result.message);
				}
			});
		});

		return results;
	}

	async validateAll(): Promise<ValidationResult[]> {
		return this.validate();
	}

	reset(): void {
		runInAction(() => {
			this.state.values = {};
			this.state.fields = {};
			this.state.submitting = false;
			this.state.submitted = false;
			this.state.errors = {};
			this.state.processing = false;
		});
	}

	async submit(): Promise<void> {
		runInAction(() => {
			this.state.submitting = true;
		});

		try {
			const validationResults = await this.validateAll();
			if (validationResults.length === 0) {
				runInAction(() => {
					this.state.submitted = true;
				});
			}
		} finally {
			runInAction(() => {
				this.state.submitting = false;
			});
		}
	}

	isFieldValid(field: string): boolean {
		return this.state.fields[field]?.errors.length === 0;
	}

	isFieldTouched(field: string): boolean {
		return this.state.fields[field]?.touched || false;
	}

	isFieldDirty(field: string): boolean {
		return this.state.fields[field]?.dirty || false;
	}

	// 内部方法：注册字段验证器
	registerFieldValidator(field: string, rules: ValidationRule[]): void {
		if (this.fieldValidators.has(field)) {
			console.warn(
				`字段 "${field}" 已经注册了验证器，不能重复注册。请检查是否有重复的字段 ID 或组件。`
			);
		}
		this.fieldValidators.set(field, rules);
	}

	// 注册字段行信息
	registerFieldRowInfo(field: string, rowInfo: ExtendedRowInfo): void {
		if (this.fieldRowInfo.has(field)) {
			console.warn(
				`字段 "${field}" 已经注册了行信息，不能重复注册。请检查是否有重复的字段 ID 或组件。`
			);
		}
		this.fieldRowInfo.set(field, rowInfo);
	}

	// 注册字段依赖关系
	registerFieldDependencies(field: string, dependencies: string[]): void {
		// 检查是否已经为这个字段注册过依赖关系
		if (this.fieldDependencies.has(field)) {
			console.warn(
				`字段 "${field}" 已经注册了行信息，不能重复注册。请检查是否有重复的字段 ID 或组件。`
			);
		}

		dependencies.forEach((depField) => {
			if (!this.fieldDependencies.has(depField)) {
				this.fieldDependencies.set(depField, new Set());
			}
			this.fieldDependencies.get(depField)!.add(field);
		});
	}

	// 注册字段影响关系
	registerFieldAffects(field: string, affects: string[]): void {
		if (this.fieldAffects.has(field)) {
			console.warn(
				`字段 "${field}" 已经注册了影响关系，不能重复注册。请检查是否有重复的字段 ID 或组件。`
			);
		}
		this.fieldAffects.set(field, new Set(affects));
	}

	// 注册字段验证影响关系
	registerFieldValidateEffects(field: string, effects: ValidateEffect[]): void {
		if (this.fieldValidateEffects.has(field)) {
			console.warn(
				`字段 "${field}" 已经注册了验证影响关系，不能重复注册。请检查是否有重复的字段 ID 或组件。`
			);
		}
		this.fieldValidateEffects.set(field, effects);
	}

	// 触发依赖字段验证
	private async triggerDependentFieldValidation(
		changedField: string
	): Promise<void> {
		const dependentFields = this.fieldDependencies.get(changedField);
		if (dependentFields) {
			for (const field of dependentFields) {
				await this.validate(field);
			}
		}
	}

	// 触发受影响的字段验证
	private async triggerAffectedFieldValidation(
		changedField: string
	): Promise<void> {
		// 处理传统的 affectFields
		const affectedFields = this.fieldAffects.get(changedField);
		if (affectedFields) {
			for (const field of affectedFields) {
				await this.validate(field);
			}
		}

		// 处理 validateEffects
		const validateEffects = this.fieldValidateEffects.get(changedField);
		if (validateEffects) {
			for (const effect of validateEffects) {
				// 处理同行影响
				if (effect.affectFields) {
					for (const affectField of effect.affectFields) {
						// 检查字段是否有注册的验证器
						if (this.fieldValidators.has(affectField)) {
							await this.validate(affectField);
						}
					}
				}

				// 处理下一行影响
				if (effect.effectNextRow) {
					// 尝试获取行信息，支持两种格式：完整ID和原始ID
					let rowInfo = this.fieldRowInfo.get(changedField);
					if (!rowInfo) {
						// 如果是动态表单字段（格式：row_fieldId），尝试用原始ID获取行信息
						const match = changedField.match(/^(\d+)_(.+)$/);
						if (match) {
							const [, rowIndex, originalFieldId] = match;
							rowInfo = this.fieldRowInfo.get(originalFieldId);
						}
					}

					if (rowInfo && !rowInfo.isLast) {
						const nextRow = rowInfo.currentRow + 1;
						if (effect.affectFields) {
							for (const affectField of effect.affectFields) {
								const nextRowField = `${nextRow}_${affectField}`;
								// 检查字段是否有注册的验证器
								if (this.fieldValidators.has(nextRowField)) {
									await this.validate(nextRowField);
								}
							}
						}
					}
				}

				// 处理上一行影响
				if (effect.effectPreviousRow) {
					// 尝试获取行信息，支持两种格式：完整ID和原始ID
					let rowInfo = this.fieldRowInfo.get(changedField);
					if (!rowInfo) {
						// 如果是动态表单字段（格式：row_fieldId），尝试用原始ID获取行信息
						const match = changedField.match(/^(\d+)_(.+)$/);
						if (match) {
							const [, rowIndex, originalFieldId] = match;
							rowInfo = this.fieldRowInfo.get(originalFieldId);
						}
					}

					if (rowInfo && rowInfo.currentRow > 0) {
						const prevRow = rowInfo.currentRow - 1;
						if (effect.affectFields) {
							for (const affectField of effect.affectFields) {
								const prevRowField = `${prevRow}_${affectField}`;
								// 检查字段是否有注册的验证器
								if (this.fieldValidators.has(prevRowField)) {
									await this.validate(prevRowField);
								}
							}
						}
					}
				}
			}
		}
	}

	// 内部方法：获取验证器实例
	getValidator(): FormValidator {
		return this.validator;
	}

	// 注册副作用
	registerEffects(field: string, effects: EffectConfig[]): void {
		if (this.fieldEffects.has(field)) {
			console.warn(
				`字段 "${field}" 已经注册了副作用，不能重复注册。请检查是否有重复的字段 ID 或组件。`
			);
		}
		this.fieldEffects.set(field, effects);
	}

	// 注册动作
	registerActions(field: string, actions: ActionConfig[]): void {
		if (this.fieldActions.has(field)) {
			console.warn(
				`字段 "${field}" 已经注册了动作，不能重复注册。请检查是否有重复的字段 ID 或组件。`
			);
		}
		this.fieldActions.set(field, actions);
	}

	// 触发副作用
	async triggerEffects(field: string): Promise<void> {
		const effects = this.fieldEffects.get(field);
		if (!effects || effects.length === 0) return;

		this.setProcessingState(true);

		try {
			for (const effect of effects) {
				await this.effectsScheduler.add(async () => {
					try {
						if (effect.effectedKeys && !effect.handler) {
							for (const key of effect.effectedKeys) {
								runInAction(() => {
									this.state.values[key] = undefined;
									if (this.state.fields[key]) {
										this.state.fields[key].value = undefined;
										this.state.fields[key].errors = [];
									}
								});
							}
						}

						if (effect.handler) {
							let rowInfo = this.fieldRowInfo.get(field);
							if (!rowInfo) {
								const match = field.match(/^(\d+)_(.+)$/);
								if (match) {
									const [, rowIndex, originalFieldId] = match;
									rowInfo = this.fieldRowInfo.get(originalFieldId);
								}
							}

							const value = this.getValue(field);
							const rowValue = rowInfo ? rowInfo.getRowValues() : {};

							const result = await effect.handler({
								store: this,
								rowInfo,
								value,
								rowValue,
							});

							if (result && typeof result === 'object') {
								runInAction(() => {
									Object.entries(result).forEach(([key, value]) => {
										if (
											value &&
											typeof value === 'object' &&
											'fieldValue' in value
										) {
											if (value.fieldValue !== undefined) {
												this.state.values[key] = value.fieldValue;
												if (this.state.fields[key]) {
													this.state.fields[key].value = value.fieldValue;
												}
											}
										} else {
											this.state.values[key] = value;
											if (this.state.fields[key]) {
												this.state.fields[key].value = value;
											}
										}
									});
								});
							}
						}
					} catch (error) {
						console.error(`执行副作用失败: ${field}`, error);
					}
				});
			}
		} finally {
			this.setProcessingState(false);
		}
	}

	// 触发动作
	async triggerActions(field: string): Promise<void> {
		const affectedActions: Array<{ field: string; action: ActionConfig }> = [];
		for (const [actionField, actions] of this.fieldActions) {
			for (const action of actions) {
				if (action.effectedBy.includes(field)) {
					affectedActions.push({ field: actionField, action });
				}
			}
		}

		if (affectedActions.length === 0) return;

		this.setProcessingState(true);

		try {
			for (const { field: actionField, action } of affectedActions) {
				await this.effectsScheduler.add(async () => {
					try {
						this.setFieldState(actionField, { processing: true });

						let rowInfo = this.fieldRowInfo.get(field);
						if (!rowInfo) {
							const match = field.match(/^(\d+)_(.+)$/);
							if (match) {
								const [, rowIndex, originalFieldId] = match;
								rowInfo = this.fieldRowInfo.get(originalFieldId);
							}
						}

						const value = this.getValue(field);
						const rowValue = rowInfo ? rowInfo.getRowValues() : {};

						const result = await action.handler({
							store: this,
							rowInfo,
							value,
							rowValue,
						});

						runInAction(() => {
							if (result.fieldValue !== undefined) {
								this.state.values[actionField] = result.fieldValue;
								if (this.state.fields[actionField]) {
									this.state.fields[actionField].value = result.fieldValue;
								}
							}
							if (result.fieldProps) {
								if (!this.state.fields[actionField]) {
									this.state.fields[actionField] = {
										value: undefined,
										touched: false,
										dirty: false,
										errors: [],
										validating: false,
										processing: false,
									};
								}
								(this.state.fields[actionField] as any).fieldProps =
									result.fieldProps;
							}
						});
					} catch (error) {
						console.error(`执行动作失败: ${actionField}`, error);
					} finally {
						this.setFieldState(actionField, { processing: false });
					}
				});
			}
		} finally {
			this.setProcessingState(false);
		}
	}

	// 设置处理状态
	private setProcessingState(processing: boolean): void {
		if (this.processingTimeout) {
			clearTimeout(this.processingTimeout);
		}

		if (processing) {
			// 延迟 100ms 显示处理状态
			this.processingTimeout = setTimeout(() => {
				runInAction(() => {
					this.state.processing = true;
				});
			}, 100);
		} else {
			runInAction(() => {
				this.state.processing = false;
			});
		}
	}

	// 注册外部状态监听器
	registerExternalStateListener(listener: ExternalStateListener): void {
		this.externalStateListeners.set(listener.id, listener);
	}

	// 注销外部状态监听器
	unregisterExternalStateListener(id: string): void {
		this.externalStateListeners.delete(id);
	}

	// 从外部状态更新表单字段
	async updateFromExternalState(externalState: any): Promise<void> {
		if (this.externalStateListeners.size === 0) return;

		this.setProcessingState(true);

		try {
			for (const listener of this.externalStateListeners.values()) {
				if (listener.condition && !listener.condition(externalState)) {
					continue;
				}

				await this.effectsScheduler.add(async () => {
					try {
						const result = await listener.handler(externalState, this);

						runInAction(() => {
							Object.entries(result).forEach(([field, update]) => {
								if (update.fieldValue !== undefined) {
									this.state.values[field] = update.fieldValue;
									if (this.state.fields[field]) {
										this.state.fields[field].value = update.fieldValue;
										this.state.fields[field].dirty = true;
									}
								}

								if (update.fieldProps) {
									if (!this.state.fields[field]) {
										this.state.fields[field] = {
											value: undefined,
											touched: false,
											dirty: false,
											errors: [],
											validating: false,
											processing: false,
										};
									}
									(this.state.fields[field] as any).fieldProps =
										update.fieldProps;
								}

								if (this.state.fields[field]) {
									this.state.fields[field].errors = [];
								}
								if (this.state.errors[field]) {
									delete this.state.errors[field];
								}
							});
						});
					} catch (error) {
						console.error(`执行外部状态监听器失败: ${listener.id}`, error);
					}
				});
			}
		} finally {
			this.setProcessingState(false);
		}
	}

	// 设置全局禁用状态
	setDisabled(disabled: boolean): void {
		runInAction(() => {
			this.state.disabled = disabled;
		});
	}

	// 获取全局禁用状态
	isDisabled(): boolean {
		return this.state.disabled;
	}

	// 设置全局请求状态
	setRequesting(requesting: boolean): void {
		runInAction(() => {
			this.state.requesting = requesting;
		});
	}

	// 获取全局请求状态
	isRequesting(): boolean {
		return this.state.requesting;
	}

	// 检查是否有任何请求正在运行
	isAnyRequestRunning(): boolean {
		return this.requestScheduler.isRunning();
	}

	// 获取请求调度器状态
	getRequestSchedulerStatus(): {
		currentRunning: number;
		queueLength: number;
		maxConcurrent: number;
	} {
		return {
			currentRunning: this.requestScheduler.getCurrentRunning(),
			queueLength: this.requestScheduler.getQueueLength(),
			maxConcurrent: 5,
		};
	}

	// 设置值变化回调
	setOnValuesChange(
		callback: (changedValues: any, allValues: any) => void
	): void {
		this.onValuesChange = callback;
	}

	// 注册 When 组件监听器
	registerWhenListener(listener: WhenListener): void {
		this.whenListeners.set(listener.id, listener);
	}

	// 注销 When 组件监听器
	unregisterWhenListener(id: string): void {
		this.whenListeners.delete(id);
	}

	// 触发 When 组件重新计算
	private triggerWhenListeners(changedField: string): void {
		for (const listener of this.whenListeners.values()) {
			// 检查是否受到当前字段变化的影响
			if (listener.effectedBy.includes(changedField)) {
				// 获取影响字段的值
				const effectedValues: Record<string, FieldValue> = {};
				listener.effectedBy.forEach((field) => {
					effectedValues[field] = this.getValue(field);
				});

				// 执行 show 函数
				const shouldShow = listener.show({
					store: this,
					effectedValues,
					rowInfo: listener.rowInfo,
				});

				// 这里可以通过回调通知 When 组件更新显示状态
				// 由于 React 的响应式特性，我们只需要确保 store 的变化能够触发重新渲染
				// 实际的显示逻辑在 When 组件内部处理
			}
		}
	}

	// 新增：请求管理方法实现

	// 注册字段请求
	registerFieldRequest(field: string, config: FieldRequestConfig): void {
		if (this.fieldRequests.has(field)) {
			console.warn(`字段 "${field}" 已经注册了请求配置，不能重复注册。`);
		}
		this.fieldRequests.set(field, config);

		if (config.effectedBy && config.effectedBy.length > 0) {
			config.effectedBy.forEach((depField) => {
				if (!this.fieldRequestDependencies.has(depField)) {
					this.fieldRequestDependencies.set(depField, new Set());
				}
				this.fieldRequestDependencies.get(depField)!.add(field);
			});
		}
	}

	// 注销字段请求
	unregisterFieldRequest(field: string): void {
		this.fieldRequests.delete(field);
		this.fieldData.delete(field);
	}

	// 获取字段数据
	getFieldData<T = any>(field: string): ApiResponse<T> | null {
		const data = this.fieldData.get(field);
		if (data === undefined) {
			return null;
		}
		return {
			success: true,
			data: data as T,
		};
	}

	// 分发字段请求
	async dispatchFieldRequest(
		field: string,
		params?: { keyword?: string }
	): Promise<void> {
		const config = this.fieldRequests.get(field);
		if (!config) {
			console.warn(`字段 "${field}" 没有注册请求配置`);
			return;
		}

		runInAction(() => {
			this.contextRequestState[field] = {
				...this.contextRequestState[field],
				loading: true,
			};
		});

		await this.requestScheduler.add(async () => {
			try {
				let rowInfo = this.fieldRowInfo.get(field);
				if (!rowInfo) {
					const match = field.match(/^(\d+)_(.+)$/);
					if (match) {
						const [, rowIndex, originalFieldId] = match;
						rowInfo = this.fieldRowInfo.get(originalFieldId);
					}
				}

				const value = this.getValue(field);
				const rowValues = rowInfo ? rowInfo.getRowValues() : {};

				// 获取默认选项列表
				const defaultResult = await config.handler({
					store: this,
					rowInfo,
					rowValues,
					keyword: params?.keyword,
					value,
				});

				// 如果有 searchedById 配置且当前有值，则获取选中项的详细信息
				let selectedItemResult = null;
				if (config.searchedById && value) {
					try {
						selectedItemResult = await config.searchedById({
							store: this,
							rowInfo,
							rowValues,
							value,
						});
					} catch (error) {
						console.warn(
							`⚠️ [dispatchFieldRequest] searchedById 执行失败: ${field}`,
							error
						);
					}
				}

				// 合并结果：默认选项 + 选中项（去重）
				let finalData = defaultResult.success ? defaultResult.data : [];

				// 调试日志：检查合并过程
				if (field === 'city') {
					console.log(
						`🔧 [dispatchFieldRequest] ${field} - defaultData:`,
						finalData
					);
					console.log(
						`🔧 [dispatchFieldRequest] ${field} - selectedItemResult:`,
						selectedItemResult
					);
				}

				if (
					selectedItemResult &&
					selectedItemResult.success &&
					selectedItemResult.data
				) {
					const selectedItem = selectedItemResult.data;

					// 如果选中项不在默认列表中，则添加到列表开头
					const isSelectedItemInList = finalData.some(
						(item: any) =>
							item.id === selectedItem.id || item.value === selectedItem.value
					);

					if (field === 'city') {
						console.log(
							`🔧 [dispatchFieldRequest] ${field} - selectedItem:`,
							selectedItem
						);
						console.log(
							`🔧 [dispatchFieldRequest] ${field} - isSelectedItemInList:`,
							isSelectedItemInList
						);
					}

					if (!isSelectedItemInList) {
						finalData = [selectedItem, ...finalData];
						if (field === 'city') {
							console.log(
								`🔧 [dispatchFieldRequest] ${field} - 添加选中项到列表开头`
							);
						}
					}
				}

				if (field === 'city') {
					console.log(
						`🔧 [dispatchFieldRequest] ${field} - finalData:`,
						finalData
					);
				}

				runInAction(() => {
					if (defaultResult.success) {
						this.fieldData.set(field, finalData);
						this.contextRequestState[field] = {
							successed: true,
							data: finalData,
							error: null,
							loading: false,
						};
					} else {
						this.contextRequestState[field] = {
							successed: false,
							data: null,
							error: defaultResult.error,
							loading: false,
						};
					}
				});
			} catch (error) {
				console.error(
					`❌ [dispatchFieldRequest] 执行字段请求失败: ${field}`,
					error
				);
				runInAction(() => {
					this.contextRequestState[field] = {
						successed: false,
						data: null,
						error: error instanceof Error ? error.message : '请求失败',
						loading: false,
					};
				});
			}
		});
	}

	// 设置表单模式
	setFormMode(mode: FormMode): void {
		runInAction(() => {
			this.formMode = mode;
		});
	}

	// 获取表单模式
	getFormMode(): FormMode {
		return this.formMode;
	}

	// 设置初始化请求配置
	setInitReqs(reqs: Record<string, FormContextRequestConfig>): void {
		runInAction(() => {
			this.initReqs = reqs;
		});
	}

	// 获取上下文数据
	getContextData(key: string): any {
		return this.contextData.get(key);
	}

	// 获取上下文请求状态
	getContextRequestState(): FormContextRequestState {
		return this.contextRequestState;
	}

	// 执行初始化请求
	executeInitReqs(): void {
		if (this.initReqsExecuted) {
			console.log('executeInitReqs - 已经执行过，跳过');
			return;
		}

		this.initReqsExecuted = true;

		// 过滤出当前模式下的请求
		const currentModeReqs = Object.entries(this.initReqs).filter(
			([key, config]) => {
				return !config.mode || config.mode.includes(this.formMode);
			}
		);

		console.log('executeInitReqs - 当前模式:', this.formMode);
		console.log(
			'executeInitReqs - 过滤后的请求:',
			currentModeReqs.map(([key]) => key)
		);

		if (currentModeReqs.length === 0) {
			console.log('executeInitReqs - 没有需要执行的请求');
			// 即使没有初始化请求，也要触发字段请求
			this.triggerInitialFieldRequests();
			return;
		}

		// 设置全局请求状态
		console.log('executeInitReqs - 设置 requesting = true');
		runInAction(() => {
			this.state.requesting = true;
		});

		// 构建依赖图并拓扑排序
		const dependencyGraph = new Map<string, string[]>();
		const reqConfigs = new Map<string, FormContextRequestConfig>();

		currentModeReqs.forEach(([key, config]) => {
			dependencyGraph.set(key, config.depends || []);
			reqConfigs.set(key, config);
		});

		const sortedReqs = this.topologicalSort(dependencyGraph);
		const effectedData: Record<string, any> = {};

		console.log('executeInitReqs - 排序后的请求:', sortedReqs);

		// 按顺序执行请求
		for (const reqKey of sortedReqs) {
			const config = reqConfigs.get(reqKey);
			if (!config) continue;

			console.log(`executeInitReqs - 添加请求到队列: ${reqKey}`);

			runInAction(() => {
				this.contextRequestState[reqKey] = {
					...this.contextRequestState[reqKey],
					loading: true,
				};
			});

			this.requestScheduler.add(async () => {
				console.log(`executeInitReqs - 开始执行请求: ${reqKey}`);
				try {
					const result = await config.req({
						store: this,
						effectedData,
					});

					console.log(`executeInitReqs - 请求完成: ${reqKey}`, result.success);

					runInAction(() => {
						if (result.success) {
							this.contextData.set(reqKey, result.data);
							effectedData[reqKey] = result.data;
							this.contextRequestState[reqKey] = {
								successed: true,
								data: result.data,
								error: null,
								loading: false,
							};
						} else {
							this.contextRequestState[reqKey] = {
								successed: false,
								data: null,
								error: result.error,
								loading: false,
							};
						}
					});
				} catch (error) {
					console.error(`执行初始化请求失败: ${reqKey}`, error);
					runInAction(() => {
						this.contextRequestState[reqKey] = {
							successed: false,
							data: null,
							error: error instanceof Error ? error.message : '请求失败',
							loading: false,
						};
					});
				}
			});
		}

		// 监听请求完成状态
		const checkCompletion = () => {
			const isRunning = this.requestScheduler.isRunning();
			console.log('executeInitReqs - checkCompletion, isRunning:', isRunning);

			if (!isRunning) {
				console.log('executeInitReqs - 设置 requesting = false');
				runInAction(() => {
					this.state.requesting = false;
				});
				// 初始化请求完成后，触发字段请求
				this.triggerInitialFieldRequests();
				return;
			}
			setTimeout(checkCompletion, 100);
		};
		setTimeout(checkCompletion, 100);
	}

	// 触发初始字段请求
	private triggerInitialFieldRequests(): void {
		console.log('triggerInitialFieldRequests - 开始触发字段请求');
		// 延迟执行，确保所有字段都已注册
		setTimeout(() => {
			for (const [field, config] of this.fieldRequests.entries()) {
				// 只触发没有依赖的字段请求，有依赖的字段会在依赖字段变化时自动触发
				if (!config.effectedBy || config.effectedBy.length === 0) {
					console.log(`triggerInitialFieldRequests - 触发字段请求: ${field}`);
					this.dispatchFieldRequest(field);
				}
			}
		}, 0);
	}

	// 拓扑排序算法
	private topologicalSort(dependencyGraph: Map<string, string[]>): string[] {
		const result: string[] = [];
		const visited = new Set<string>();
		const visiting = new Set<string>();

		const visit = (node: string): void => {
			if (visiting.has(node)) {
				throw new Error(`检测到循环依赖: ${node}`);
			}
			if (visited.has(node)) {
				return;
			}

			visiting.add(node);
			const dependencies = dependencyGraph.get(node) || [];
			for (const dep of dependencies) {
				visit(dep);
			}
			visiting.delete(node);
			visited.add(node);
			result.push(node);
		};

		for (const node of dependencyGraph.keys()) {
			if (!visited.has(node)) {
				visit(node);
			}
		}

		return result;
	}

	// 触发字段请求
	private async triggerFieldRequests(changedField: string): Promise<void> {
		const dependentFields = this.fieldRequestDependencies.get(changedField);
		if (dependentFields) {
			for (const field of dependentFields) {
				if (this.fieldRequests.has(field)) {
					// 清理依赖字段的值，因为依赖字段已经改变
					this.setValue(field, undefined);
					// 清空字段数据
					this.fieldData.delete(field);
					// 重新请求数据
					await this.dispatchFieldRequest(field);
				}
			}
		}
	}
}
