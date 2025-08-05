import { FC, useState } from 'react';
import { message } from 'antd';
import { SCHEMA_TEMPLATES, FormSchema } from '../../Schema';
import FormMode from './components/FormMode';
import PageMode from './components/PageMode';
import SelectMode from './components/SelectMode';
import './index.less';

interface ConfigBuilderProps {
	onSchemaChange?: (schema: FormSchema) => void;
	selectedNode?: string | null;
	onNodeSelect?: (nodeId: string) => void;
}

const ConfigBuilder: FC<ConfigBuilderProps> = ({
	onSchemaChange,
	selectedNode,
	onNodeSelect,
}) => {
	const [currentSchema, setCurrentSchema] = useState<FormSchema | null>(null);
	const [buildMode, setBuildMode] = useState<'select' | 'form' | 'page'>(
		'select'
	);

	const handleCreateForm = () => {
		const formSchema = SCHEMA_TEMPLATES.EMPTY_FORM;
		setCurrentSchema(formSchema);
		setBuildMode('form');
		onSchemaChange?.(formSchema);
		message.success('已创建基础表单结构');
	};

	const handleCreatePage = () => {
		// 暂时空着，后续实现
		setBuildMode('page');
		message.info('页面配置功能暂未实现，敬请期待...');
	};

	const handleBackToSelect = () => {
		setBuildMode('select');
		setCurrentSchema(null);
		onSchemaChange?.({} as FormSchema);
	};

	const handleImportConfig = () => {
		// 导入配置功能，暂时空着
		message.info('导入配置功能暂未实现');
	};

	switch (buildMode) {
		case 'form':
			return (
				<FormMode
					schema={currentSchema}
					onBack={handleBackToSelect}
					onImport={handleImportConfig}
					selectedNode={selectedNode}
					onNodeSelect={onNodeSelect}
					onSchemaChange={onSchemaChange}
				/>
			);
		case 'page':
			return <PageMode onBack={handleBackToSelect} />;
		default:
			return (
				<SelectMode
					onCreateForm={handleCreateForm}
					onCreatePage={handleCreatePage}
				/>
			);
	}
};

export default ConfigBuilder;
