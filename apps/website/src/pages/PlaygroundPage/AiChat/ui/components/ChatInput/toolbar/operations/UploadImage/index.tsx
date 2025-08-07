import { IconButton, ImageIcon } from '../../../../Icons';
export type UploadImageBtnProps = {
	disabled?: boolean;
};
export const UploadImageBtn = ({ disabled }: UploadImageBtnProps) => {
	return (
		<IconButton
			className=" text-large"
			disableBorder
			icon={<ImageIcon />}
			disabled={disabled}
		/>
	);
};
