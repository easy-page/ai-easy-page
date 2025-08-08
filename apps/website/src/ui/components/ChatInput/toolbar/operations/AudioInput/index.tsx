import { IconButton } from '@douyinfe/semi-ui';
import { MoreSkillsIcon } from '../../../../Icons';

export type AudioInputBtnProps = {
	disabled?: boolean;
};
export const AudioInputBtn = ({ disabled }: AudioInputBtnProps) => {
	return <IconButton icon={<MoreSkillsIcon />} disabled={disabled} />;
};
