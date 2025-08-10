import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { FormStore, Validator } from './types';

interface FormContextValue {
	store: FormStore;
	validator: Validator;
}

const FormContext = createContext<FormContextValue | null>(null);

// 优化的 FormProvider，使用 computed 来减少重新渲染
export const FormProvider: React.FC<{
	children: ReactNode;
	store: FormStore;
	validator: Validator;
}> = observer(({ children, store, validator }) => {
	// 使用 useMemo 缓存 context value，避免不必要的重新创建
	const contextValue = useMemo(
		() => ({ store, validator }),
		[store, validator]
	);

	return (
		<FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
	);
});

export const useFormContext = (): FormContextValue => {
	const context = useContext(FormContext);
	if (!context) {
		throw new Error('useFormContext must be used within a FormProvider');
	}
	return context;
};

// 新增：优化的 hooks，只订阅需要的状态
export const useFormValue = (field: string) => {
	const { store } = useFormContext();
	return computed(() => store.getValue(field)).get();
};

export const useFormFieldState = (field: string) => {
	const { store } = useFormContext();
	return computed(() => store.getFieldState(field)).get();
};

export const useFormValues = () => {
	const { store } = useFormContext();
	return computed(() => store.state.values).get();
};

export const useFormRequesting = () => {
	const { store } = useFormContext();
	return computed(() => store.state.requesting).get();
};

export const useFormProcessing = () => {
	const { store } = useFormContext();
	return computed(() => store.state.processing).get();
};

export const useFormDisabled = () => {
	const { store } = useFormContext();
	return computed(() => store.isDisabled()).get();
};
