import React from 'react';
import './index.less';

export interface TianlingTabsProps {
    activeTab: number;
    onTabChange: (tabId: number) => void;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const StepCardContainer: React.FC<TianlingTabsProps> = ({
    activeTab,
    onTabChange,
    children,
    className = '',
    style,
}) => {
    // 处理子元素，为它们注入activeTab和onClick属性
    const tabsWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                isActive: child.props.id === activeTab,
                onClick: onTabChange,
            } as any);
        }
        return child;
    });

    return (
        <div className={`tabsContainer ${className}`.trim()} style={style}>
            <div className="flex" id="steps-content">
                {tabsWithProps}
            </div>
        </div>
    );
};
