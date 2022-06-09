export interface IEgreactProps {
  /**
   * @description       渲染器的根容器
   * @default           egret.lifecycle.stage
   */
  container?: egret.DisplayObjectContainer

  /**
   * @description       是否执行 egret.runEgret(options)
   * @default           若未指定 container 则为 true，否则为 false
   */
  runEgret?: boolean

  /**
   * @description       是否渲染带有 class 为 egret-palyer 的 div 容器
   * @default           若未指定 container 则为 true，否则为 false
   */
  renderDom?: boolean

  /**
   * @description       传入 egret.runEgret 的 options
   * @default           {}
   */
  options?: egret.runEgretOptions

  /**
   * @description       是否使用 ContextBridge，或提供 contexts 的来源
   * @default           true
   */
  contextsFrom?: boolean | React.Context<any>[] | HTMLElement

  /**
   * @description       egret 配置项，旋转模式
   */
  orientation?: string

  /**
   * @description       egret 配置项，适配模式
   */
  scaleMode?: string

  /**
   * @description       egret 配置项，帧频数
   */
  frameRate?: string

  /**
   * @description       egret 配置项，游戏内舞台的宽
   */
  contentWidth?: string

  /**
   * @description       egret 配置项，游戏内舞台的高
   */
  contentHeight?: string

  /**
   * @description       egret 配置项，多指最大数量
   */
  multiFingered?: string

  /**
   * @description       egret 配置项，是否显示 fps 帧频信息
   */
  showFps?: string
  /**
   * @description       egret 配置项，是否显示 egret.log 的输出信息
   */
  showLog?: string

  /**
   * @description       egret 配置项，fps面板的样式。支持5种属性，x:0, y:0, size:30, textColor:0xffffff, bgAlpha:0.9
   */
  showFpsStyle?: string

  /**
   * @description       div 的 jsx prop
   */
  div的属性?: JSX.IntrinsicElements['div']
}
export default (props: IEgreactProps) => null
