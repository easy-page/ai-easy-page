import React from 'react';
import {
	DynamicForm as CoreDynamicForm,
	DynamicFormRow,
	CustomContainerProps,
	useRowInfo as useCoreRowInfo,
	RowInfo,
} from '@easy-page/core';
import {
	TabContainer,
	TableContainer,
	GridTableContainer,
	CardContainer,
	ContainerType,
} from './index';

// 重新导出核心的 useRowInfo
export const useRowInfo = useCoreRowInfo;

// PC版本的动态表单配置
export interface DynamicFormProps
	extends Omit<
		React.ComponentProps<typeof CoreDynamicForm>,
		'customContainer'
	> {
	containerType?: ContainerType; // 容器类型
	customContainer?: (props: CustomContainerProps) => React.ReactNode; // 可选的自定义容器
	/** 仅仅针对：containerType === 'grid-table' 生效 */
	gridColumns?: number[]; // Grid 布局的列宽分配，如 [1,2,2,1] 表示分成 6 份
	/** 仅仅针对：containerType === 'grid-table' 生效 */
	headers?: React.ReactNode[]; // 自定义表头，每个元素对应一个字段列
}

// 重新导出类型
export type { DynamicFormRow, CustomContainerProps, RowInfo };

// 主组件
export const DynamicForm: React.FC<DynamicFormProps> = ({
	containerType = 'tab',
	customContainer,
	gridColumns,
	headers,
	...props
}) => {
	// 根据containerType选择默认容器
	const getDefaultContainer = () => {
		switch (containerType) {
			case 'tab':
				return TabContainer;
			case 'table':
				return TableContainer;
			case 'grid-table':
				return GridTableContainer;
			case 'card':
				return CardContainer;
			default:
				return TabContainer;
		}
	};

	const defaultContainer = getDefaultContainer();

	// 如果使用默认容器且是 grid-table 类型，需要包装以传递 gridColumns 和 headers
	const container =
		customContainer ||
		((containerProps: CustomContainerProps) => {
			if (headers) containerProps.headers = headers;
			if (containerType === 'grid-table') {
				const extraProps: any = {};
				if (gridColumns) extraProps.gridColumns = gridColumns;
				return defaultContainer({ ...containerProps, ...extraProps });
			}

			return defaultContainer(containerProps);
		});

	return <CoreDynamicForm {...props} customContainer={container} />;
};

export default DynamicForm;
