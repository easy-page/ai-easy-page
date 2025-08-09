import { FC, useState, useEffect } from 'react';
import { message } from 'antd';
import { SCHEMA_TEMPLATES, FormSchema } from '../../Schema';
import FormMode from './components/FormMode';
import PageMode from './components/PageMode';
import './index.less';

interface ConfigBuilderProps {
	schema?: FormSchema | null;
	onSchemaChange?: (schema: FormSchema) => void;
	selectedNode?: string | null;
	onNodeSelect?: (nodeId: string) => void;
	expandedKeys?: string[];
	onExpand?: (expandedKeys: string[]) => void;
}

const ConfigBuilder: FC<ConfigBuilderProps> = ({
	schema,
	onSchemaChange,
	selectedNode,
	onNodeSelect,
	expandedKeys,
	onExpand,
}) => {
	const [currentSchema, setCurrentSchema] = useState<FormSchema | null>(null);
	const [buildMode, setBuildMode] = useState<'form' | 'page'>('form');
	console.log('12321213123:', currentSchema, schema);
	// 初始化/同步：优先使用外部 schema，其次用空模板
	useEffect(() => {
		if (schema) {
			setCurrentSchema(schema);
		} else if (!currentSchema) {
			const formSchema = SCHEMA_TEMPLATES.EMPTY_FORM;
			setCurrentSchema(formSchema);
			onSchemaChange?.(formSchema);
		}
		// 仅当外部 schema 变化时同步；currentSchema 只在本地修改时更新
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [schema]);

	const handleBackToSelect = () => {
		// 重置为表单模式
		setBuildMode('form');
		const formSchema = SCHEMA_TEMPLATES.EMPTY_FORM;
		setCurrentSchema(formSchema);
		onSchemaChange?.(formSchema);
		message.success('已重置为基础表单结构');
	};

	const handleImportConfig = () => {
		// 导入配置功能，暂时空着
		message.info('导入配置功能暂未实现');
	};

	const handleSwitchToPage = () => {
		setBuildMode('page');
		message.info('页面配置功能暂未实现，敬请期待...');
	};

	switch (buildMode) {
		case 'page':
			return <PageMode onBack={handleBackToSelect} />;
		default:
			return (
				<FormMode
					schema={currentSchema}
					onBack={handleBackToSelect}
					onImport={handleImportConfig}
					onSwitchToPage={handleSwitchToPage}
					selectedNode={selectedNode}
					onNodeSelect={onNodeSelect}
					onSchemaChange={onSchemaChange}
					expandedKeys={expandedKeys}
					onExpand={onExpand}
				/>
			);
	}
};

export default ConfigBuilder;
