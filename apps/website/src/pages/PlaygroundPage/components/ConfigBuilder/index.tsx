import { FC, useState, useEffect } from 'react';
import { message } from 'antd';
import { SCHEMA_TEMPLATES } from '../../Schema';
import FormMode from './components/FormMode';
import PageMode from './components/PageMode';
import './index.less';
import { useService } from '@/infra/ioc/react';
import { ChatService } from '@/services/chatGlobalState';
import { useObservable } from '@/hooks/useObservable';

interface ConfigBuilderProps {
	selectedNode?: string | null;
	onNodeSelect?: (nodeId: string) => void;
	expandedKeys?: string[];
	onExpand?: (expandedKeys: string[]) => void;
}

const ConfigBuilder: FC<ConfigBuilderProps> = ({
	selectedNode,
	onNodeSelect,
	expandedKeys,
	onExpand,
}) => {
	const chatService = useService(ChatService);
	const curVenue = useObservable(chatService.globalState.curVenue$, null);
	console.log('loadVenueDetail response.data configBuilder', curVenue);
	const [buildMode, setBuildMode] = useState<'form' | 'page'>('form');

	const handleBackToSelect = () => {
		// 重置为表单模式
		setBuildMode('form');
		const formSchema = SCHEMA_TEMPLATES.EMPTY_FORM;
		chatService.globalState.updateVenueSchema(formSchema);
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
					onBack={handleBackToSelect}
					onImport={handleImportConfig}
					onSwitchToPage={handleSwitchToPage}
					selectedNode={selectedNode}
					onNodeSelect={onNodeSelect}
					expandedKeys={expandedKeys}
					onExpand={onExpand}
				/>
			);
	}
};

export default ConfigBuilder;
