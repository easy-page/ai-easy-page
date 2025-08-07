// 定义环境类型的枚举
export enum EnvironmentType {
  Electron = "Electron",
  VSCodeExtension = "VSCodeExtension",
  Web = "Web",
}

// 检测当前环境的函数
export function detectEnvironment(): EnvironmentType {
  // 检测是否为 Electron 环境
  if (
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.electron
  ) {
    return EnvironmentType.Electron;
  }

  // 检测是否为 VSCode 插件环境
  if (typeof (window as any).acquireVsCodeApi === "function") {
    return EnvironmentType.VSCodeExtension;
  }

  // 若都不是，则判定为 Web 环境
  return EnvironmentType.Web;
}
