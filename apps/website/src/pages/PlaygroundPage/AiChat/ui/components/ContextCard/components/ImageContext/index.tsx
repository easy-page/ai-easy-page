import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { ImageMessageContext } from '@/common/interfaces/messages/chatMessages/context';
import './index.less';

interface ImageContextProps {
    context: ImageMessageContext;
    onDelete?: (id: string) => void;
}

export const ImageContext: React.FC<ImageContextProps> = ({ context, onDelete }) => {
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="image-context-card">
            <div className="image-preview">
                {context.fileUrl ? (
                    <img src={context.fileUrl} alt={context.fileName} />
                ) : (
                    <div className="placeholder">图片预览</div>
                )}
            </div>
            <div className="content">
                <div className="file-name">{context.fileName}</div>
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
