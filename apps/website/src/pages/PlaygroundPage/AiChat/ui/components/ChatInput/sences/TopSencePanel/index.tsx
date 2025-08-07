import { TemplateBtn } from '../TemplateBtn';
import { useEffect, useState } from 'react';
import { CloseBtn } from '../CloseBtn';
import { ChatService } from '../../../../../services/chatGlobalState';
import { SenceConfig } from '../../../../../common/interfaces/senceConfig';
import {
	CloseIcon,
	TemplateCloseIcon,
	TemplateExpandIcon,
} from '../../../Icons';

export type TopSencePanelProps = {
	curSenceConfig: SenceConfig | null;
	chatService: ChatService;
};
export const TopSencePanel = ({
	curSenceConfig,
	chatService,
}: TopSencePanelProps) => {
	const [openTemplate, setOpenTemplate] = useState(false);
	useEffect(() => {
		const senceInput = curSenceConfig?.senceInput;
		if (senceInput && senceInput.template) {
			setOpenTemplate(senceInput.template.expand);
		}
	}, [curSenceConfig]);
	if (!curSenceConfig) {
		return <></>;
	}
	const template = curSenceConfig.senceInput.template;
	return (
		<div className="flex flex-row px-2 py-2 items-center rounded-t-2xl bg-background-tertiary-light justify-between">
			<div className="flex flex-row items-center">
				<div>{curSenceConfig.icon}</div>
				<div className="text-regularPlus ml-2">{curSenceConfig.name}</div>
			</div>
			<div className="flex flex-row items-center">
				{template ? (
					<TemplateBtn
						onClick={() => {
							setOpenTemplate((pre) => !pre);
						}}
						active={openTemplate}
						className="mr-2"
						icon={openTemplate ? <TemplateExpandIcon /> : <TemplateCloseIcon />}
						label={template.title}
					/>
				) : (
					<></>
				)}
				<CloseBtn
					icon={<CloseIcon />}
					onClick={() => {
						chatService.globalState.setCurSenceConfig(null);
					}}
				/>
			</div>
		</div>
	);
};
