import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { FormStore, WhenListener } from '../types';
import { useFormContext } from '../context';
import { RowInfo, useRowInfo } from './DynamicForm';

// When 组件的 props 类型定义
export interface WhenProps {
	effectedBy?: string[]; // 被哪些字段影响
	show: (params: {
		store: FormStore;
		effectedValues: Record<string, any>;
		rowInfo?: RowInfo;
	}) => boolean;
	children: React.ReactNode;
}

// When 组件实现
export const When: React.FC<WhenProps> = observer(
	({ effectedBy = [], show, children }) => {
		const { store } = useFormContext();
		const rowInfo = useRowInfo();
		const listenerRef = useRef<WhenListener | null>(null);

		// 生成唯一的监听器 ID
		const listenerId = useRef(
			`when_${Math.random().toString(36).substr(2, 9)}`
		);

		useEffect(() => {
			// 创建监听器
			const listener: WhenListener = {
				id: listenerId.current,
				effectedBy,
				show,
				rowInfo,
			};

			// 注册监听器
			store.registerWhenListener(listener);
			listenerRef.current = listener;

			// 清理函数
			return () => {
				store.unregisterWhenListener(listenerId.current);
				listenerRef.current = null;
			};
		}, [store, effectedBy.join(','), rowInfo?.currentRow, rowInfo?.totalRows]);

		// 获取影响字段的值 - 这里会触发 MobX 的响应式订阅
		const effectedValues: Record<string, any> = {};
		effectedBy.forEach((field) => {
			effectedValues[field] = store.getValue(field);
		});

		// 调用 show 函数判断是否显示
		const shouldShow = show({
			store,
			effectedValues,
			rowInfo,
		});

		// 如果不显示，返回 null
		if (!shouldShow) {
			return null;
		}

		// 如果显示，渲染子组件
		return <>{children}</>;
	}
);

export default When;
