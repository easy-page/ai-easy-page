import { Tooltip } from '@douyinfe/semi-ui';
import { TooltipProps } from '@radix-ui/react-tooltip';

export const DotText = ({
    children,
    line,
    className,
    position,
    style,
    disableTooltip,
}: {
    children: any;
    line: number;
    style?: React.CSSProperties;
    className?: string;
    disableTooltip?: boolean;
    position?:
        | 'left'
        | 'top'
        | 'right'
        | 'bottom'
        | 'topLeft'
        | 'topRight'
        | 'leftTop'
        | 'leftBottom'
        | 'rightTop'
        | 'rightBottom'
        | 'bottomLeft'
        | 'bottomRight'
        | 'leftTopOver'
        | 'rightTopOver'
        | 'leftBottomOver'
        | 'rightBottomOver';
}) => {
    if (disableTooltip) {
        return (
            <div
                className={className}
                style={
                    line === 1
                        ? {
                              textOverflow: 'ellipsis',
                              display: 'block',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              ...style,
                          }
                        : {
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: line,
                              ...style,
                          }
                }
            >
                {children}
            </div>
        );
    }
    return (
        <Tooltip
            content={<div className="max-h-[200px] overflow-auto">{children}</div>}
            position={position}
        >
            <div
                className={className}
                style={
                    line === 1
                        ? {
                              textOverflow: 'ellipsis',
                              display: 'block',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              ...style,
                          }
                        : {
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: line,
                              ...style,
                          }
                }
            >
                {children}
            </div>
        </Tooltip>
    );
};
