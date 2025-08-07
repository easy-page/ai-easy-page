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

const handleUploadEvent = async ({
    file,
    displayName,
    fileTpye,
    chatService,
}: {
    file: File;
    displayName?: string;
    fileTpye: ChatMessageContextType;
    chatService: ChatService;
}) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
        console.log('contextImagecontextImagecontextImage: 111', event);
        // const compressedImage = await compressImage(file);
        const base64URL = event.target?.result as string;
        const contextFile: FileMessageContext = {
            type: fileTpye as any,
            id: generateContextId(),
            base64Url: base64URL,
            file: file,
            mimeType: file.type,
            // file: file,
            fileName: displayName || file.name,
        };
        // const blob = base64ToBlob(base64URL, file.type);
        // const newFile = blobToFile(blob, file.name);
        // uploadFile({
        //     file: newFile,
        // } as any);
        console.log('contextImagecontextImagecontextImage:', base64URL);
        chatService.globalState.addCurMsgContext(contextFile);
        // chatService.globalState.addContext(contextImage);
    };
    reader.readAsDataURL(file);
};

export const UploadFileOperation = ({ operation, onChange }: UploadFileProps) => {
    const { icon, label } = operation;
    const chatService = useService(ChatService);
    const curMsgContext = useObservable(chatService.globalState.curMsgContexts$, []);
    const disabled = useMemo(() => {
        const fileContext = (curMsgContext || []).filter(
            (x) => x.type === ChatMessageContextType.FILE
        );
        return fileContext.length >= (operation.uploadFileConfig?.count || 1);
    }, [curMsgContext, operation.uploadFileConfig?.count]);
    return (
        <>
            <OperationBtn
                icon={icon}
                label={label}
                disabled={disabled}
                onClick={(e) => {
                    e.currentTarget.blur(); // Removes focus from the button to prevent tooltip from showing
                    const inputElement = document.createElement('input');
                    inputElement.type = 'file';
                    inputElement.accept = UploadAcceptType.file || '';
                    inputElement.onchange = () => {
                        if (inputElement.files && inputElement.files.length > 0) {
                            const file = inputElement.files[0];
                            const fileName = file.name;
                            handleUploadEvent({
                                file,
                                displayName: fileName,
                                fileTpye: ChatMessageContextType.FILE,
                                chatService,
                            });
                        }
                    };
                    inputElement.click();
                }}
            />
        </>
    );
};
