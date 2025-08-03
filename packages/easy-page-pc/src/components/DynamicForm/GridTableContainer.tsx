import React from 'react';
import { Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { CustomContainerProps } from '@easy-page/core';

// Grid表格容器组件 - 使用CSS Grid布局实现表格效果
export const GridTableContainer: React.FC<CustomContainerProps> = ({
	value,
	onAdd,
	onDelete,
	rows,
	canAdd,
	canDelete,
	renderFields,
	gridColumns,
	headers,
}) => {
	// 生成表头
	const generateHeader = () => {
		// 计算 Grid 列宽
		const getGridTemplateColumns = () => {
			if (gridColumns && gridColumns.length > 0) {
				// 使用自定义的列宽分配
				const columns = [
					'60px', // 序号列固定宽度
					...gridColumns.map((col) => `${col}fr`), // 字段列使用自定义比例
					'100px', // 操作列固定宽度
				];
				return columns.join(' ');
			} else {
				// 默认等宽分配，使用 headers 长度
				const headerCount = headers?.length || 4; // 默认4列
				return `60px ${headerCount}fr 100px`;
			}
		};

		// 获取表头内容
		const getHeaderContent = (index: number) => {
			if (headers && headers[index]) {
				return headers[index];
			}
			return `字段 ${index + 1}`;
		};

		// 使用 headers 配置生成表头
		const headerCount = headers?.length || 4;

		return (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: getGridTemplateColumns(),
					gap: '16px',
					alignItems: 'flex-start',
					fontWeight: 'bold',
					padding: '12px 0',
					borderBottom: '1px solid #f0f0f0',
					backgroundColor: '#fafafa',
				}}
			>
				<div>序号</div>
				{Array.from({ length: headerCount }, (_, index) => (
					<div key={index}>{getHeaderContent(index)}</div>
				))}
				<div>操作</div>
			</div>
		);
	};

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

	// 生成表格行
	const generateRows = () => {
		// 计算 Grid 列宽（与表头保持一致）
		const getGridTemplateColumns = (rowIndex?: number) => {
			// 获取当前行的 rowSpan 配置
			const currentRowSpan =
				rowIndex !== undefined ? getRowSpanConfig(rowIndex) : null;

			// 计算实际的列数（考虑合并单元格）
			let actualColumnCount = headers?.length || 4;

			if (currentRowSpan && currentRowSpan.length === 2) {
				const [startCol, endCol] = currentRowSpan;
				const mergedColumns = endCol - startCol + 1;
				// 合并的列数会减少实际需要的列数
				actualColumnCount = Math.max(actualColumnCount - mergedColumns + 1, 1);
			}

			if (gridColumns && gridColumns.length > 0) {
				// 使用自定义的列宽分配，但需要根据合并情况调整
				let columns = ['60px']; // 序号列固定宽度

				if (currentRowSpan && currentRowSpan.length === 2) {
					const [startCol, endCol] = currentRowSpan;
					const mergedColumns = endCol - startCol + 1;

					// 计算合并列的宽度（将合并的列宽相加）
					let mergedWidth = 0;
					for (
						let i = startCol - 1;
						i < endCol && i < gridColumns.length;
						i++
					) {
						mergedWidth += gridColumns[i] || 1;
					}

					// 构建列宽数组
					for (let i = 0; i < gridColumns.length; i++) {
						if (i >= startCol - 1 && i < endCol) {
							// 这是合并范围内的列
							if (i === startCol - 1) {
								// 只在合并起始位置添加合并后的宽度
								columns.push(`${mergedWidth}fr`);
							}
							// 其他合并列跳过
						} else {
							// 正常列
							columns.push(`${gridColumns[i]}fr`);
						}
					}
				} else {
					// 没有合并，正常添加所有列
					columns.push(...gridColumns.map((col: number) => `${col}fr`));
				}

				columns.push('100px'); // 操作列固定宽度
				return columns.join(' ');
			} else {
				// 默认等宽分配，使用调整后的列数
				return `60px ${actualColumnCount}fr 100px`;
			}
		};

		return value.map((item, index) => {
			const rowSpanConfig = getRowSpanConfig(index);

			return (
				<div
					key={index}
					style={{
						display: 'grid',
						gridTemplateColumns: getGridTemplateColumns(index),
						gap: '16px',
						alignItems: 'flex-start',
						padding: '12px 0',
						borderBottom: '1px solid #f0f0f0',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'flex-start' }}>
						{index + 1}
					</div>

					{/* 渲染字段，支持合并单元格 */}
					{(() => {
						const renderedFields = renderFields(index);

						// 如果没有 rowSpan 配置，正常渲染
						if (!rowSpanConfig || rowSpanConfig.length !== 2) {
							return renderedFields;
						}

						// 处理合并单元格
						const [startCol, endCol] = rowSpanConfig;
						const fieldElements = React.Children.toArray(renderedFields);

						return fieldElements.map((field, fieldIndex) => {
							// 如果当前字段在合并范围内
							if (fieldIndex >= startCol - 1 && fieldIndex < endCol) {
								if (fieldIndex === startCol - 1) {
									// 这是合并的起始字段，需要设置 grid-column 样式来占据合并的宽度
									return React.cloneElement(field as React.ReactElement, {
										style: {
											...(field as React.ReactElement).props.style,
											gridColumn: `${startCol} / ${endCol + 1}`,
										},
									});
								} else {
									// 隐藏被合并的其他字段
									return null;
								}
							}

							return field;
						});
					})()}

					<div style={{ display: 'flex', alignItems: 'flex-start' }}>
						{canDelete(index) && (
							<Button
								type="text"
								danger
								size="small"
								icon={<DeleteOutlined />}
								onClick={() => onDelete(index)}
							>
								删除
							</Button>
						)}
					</div>
				</div>
			);
		});
	};

	return (
		<div>
			{/* 表头 */}
			{generateHeader()}

			{/* 表格内容 */}
			<div style={{ border: '1px solid #f0f0f0', borderRadius: '6px' }}>
				{generateRows()}
			</div>

			{/* 添加按钮 */}
			{canAdd && (
				<div style={{ textAlign: 'center', marginTop: '16px' }}>
					<Button type="dashed" icon={<PlusOutlined />} onClick={onAdd}>
						添加行 ({value.length})
					</Button>
				</div>
			)}
		</div>
	);
};
