import { Tooltip } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import React from 'react';
export type IconButtonProps = {
    icon?: React.ReactNode;
    disableBorder?: boolean;
    disableHover?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
    tooltip?: React.ReactNode;
    disabled?: boolean;
    disabledTips?: string;
};

export const IconButton = ({
    className,
    disableBorder,
    disableHover,
    icon,
    onClick,
    disabledTips,
    tooltip,
    disabled,
}: IconButtonProps) => {
    const btn = (
        <div
            className={classNames(className, 'rounded-[10px] cursor-pointer', {
                'p-2 border border-border': !disableBorder,
                'p-2': disableBorder,
                'hover:bg-background-hover': !disableHover,
                'opacity-50': disabled,
            })}
            onClick={(e) => {
                if (disabled) {
                    return;
                }
                onClick?.(e);
            }}
        >
            {icon}
        </div>
    );
    if (!disabled) {
        return btn;
    }
    return <Tooltip content={disabled ? disabledTips || '暂不支持' : tooltip}>{btn}</Tooltip>;
};
