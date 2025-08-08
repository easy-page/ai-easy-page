import classNames from 'classnames';
import React from 'react';
import './index.less';
import { NewUITaskStepResult } from '@/providers/common';

interface StepSwitchProps {
    steps: NewUITaskStepResult[];
    currentStepKey: string;
    onStepChange: (stepKey: string) => void;
}

export const StepSwitch: React.FC<StepSwitchProps> = ({ steps, currentStepKey, onStepChange }) => {
    const handleClick = (step: NewUITaskStepResult) => {
        if (!step.disabled) {
            onStepChange(step.stepKey);
        }
    };

    if (steps.length === 1) {
        return <></>;
    }

    return (
        <div
            className="mt-2 px-[2px]  flex flex-row items-center  py-[1px] bg-[#F5F6FA] rounded-sm"
            style={{
                width: 'fit-content',
            }}
        >
            {steps.map((step, index) => {
                const isActive = step.stepKey === currentStepKey;
                const isDisabled = step.disabled;
                const isComplated = step.isComplated;
                const isFailed = step.isFailed;
                const style = {};

                return (
                    <div
                        className={classNames('step-card', {
                            active: isActive && !isComplated && !isFailed,
                            disabled: isDisabled,
                            complated: isActive && isComplated,
                            failed: isActive && isFailed,
                        })}
                        style={style}
                        onClick={() => handleClick(step)}
                        title={isDisabled ? '此功能暂不可用' : ''}
                        data-tab={step.stepKey}
                    >
                        <div className={classNames('step-title text-[16px] font-medium', {})}>
                            {/* <span
                                className={classNames({
                                    'active-indicator': true,
                                    'complate-indicator': isComplated,
                                    'failed-indicator': isFailed,
                                })}
                            ></span> */}
                            {isActive && !isComplated && !isFailed ? (
                                <img
                                    className="mr-[4px]"
                                    style={{ width: '20px' }}
                                    src="https://s3plus.meituan.net/zspt-fe/zspt/time.png"
                                    alt=""
                                />
                            ) : (
                                ''
                            )}
                            {isComplated ? (
                                <img
                                    className="mr-[4px]"
                                    style={{ width: '20px' }}
                                    src="https://s3plus.meituan.net/zspt-fe/jarvis/success.png"
                                    alt=""
                                />
                            ) : (
                                ''
                            )}
                            第{index + 1}步 {step.stepName}
                        </div>
                        {/** TODO:暂时去掉，影响美观 */}
                        {/* <div className={'step-description'}>{''}</div> */}
                    </div>
                );
            })}
        </div>
    );
};
