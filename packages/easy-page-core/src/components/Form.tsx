import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import { FormProps, FieldValue, FormMode } from '../types';
import { FormStoreImpl } from '../store/store';
import { FormProvider } from '../context';

export const Form: React.FC<FormProps> = observer(
	({
		children,
		initialValues = {},
		mode = FormMode.CREATE,
		initReqs = {},
		onSubmit,
		onValuesChange,
		store: externalStore,
		loadingComponent,
	}) => {
		const [store] = useState<FormStoreImpl>(() => {
			if (externalStore) {
				return externalStore as FormStoreImpl;
			} else {
				return new FormStoreImpl(initialValues);
			}
		});
		const validator = store.getValidator();

		// 设置表单模式和初始化请求配置
		useEffect(() => {
			store.setFormMode(mode);
			store.setInitReqs(initReqs);
		}, [mode, initReqs, store]);

		// 执行初始化请求
		useEffect(() => {
			// 延迟执行，确保所有 effects 和 actions 初始化完成
			const timer = setTimeout(() => {
				store.executeInitReqs();
			}, 0);

			return () => clearTimeout(timer);
		}, [store]); // 只在 store 变化时执行

		// 监听值变化
		useEffect(() => {
			if (onValuesChange) {
				store.setOnValuesChange(onValuesChange);
			}
		}, [onValuesChange, store]);

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();

			if (onSubmit) {
				await store.submit();
				if (store.state.submitted) {
					await onSubmit(store.state.values, store);
				}
			}
		};

		// 渲染自定义 loading 组件
		const renderLoadingComponent = () => {
			console.log(
				'Form renderLoadingComponent - store.state.requesting:',
				store.state.requesting
			);

			if (!store.state.requesting) return null;

			if (loadingComponent) {
				if (typeof loadingComponent === 'function') {
					return loadingComponent();
				}
				return loadingComponent;
			}

			// 默认 loading 组件
			return (
				<div className="easy-form-loading-overlay">
					<div className="easy-form-loading-spinner">
						<div className="easy-form-loading-icon"></div>
						<div className="easy-form-loading-text">加载中...</div>
					</div>
				</div>
			);
		};

		return (
			<FormProvider store={store} validator={validator}>
				<form
					onSubmit={handleSubmit}
					className={`easy-form ${
						store.state.requesting ? 'easy-form-requesting' : ''
					}`}
				>
					{renderLoadingComponent()}
					{children}
				</form>
			</FormProvider>
		);
	}
);
