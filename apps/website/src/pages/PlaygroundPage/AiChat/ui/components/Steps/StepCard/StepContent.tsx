import React from 'react';
import './index.less';
import classNames from 'classnames';

export interface TabContentProps {
    stepId: number;
    activeTabId: number;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const StepCardContent: React.FC<TabContentProps> = React.memo(
    ({ stepId, activeTabId, children, className = '', style }) => {
        const isActive = stepId === activeTabId;

        return (
            <div
                className={classNames(className, 'px-2 tab-step-content  py-4', {
                    'active-step': isActive,
                })}
                style={style}
                id={`${stepId}-content`}
            >
                {children}
            </div>
        );
    }
);
