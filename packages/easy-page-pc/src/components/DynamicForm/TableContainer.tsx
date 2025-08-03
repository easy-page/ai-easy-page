import React from 'react';
import { Table, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CustomContainerProps } from '@easy-page/core';

// 表格容器组件
export const TableContainer: React.FC<CustomContainerProps> = ({
	value,
	onAdd,
	onDelete,
	rows,
	canAdd,
	headers,
	canDelete,
	renderFields,
}) => {
	// 获取行的 rowSpan 配置
	const getRowSpanConfig = (rowIndex: number) => {
		let rowConfig = rows.find(
			(row) =>
				row.rowIndexs.includes(rowIndex + 1) ||
				(row.restAll &&
					rowIndex + 1 > Math.max(...rows.flatMap((r) => r.rowIndexs)))
		);

		// 如果找不到对应行的配置，使用最后一行的配置
		if (!rowConfig && rows.length > 0) {
			rowConfig = rows[rows.length - 1];
		}

		return rowConfig?.rowSpan;
	};

	// 生成表格列配置
	const columns = React.useMemo(() => {
		// 使用 headers 配置生成列，如果没有 headers 则使用字段配置
		const headerCount = headers?.length || 4; // 默认4列

		const baseColumns = [
			{
				title: '序号',
				dataIndex: 'index',
				key: 'index',
				width: 80,
				render: (text: any, record: any, index: number) => index + 1,
			},
		];

		// 根据 headers 生成列配置
		const fieldColumns = Array.from(
			{ length: headerCount },
			(_, fieldIndex) => ({
				title: headers?.[fieldIndex] || `字段 ${fieldIndex + 1}`,
				dataIndex: `field_${fieldIndex}`,
				key: `field_${fieldIndex}`,
				render: (text: any, record: any, rowIndex: number) => {
					// 使用 renderFields 函数来渲染字段，确保与 DynamicForm 核心组件保持一致
					return renderFields(rowIndex, undefined, fieldIndex);
				},
				onCell: (record: any, index: number | undefined) => {
					if (index === undefined) return {};

					const rowSpanConfig = getRowSpanConfig(index);

					// 如果没有 rowSpan 配置，正常显示
					if (!rowSpanConfig || rowSpanConfig.length !== 2) {
						return {};
					}

					const [startCol, endCol] = rowSpanConfig;
					const currentColIndex = fieldIndex + 1; // +1 因为 fieldIndex 从0开始

					// 如果当前列在合并范围内
					if (currentColIndex >= startCol && currentColIndex <= endCol) {
						if (currentColIndex === startCol) {
							// 这是合并的起始列，只设置 colSpan（水平合并）
							return {
								colSpan: endCol - startCol + 1, // 设置列跨度，让合并的单元格占据对应列宽
							};
						} else {
							// 其他列隐藏
							return {
								colSpan: 0, // 使用 colSpan: 0 来隐藏被合并的列
							};
						}
					}

					return {};
				},
			})
		);

		const actionColumn = {
			title: '操作',
			key: 'action',
			width: 120,
			render: (text: any, record: any, index: number) =>
				canDelete(index) ? (
					<Button
						type="text"
						danger
						size="small"
						icon={<DeleteOutlined />}
						onClick={() => onDelete(index)}
					>
						删除
					</Button>
				) : null,
		};

		return [...baseColumns, ...fieldColumns, actionColumn];
	}, [rows, canDelete, renderFields, headers]);

	return (
		<div>
			<Table
				dataSource={value}
				columns={columns}
				pagination={false}
				rowKey={(record, index) => index?.toString() || '0'}
			/>
			{canAdd && (
				<div style={{ textAlign: 'center', marginTop: '16px' }}>
					<Button type="dashed" icon={<PlusOutlined />} onClick={onAdd}>
						添加行
					</Button>
				</div>
			)}
		</div>
	);
};
