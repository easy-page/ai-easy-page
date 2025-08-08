import { SenceInputComponentOperation } from '../../../../../../common/interfaces';
import { OperationBtn } from '../../OperationBtn';

export type UploadFileProps = {
	operation: SenceInputComponentOperation;
	onChange: (val: string) => void;
};

export const DownloadFileOperation = ({
	operation,
	onChange,
}: UploadFileProps) => {
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
