import React, { useState, useCallback, createContext, useContext } from 'react';
import {
	FormStore,
	UpdateRowRange,
	UpdateRowOptions,
	UpdateRowsConfig,
	ExtendedRowInfo,
} from '../types';
import { useFormContext } from '../context';

// 行信息上下文
export type RowInfo = ExtendedRowInfo;

const RowInfoContext = createContext<RowInfo | null>(null);

// 行信息Hook
export const useRowInfo = () => {
	const context = useContext(RowInfoContext);
	if (!context) {
		return undefined;
	}
	return context;
};

// 动态表单行配置
export interface DynamicFormRow {
	rowIndexs: number[]; // 指定哪些行使用这个配置
	restAll?: boolean; // 剩余所有行都使用这个配置
	fields: React.ReactNode[]; // 表单字段
	rowSpan?: number[]; // 合并单元格配置，如 [2, 4] 表示从第2列到第4列合并，展示第2个字段
}

// 自定义容器渲染参数
export interface CustomContainerProps {
	onAdd: () => void;
	onDelete: (index: number) => void;
	value: any[];
	canAdd: boolean;
	canDelete: (index: number) => boolean;
	rows: DynamicFormRow[];
	store: FormStore;
	renderFields: (
		index: number,
		container?: React.ReactNode,
		fieldIndex?: number
	) => React.ReactNode;
	gridColumns?: number[]; // Grid 布局的列宽分配，如 [1,2,2,1] 表示分成 6 份
	headers?: React.ReactNode[]; // 自定义表头，每个元素对应一个字段列
}

// 动态表单配置
export interface DynamicFormProps {
	id: string; // 表单数据存储的key
	maxRow?: number; // 最大行数
	minRow?: number; // 最小行数，默认为1
	customContainer: (props: CustomContainerProps) => React.ReactNode; // 必须传入自定义容器
	rows: DynamicFormRow[];
	style?: React.CSSProperties;
	className?: string;
}

// 创建行信息的辅助函数
const createRowInfo = (params: {
	baseRowInfo: { currentRow: number; totalRows: number; isLast: boolean };
	store: FormStore;
}): ExtendedRowInfo => {
	const { baseRowInfo, store } = params;
	// 辅助函数：确定要更新的行号
	const getTargetRows = (range?: UpdateRowRange): number[] => {
		let targetRows: number[] = [];
		if (range?.rows) {
			// 使用指定的行号数组
			targetRows = range.rows.filter(
				(row) => row >= 0 && row < baseRowInfo.totalRows
			);
		} else {
			// 使用范围配置
			const fromRow = range?.fromRow ?? baseRowInfo.currentRow + 1;
			const toRow = range?.toRow ?? baseRowInfo.totalRows;
			for (let row = fromRow; row < toRow; row++) {
				if (row >= 0 && row < baseRowInfo.totalRows) {
					targetRows.push(row);
				}
			}
		}
		return targetRows;
	};
	// 辅助函数：生成更新结果
	const generateUpdateResult = (
		updates: UpdateRowOptions[],
		targetRows: number[]
	) => {
		const result: Record<
			string,
			{ fieldValue: any; fieldProps: Record<string, any> }
		> = {};
		targetRows.forEach((row) => {
			updates.forEach(({ fieldId, value, fieldProps }) => {
				const fieldKey = `${row}_${fieldId}`;
				result[fieldKey] = {
					fieldValue: value,
					fieldProps: fieldProps || {},
				};
			});
		});
		return result;
	};
	return {
		...baseRowInfo,
		updateRows: (config: UpdateRowsConfig) => {
			const targetRows = getTargetRows(config.range);
			return generateUpdateResult(config.updates, targetRows);
		},
		updateRowsField: (
			fieldId: string,
			value: any,
			range?: UpdateRowRange,
			fieldProps?: Record<string, any>
		) => {
			const targetRows = getTargetRows(range);
			return generateUpdateResult([{ fieldId, value, fieldProps }], targetRows);
		},
		updateNextRow: (
			fieldId: string,
			value: any,
			fieldProps?: Record<string, any>
		) => {
			// 只更新下一行
			const nextRow = baseRowInfo.currentRow + 1;
			if (nextRow < baseRowInfo.totalRows) {
				const targetRows = [nextRow];
				return generateUpdateResult(
					[{ fieldId, value, fieldProps }],
					targetRows
				);
			}
			return {};
		},
		updateNextRows: (
			fieldId: string,
			value: any,
			rowsCount: number,
			fieldProps?: Record<string, any>
		) => {
			const fromRow = baseRowInfo.currentRow + 1;
			const toRow = Math.min(fromRow + rowsCount, baseRowInfo.totalRows);
			const targetRows = getTargetRows({ fromRow, toRow });
			return generateUpdateResult([{ fieldId, value, fieldProps }], targetRows);
		},
		updateRowsFields: (updates: UpdateRowOptions[], range?: UpdateRowRange) => {
			const targetRows = getTargetRows(range);
			return generateUpdateResult(updates, targetRows);
		},
		// 新增：获取行值的工具方法
		getRowValues: (index?: number, key?: string) => {
			// 计算目标行号
			let targetRow: number;
			if (index === undefined || index === 0) {
				// 不传或传0，获取当前行
				targetRow = baseRowInfo.currentRow;
			} else if (index > 0) {
				// 正数，获取下面的行
				targetRow = baseRowInfo.currentRow + index;
			} else {
				// 负数，获取上面的行
				targetRow = baseRowInfo.currentRow + index;
			}

			// 检查行号是否有效
			if (targetRow < 0 || targetRow >= baseRowInfo.totalRows) {
				return key ? undefined : {};
			}

			// 如果指定了key，返回特定字段的值
			if (key) {
				const fieldKey = `${targetRow}_${key}`;
				return store.getValue(fieldKey);
			}

			// 否则返回整行的所有值
			const rowValues: any = {};
			try {
				for (const [fieldKey, value] of Object.entries(store.state.values)) {
					if (fieldKey.startsWith(`${targetRow}_`)) {
						const fieldId = fieldKey.replace(`${targetRow}_`, '');
						rowValues[fieldId] = value;
					}
				}
			} catch (error) {
				console.error('获取行值时出错:', error);
				return {};
			}
			return rowValues;
		},
	};
};

