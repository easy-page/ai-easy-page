import { SenceInputComponentOperation } from '@/common/interfaces';
import { OperationBtn } from '../../OperationBtn';
import { UploadAcceptType } from '@/common/constants/upload';
import {
    ChatMessageContextType,
    FileMessageContext,
} from '@/common/interfaces/messages/chatMessages/context';
import { ChatService } from '@/services/chatGlobalState';
import { useService } from '@/infra';
import { generateContextId, generateLocalId } from '@/routers/toChat';
import { useObservable } from '@/hooks/useObservable';
import { useMemo } from 'react';
export type UploadFileProps = {
    operation: SenceInputComponentOperation;
    onChange: (val: string) => void;
};

export const DownloadFileOperation = ({ operation, onChange }: UploadFileProps) => {
    const { icon, label, downloadFileConfig } = operation;

    return (
        <>
            <OperationBtn
                icon={icon}
                label={label}
                onClick={(e) => {
                    if (downloadFileConfig?.fileUrl) {
                        const link = document.createElement('a');
                        link.href = downloadFileConfig.fileUrl;
                        link.download = label || 'download';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }}
            />
        </>
    );
};
