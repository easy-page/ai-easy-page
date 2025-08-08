import { SenceOperationDialogInputConfig } from '../../../../../../common/interfaces';
import { Modal, Input, Button } from '@douyinfe/semi-ui';
import { useState } from 'react';
import classNames from 'classnames';
import { OperationBtn } from '../../OperationBtn';

export type DialogInputProps = SenceOperationDialogInputConfig & {
	onChange: (val: string) => void;
};

export const DialogInput = ({
	label,
	extra,
	title = '',
	value: initialValue,
	placeholder = '输入',
	confirmText = '添加链接',
	cancelText = '取消',
	icon,
	onChange,
}: DialogInputProps) => {
	console.log('DialogInput:', label);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [inputValue, setInputValue] = useState(initialValue || '');

	const handleOpen = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleAdd = () => {
		// 这里可以添加验证GitHub链接的逻辑

		// 处理添加仓库的逻辑，调用相关服务
		console.log('添加GitHub仓库:', inputValue);
		onChange(inputValue);

		setIsModalVisible(false);
	};

	return (
		<>
			<OperationBtn icon={icon} label={label} onClick={handleOpen} />
			<Modal
				title={title}
				visible={isModalVisible}
				footer={null}
				onCancel={handleCancel}
				maskClosable={false}
				closeOnEsc
				width={480}
			>
				<div className="py-4">
					<div className="mb-4 text-sm text-gray-600">{extra}</div>
					<Input
						value={inputValue}
						onChange={setInputValue}
						placeholder={placeholder}
						showClear
						className="w-full mb-4"
					/>
					<div className="flex justify-end gap-2">
						<Button onClick={handleCancel} type="tertiary">
							{cancelText}
						</Button>
						<Button onClick={handleAdd} type="primary">
							{confirmText}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};
