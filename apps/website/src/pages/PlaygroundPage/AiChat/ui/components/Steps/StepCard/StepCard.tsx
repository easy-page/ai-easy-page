import React from 'react';
import './index.less';
import classNames from 'classnames';
export interface StepCardProps {
    title: string;
    description: string;
    id: number;
    isActive?: boolean;
    disabled?: boolean;
    onClick?: (id: number) => void;
    className?: string;
    style?: React.CSSProperties;
    isFailed: boolean;
    isComplated: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({
    title,
    description,
    id,
    isFailed = false,
    isComplated = false,
    isActive = false,
    disabled = false,
    onClick,
    className = '',
    style,
}) => {
    // 处理点击事件
    const handleClick = () => {
        if (!disabled && onClick) {
            onClick(id);
        }
    };

    return (
        <div
            className={classNames(className, 'mr-2 step-card', {
                active: isActive && !isComplated && !isFailed,
                disabled: disabled,
                complated: isActive && isComplated,
                failed: isActive && isFailed,
            })}
            style={style}
            onClick={handleClick}
            title={disabled ? '此功能暂不可用' : ''}
            data-tab={id}
        >
            <div className={'step-title'}>
                <span
                    className={classNames({
                        'active-indicator': true,
                        'complate-indicator': isComplated,
                        'failed-indicator': isFailed,
                    })}
                ></span>
                {title}
            </div>
            {/** TODO:暂时去掉，影响美观 */}
            <div className={'step-description'}>{''}</div>
        </div>
    );
};
