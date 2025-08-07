import { IconButton, ImageIcon } from '@/views/aiChat/components/Icons';
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
