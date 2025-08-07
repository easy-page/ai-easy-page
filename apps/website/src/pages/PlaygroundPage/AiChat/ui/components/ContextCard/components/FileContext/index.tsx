import React from 'react';
import { FileOutlined, CloseOutlined } from '@ant-design/icons';
import { FileMessageContext } from '@/common/interfaces/messages/chatMessages/context';
import './index.less';
import { DotText } from '@/views/aiChat/baseUi/components/TextDot';
import { FileColorfullIcon } from '@/views/aiChat/components/Icons';

interface FileContextProps {
	context: FileMessageContext;
	onDelete?: (id: string) => void;
}

export const FileContext: React.FC<FileContextProps> = ({
	context,
	onDelete,
}) => {
	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	return (
		<div className="file-context-card">
			<div className="file-icon">
				<FileColorfullIcon />
			</div>
			<div className="content">
				<DotText line={1} className="text-sm w-[130px]">
					{context.fileName}
				</DotText>
				<div className="file-info">
					{context.mimeType && <span>{context.mimeType}</span>}
					{context.size && <span>{formatFileSize(context.size)}</span>}
				</div>
			</div>
			{onDelete && (
				<div className="delete-btn" onClick={() => onDelete(context.id)}>
					<CloseOutlined />
				</div>
			)}
		</div>
	);
};
