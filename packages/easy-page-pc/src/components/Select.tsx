import React from 'react';
import { observer } from 'mobx-react';
import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd';
import { FieldValue, useFormContext } from '@easy-page/core';

export interface SelectProps
	extends Omit<AntSelectProps, 'value' | 'onChange'> {
	value?: FieldValue;
	onChange?: (value: FieldValue) => void;
	remoteSearch?: boolean;
	onSearch?: (keyword: string) => Promise<any[]>;
}

export const Select: React.FC<SelectProps> = observer(
	({
		value,
		onChange,
		remoteSearch = false,
		onSearch,
		style,
		options = [],
		...props
	}: SelectProps) => {
		const { store } = useFormContext();

		// 从 store 获取字段数据作为 options
		const fieldData = store.getFieldData<any[]>(props.id as string);

		// 调试日志：检查字段数据
		if (props.id === 'city') {
			console.log(`🎯 [Select ${props.id}] fieldData:`, fieldData);
			console.log(`🎯 [Select ${props.id}] fieldData.data:`, fieldData?.data);
		}

		// 转换数据格式：将 { id, name } 格式转换为 { label, value } 格式
		const convertOptions = (data: any[]) => {
			return data.map((item) => {
				// 如果已经是正确的格式，直接返回
				if (item.label && item.value !== undefined) {
					return item;
				}
				// 如果是 { id, name } 格式，转换为 { label, value }
				if (item.id !== undefined && item.name !== undefined) {
					return {
						label: item.name,
						value: item.id,
					};
				}
				// 如果是 { value, label } 格式，直接返回
				if (item.value !== undefined && item.label !== undefined) {
					return item;
				}
				// 其他格式，尝试使用 toString() 作为 label
				return {
					label: String(item),
					value: item,
				};
			});
		};

		const finalOptions =
			fieldData?.success &&
			Array.isArray(fieldData.data) &&
			fieldData.data.length > 0
				? convertOptions(fieldData.data)
				: Array.isArray(options)
				? convertOptions(options)
				: [];

		// 调试日志：检查最终选项
		if (props.id === 'city') {
			console.log(`🎯 [Select ${props.id}] finalOptions:`, finalOptions);
			console.log(
				`🎯 [Select ${props.id}] finalOptions.length:`,
				finalOptions.length
			);
		}

		// 调试日志：检查编辑模式下的选项匹配情况
		if (value && finalOptions.length > 0) {
			const selectedOption = finalOptions.find(
				(option) => option.value === value
			);
			if (!selectedOption) {
				console.log(
					`🔍 [Select ${props.id}] 编辑模式警告：当前值 ${value} 不在选项列表中`
				);
			}
		}

		const handleChange = (val: any) => {
			onChange?.(val);
		};

		const handleSearch = async (keyword: string) => {
			if (remoteSearch && props.id && store) {
				// 使用 store.dispatchFieldRequest 进行搜索
				await store.dispatchFieldRequest(props.id as string, { keyword });
			} else if (onSearch) {
				// 如果提供了自定义的 onSearch，则使用它
				await onSearch(keyword);
			}
		};

		// 过滤掉 props 中的 undefined 值，避免 Object.keys() 错误
		const filteredProps = Object.fromEntries(
			Object.entries(props).filter(([_, value]) => value !== undefined)
		);

		return (
			<AntSelect
				value={value}
				onChange={handleChange}
				onSearch={remoteSearch ? handleSearch : undefined}
				showSearch={remoteSearch}
				filterOption={!remoteSearch}
				options={finalOptions}
				style={style || { minWidth: 200 }}
				{...filteredProps}
			/>
		);
	}
);
