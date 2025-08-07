import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import classNames from 'classnames';
import { Spin } from '@douyinfe/semi-ui';
import { StepCard } from './StepCard/StepCard';
import { StepCardContainer } from './StepCard/StepCardContainer';
import { ROOT_STEP } from '../TaskInfo/constant';
import { TaskStatus } from '@/common/constants/task';
import { TaskStep, TaskRunInfo } from '@/common/interfaces/task';
import { Icons } from '@/views/aiChat/baseUi/components/icons';

const IconList = {
	[TaskStatus.FAILED]: <Icons.ExclamationTriangle />,
	[TaskStatus.COMPLETED]: <Icons.Check />,
	[TaskStatus.PENDING]: <Icons.DotsVertical />,
	[TaskStatus.RUNNING]: <Spin spinning={true} />,
	[TaskStatus.PLANNING]: <Icons.DotsVertical />,
	[TaskStatus.PAUSED]: <Icons.ExclamationTriangle />,
};

const getStepStatus = (
	step: TaskStep,
	taskRunInfo: TaskRunInfo,
	activeStepIdx: number
) => {
	const runningTaskSteps = taskRunInfo.step_results || {};
	const stepRes = runningTaskSteps[`${step.index}`] || {
		status: TaskStatus.PENDING,
	};
	const choosed = activeStepIdx === step.index;
	const isStepDisabled =
		step.index !== ROOT_STEP &&
		[TaskStatus.PENDING, TaskStatus.PLANNING].includes(stepRes.status);
	const isStepFailed = stepRes.status === TaskStatus.FAILED;
	const isStepComplated = stepRes.status === TaskStatus.COMPLETED;
	if (step.index === ROOT_STEP) {
		const isFailed = taskRunInfo.status === TaskStatus.FAILED;
		const isComplated = taskRunInfo.status === TaskStatus.COMPLETED;
		console.log('taskRunInfo', taskRunInfo);
		return {
			choosed,
			isDisabled: false,
			isFailed: isFailed,
			isComplated: isComplated,
		};
	}
	return {
		choosed,
		isDisabled: isStepDisabled,
		isFailed: isStepFailed,
		isComplated: isStepComplated,
	};
};

const Steps = ({
	taskSteps,
	activeStepIdx,
	setActiveStepIdx,
	taskRunInfo,
}: {
	taskRunInfo: TaskRunInfo;
	taskSteps: TaskStep[];
	activeStepIdx: number;
	setActiveStepIdx: (step: number) => void;
}) => {
	const [isShowMask, setIsShowMask] = useState(false);

	// 进行中的各类信息
	const {
		step_results: runningTaskSteps = {}, // task步骤信息
		failed_reason: runningTaskReason, // task失败原因
		messages: runningTaskMessage, // task消息信息
	} = taskRunInfo || {};

	useEffect(() => {
		setTimeout(() => {
			const container = document.getElementById('steps-container');
			const content = document.getElementById('steps-content');

			if (container && content) {
				const contentWidth = content.offsetWidth;
				const containerWidth = container.offsetWidth;
				console.log('contentWidth', contentWidth, containerWidth);

				if (contentWidth > containerWidth) {
					setIsShowMask(true);
				}
			}
		}, 100);
	}, []);
	console.log('taskSteps:', taskSteps);
	return (
		<div
			className={classNames('steps-container cursor-pointer outline-none')}
			id="steps-container"
		>
			{isShowMask && <div className="gradient-mask"></div>}
			<StepCardContainer
				activeTab={activeStepIdx}
				onTabChange={setActiveStepIdx}
			>
				{taskSteps.map((step: TaskStep, index: number) => {
					const { choosed, isDisabled, isFailed, isComplated } = getStepStatus(
						step,
						taskRunInfo,
						activeStepIdx
					);
					console.log('step12321321321:', step);
					return (
						<StepCard
							title={step.name}
							isFailed={isFailed}
							isComplated={isComplated}
							description={step.description}
							isActive={choosed}
							disabled={isDisabled}
							key={`card-${step.index}`}
							id={step.index}
							onClick={() => setActiveStepIdx(step.index)}
						/>
					);
				})}
			</StepCardContainer>
		</div>
	);
};

export default Steps;
