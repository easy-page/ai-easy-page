import { MoreSkillsIcon } from '@/views/aiChat/components/Icons';
import { IconButton } from '@douyinfe/semi-ui';

export type AudioInputBtnProps = {
	disabled?: boolean;
};
export const AudioInputBtn = ({ disabled }: AudioInputBtnProps) => {
	return <IconButton icon={<MoreSkillsIcon />} disabled={disabled} />;
};
