import {
	ValidationRule,
	ValidationResult,
	FormStore,
	Validator,
	FieldValue,
	ExtendedRowInfo,
} from './types';

export class FormValidator implements Validator {
	private customRules: Map<
		string,
		(
			value: FieldValue,
			rule: ValidationRule,
			store: FormStore
		) => Promise<ValidationResult>
	> = new Map();

	async validate(
		value: FieldValue,
		rule: ValidationRule,
		store: FormStore,
		rowInfo?: ExtendedRowInfo
	): Promise<ValidationResult> {
		const { required, message, pattern, min, max, len, validator, transform } =
			rule;

		// 转换值
		let transformedValue = value;
		if (transform) {
			transformedValue = transform(value);
		}

		// 必填验证
		if (required) {
			if (
				transformedValue === null ||
				transformedValue === undefined ||
				transformedValue === ''
			) {
				return {
					valid: false,
					message: message || '此字段为必填项',
					field: '',
				};
			}
		}

		// 如果值为空且不是必填，则跳过其他验证
		if (
			transformedValue === null ||
			transformedValue === undefined ||
			transformedValue === ''
		) {
			return {
				valid: true,
				field: '',
			};
		}

		// 正则验证
		if (pattern && typeof transformedValue === 'string') {
			if (!pattern.test(transformedValue)) {
				return {
					valid: false,
					message: message || '格式不正确',
					field: '',
				};
			}
		}

		// 长度验证
		if (len !== undefined) {
			const valueLength =
				typeof transformedValue === 'string'
					? transformedValue.length
					: Array.isArray(transformedValue)
					? transformedValue.length
					: 0;
			if (valueLength !== len) {
				return {
					valid: false,
					message: message || `长度必须为 ${len}`,
					field: '',
				};
			}
		}

		// 最小值验证
		if (min !== undefined) {
			const numValue =
				typeof transformedValue === 'number'
					? transformedValue
					: typeof transformedValue === 'string'
					? transformedValue.length
					: 0;
			if (numValue < min) {
				return {
					valid: false,
					message: message || `不能小于 ${min}`,
					field: '',
				};
			}
		}

		// 最大值验证
		if (max !== undefined) {
			const numValue =
				typeof transformedValue === 'number'
					? transformedValue
					: typeof transformedValue === 'string'
					? transformedValue.length
					: 0;
			if (numValue > max) {
				return {
					valid: false,
					message: message || `不能大于 ${max}`,
					field: '',
				};
			}
		}

		// 自定义验证器
		if (validator) {
			try {
				// 获取当前行的所有值
				const rowValues = rowInfo ? rowInfo.getRowValues() : {};

				const result = await validator({
					value: transformedValue,
					store,
					rowInfo,
					rowValues,
				});
				if (result === false) {
					return {
						valid: false,
						message: message || '验证失败',
						field: '',
					};
				} else if (typeof result === 'string') {
					return {
						valid: false,
						message: result,
						field: '',
					};
				}
			} catch (error) {
				console.error('自定义验证器执行错误:', error);
				return {
					valid: false,
					message: error instanceof Error ? error.message : '验证失败',
					field: '',
				};
			}
		}

		return {
			valid: true,
			field: '',
		};
	}

	addRule(
		name: string,
		validator: (
			value: FieldValue,
			rule: ValidationRule,
			store: FormStore
		) => Promise<ValidationResult>
	): void {
		this.customRules.set(name, validator);
	}

	getCustomRule(name: string) {
		return this.customRules.get(name);
	}
}
