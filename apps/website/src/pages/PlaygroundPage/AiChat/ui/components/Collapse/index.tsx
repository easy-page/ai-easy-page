import React from "react";
import "./index.less"; // 假设样式文件依旧为App.css，和之前的样式代码一致

// 定义CollapseComponentProps接口来描述props的类型
interface CollapseComponentProps {
  isExpanded: boolean; // 表示折叠组件当前是否展开，布尔类型
  setIsExpanded: (newValue: boolean) => void; // 用于更新展开状态的函数，接受一个布尔值作为参数
  title: React.ReactNode; // 面板标题，字符串类型
  children: React.ReactNode; // 面板内容文本，字符串类型
}

export const CollapseComponent: React.FC<CollapseComponentProps> = ({
  isExpanded,
  setIsExpanded,
  title,
  children,
}) => {
  return (
    <div className="collapse-container">
      <div
        className="collapse-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`icon ${isExpanded ? "icon-down" : "icon-up"}`}></div>
        <div className="header-text">{title}</div>
      </div>
      {isExpanded && children}
    </div>
  );
};
