import React from 'react';

import { Form } from '@easy-page/core';

export const FullFormDemo: React.FC = () => {
	const handleSubmit = async (values: any, _store: any) => {
		console.log('基础表单提交:', values);
	};

	const handleValuesChange = (changedValues: any, allValues: any) => {
		console.log('值变化:', changedValues, allValues);
	};

	const EmptyNode = () => <div>暂无内容</div>;

	return (
		<Form
			initialValues={{}}
			onSubmit={handleSubmit}
			onValuesChange={handleValuesChange}
		>
			<EmptyNode />
		</Form>
	);
};