// 辅助函数：克隆字段并设置正确的ID和行信息
const cloneFieldWithIndex = (params: {
	field: React.ReactNode;
	index: number;
	fieldIndex: number;
	totalRows: number;
	store: FormStore;
}): React.ReactNode => {
	const { field, index, fieldIndex, totalRows, store } = params;
	if (React.isValidElement(field)) {
		const rowInfo = createRowInfo({
			baseRowInfo: {
				currentRow: index,
				totalRows,
				isLast: index === totalRows - 1,
			},
			store,
		});

		return (
			<RowInfoContext.Provider key={`${index}_${fieldIndex}`} value={rowInfo}>
				{React.cloneElement(field, {
					id: `${index}_${(field as React.ReactElement).props.id}`,
				} as any)}
			</RowInfoContext.Provider>
		);
	}
	return field;
};

// 辅助函数：渲染字段
const renderFieldsForRow = (params: {
	rows: DynamicFormRow[];
	index: number;
	totalRows: number;
	store: FormStore;
	container?: React.ReactNode;
	fieldIndex?: number;
}): React.ReactNode => {
	const { rows, index, totalRows, store, container, fieldIndex } = params;
	let rowConfig = rows.find(
		(row) =>
			row.rowIndexs.includes(index + 1) ||
			(row.restAll && index + 1 > Math.max(...rows.flatMap((r) => r.rowIndexs)))
	);

	// 如果找不到对应行的配置，使用最后一行的配置
	if (!rowConfig && rows.length > 0) {
		rowConfig = rows[rows.length - 1];
	}

	if (!rowConfig) return null;

	// 如果指定了fieldIndex，只渲染该字段
	if (fieldIndex !== undefined) {
		const field = rowConfig.fields[fieldIndex];
		if (field) {
			return cloneFieldWithIndex({
				field,
				index,
				fieldIndex,
				totalRows,
				store,
			});
		}
		return null;
	}

	if (container) {
		// 如果提供了容器，将字段包装在容器中
		return React.cloneElement(container as React.ReactElement, {
			children: rowConfig.fields.map((field, fieldIndex) =>
				cloneFieldWithIndex({
					field,
					index,
					fieldIndex,
					totalRows,
					store,
				})
			),
		});
	}

	// 默认渲染：直接返回字段数组
	return rowConfig.fields.map((field, fieldIndex) =>
		cloneFieldWithIndex({
			field,
			index,
			fieldIndex,
			totalRows,
			store,
		})
	);
};

// 主组件
export const DynamicForm: React.FC<DynamicFormProps> = ({
	id,
	maxRow = 10,
	minRow = 1,
	customContainer,
	rows,
	style,
	className,
}) => {
	// 从 Form 上下文中获取 store
	const { store } = useFormContext();
	// 从store获取当前值
	const currentValue = store?.getValue(id) || [];
	const [value, setValue] = useState<any[]>(
		Array.isArray(currentValue) && currentValue.length > 0 ? currentValue : [{}]
	);

	// 更新store中的值
	const updateStoreValue = useCallback(
		(newValue: any[]) => {
			if (store) {
				store.setValue(id, newValue);
			}
			setValue(newValue);
		},
		[store, id]
	);

	// 添加行
	const handleAdd = useCallback(() => {
		if (value.length >= maxRow) {
			return;
		}
		const newValue = [...value, {}];
		updateStoreValue(newValue);
	}, [value, maxRow, updateStoreValue]);

	// 删除行
	const handleDelete = useCallback(
		(index: number) => {
			if (value.length <= minRow) {
				return;
			}
			const newValue = value.filter((_, i) => i !== index);
			updateStoreValue(newValue);
		},
		[value, minRow, updateStoreValue]
	);

	// 判断是否可以添加
	const canAdd = value.length < maxRow;

	// 判断是否可以删除
	const canDelete = useCallback(
		(index: number) => {
			return value.length > minRow;
		},
		[value.length, minRow]
	);

	// 渲染字段的辅助函数
	const renderFields = useCallback(
		(index: number, container?: React.ReactNode, fieldIndex?: number) => {
			return renderFieldsForRow({
				rows,
				index,
				totalRows: value.length,
				store,
				container,
				fieldIndex,
			});
		},
		[rows, value.length, store]
	);

	// 渲染容器
	const renderContainer = () => {
		const containerProps: CustomContainerProps = {
			onAdd: handleAdd,
			onDelete: handleDelete,
			value,
			canAdd,
			canDelete,
			rows,
			store,
			renderFields,
		};

		return customContainer(containerProps);
	};

	return (
		<div style={style} className={className}>
			{renderContainer()}
		</div>
	);
};

export default DynamicForm;
