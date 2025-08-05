import { FC, useState } from 'react';
import { Button, message, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormSchema } from '../../../../Schema';
import ConfigHeader from '../ConfigHeader';
import NodeTree from './NodeTree';
import AddComponentModal from './AddComponentModal';
import {
	ComponentType,
	ComponentDisplayNames,
	getDefaultComponentProps,
} from './ComponentTypes';
import './index.less';

interface FormModeProps {
	schema: FormSchema | null;
	onBack: () => void;
	onImport: () => void;
	selectedNode?: string | null;
	onNodeSelect?: (nodeId: string) => void;
	onSchemaChange?: (schema: FormSchema) => void;
}

const FormMode: FC<FormModeProps> = ({
	schema,
	onBack,
	onImport,
	selectedNode,
	onNodeSelect,
	onSchemaChange,
}) => {
	const [schemaData, setSchemaData] = useState<FormSchema | null>(schema);
	const [showAddModal, setShowAddModal] = useState(false);
	const [currentParentId, setCurrentParentId] = useState<string>('');
	const [expandedKeys, setExpandedKeys] = useState<string[]>(['form']);

	const handleAddNode = (parentId: string, nodeType: string) => {
		setCurrentParentId(parentId);
		setShowAddModal(true);
	};

	const handleAddComponent = (
		componentType: ComponentType,
		isFormComponent: boolean
	) => {
		const newComponent = {
			type: componentType,
			props: getDefaultComponentProps(componentType),
			isFormComponent,
			formItem: isFormComponent
				? {
						type: 'formItem' as const,
						properties: {
							id: `${componentType}-${Date.now()}`,
							label: ComponentDisplayNames[componentType],
							required: false,
							labelLayout: 'vertical' as const,
						},
				  }
				: undefined,
		};

		// 更新schema
		if (schemaData) {
			// 过滤掉空节点
			const filteredChildren = (schemaData.properties.children || []).filter(
				(child) => child.type !== 'EmptyNode'
			);

			const updatedSchema: FormSchema = {
				...schemaData,
				properties: {
					...schemaData.properties,
					children: [...filteredChildren, newComponent],
				},
			};

			setSchemaData(updatedSchema);
			onSchemaChange?.(updatedSchema);

			// 关闭弹窗
			setShowAddModal(false);

			// 自动选中新创建的节点并展开到该节点
			const newComponentIndex = filteredChildren.length;
			const newNodeId = `child-${newComponentIndex}`;
			onNodeSelect?.(newNodeId);

			// 确保父节点展开
			setExpandedKeys(['form']);

			message.success(`已添加${ComponentDisplayNames[componentType]}组件`);
			console.log('添加组件:', newComponent);
		} else {
			message.error('请先创建表单结构');
		}
	};

	const handleDeleteNode = (nodeId: string) => {
		message.info('删除节点功能暂未实现');
	};

	return (
		<div className="form-mode">
			<ConfigHeader
				title="表单配置"
				showBack
				showImport
				onBack={onBack}
				onImport={onImport}
			/>
			<div className="form-mode-content">
				<Card
					title="节点树"
					className="node-tree-card"
					extra={
						<Button
							type="text"
							size="small"
							icon={<PlusOutlined />}
							onClick={() => handleAddNode('form', 'component')}
						>
							添加
						</Button>
					}
				>
					<NodeTree
						schema={schemaData}
						selectedNode={selectedNode || null}
						onNodeSelect={onNodeSelect || (() => {})}
						onAddNode={handleAddNode}
						onDeleteNode={handleDeleteNode}
						expandedKeys={expandedKeys}
						onExpand={setExpandedKeys}
					/>
				</Card>
			</div>

			<AddComponentModal
				visible={showAddModal}
				onCancel={() => setShowAddModal(false)}
				onOk={handleAddComponent}
				defaultIsFormComponent={true}
			/>
		</div>
	);
};

export default FormMode;
