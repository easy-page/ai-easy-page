import React, { createContext, useContext, ReactNode } from 'react';
import { FormStore, Validator } from './types';

interface FormContextValue {
	store: FormStore;
	validator: Validator;
}

const FormContext = createContext<FormContextValue | null>(null);

export const FormProvider: React.FC<{
	children: ReactNode;
	store: FormStore;
	validator: Validator;
}> = ({ children, store, validator }) => {
	return (
		<FormContext.Provider value={{ store, validator }}>
			{children}
		</FormContext.Provider>
	);
};

export const useFormContext = (): FormContextValue => {
	const context = useContext(FormContext);
	if (!context) {
		throw new Error('useFormContext must be used within a FormProvider');
	}
	return context;
};
