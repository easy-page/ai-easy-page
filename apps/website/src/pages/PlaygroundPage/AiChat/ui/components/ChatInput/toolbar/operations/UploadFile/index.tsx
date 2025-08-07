import { generateContextId } from '../../../../../../routers/toChat';
import { UploadAcceptType } from '../../../../../../common/constants/upload';
import {
	ChatMessageContextType,
	FileMessageContext,
} from '../../../../../../common/interfaces/messages/chatMessages/context';
import { useService } from '../../../../../../infra/ioc';
import { ChatService } from '../../../../../../services/chatGlobalState';
import { FileIcon, IconButton } from '../../../../Icons';
export type UploadFileBtnProps = {
	disabled?: boolean;
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

export const UploadFileBtn = ({ disabled }: UploadFileBtnProps) => {
	const chatService = useService(ChatService);
	return (
		<IconButton
			className=" text-large"
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
			icon={<FileIcon />}
			disabled={disabled}
		/>
	);
};
