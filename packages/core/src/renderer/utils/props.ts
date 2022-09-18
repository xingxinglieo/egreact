import { injectMemoizedProps } from '../../devtool'
import { DevThrow, is, isEvent, reduceKeysToTarget, splitEventKeyToInfo } from '../../utils'
import { DiffSet, ExtensionObj, IElementProps, Instance, PropSetter } from '../../type'
import { CONSTANTS, isBrowserDev } from '../../constants'
import { EventProp } from '../../Host/common'
import { attachInfo } from './attach'

export const isDiffSet = (def: any): def is DiffSet => def && !!(def as DiffSet).memoized && !!(def as DiffSet).changes

/**
 * @description diff 属性
 */
export function diffProps(
  instance: Instance,
  { children: cN, attach: aN, mountedApplyProps: mN, args: argsN, ...props }: IElementProps = {},
  { children: cP, attach: aP, mountedApplyProps: mP, args: argsP, ...previous }: IElementProps = {},
): DiffSet {
  if (!instance[CONSTANTS.INFO_KEY]) attachInfo(instance)
  const info = instance[CONSTANTS.INFO_KEY]
  const entries = Object.entries(props)
  const changes: DiffSet['changes'] = []
  const previousKeys = Object.keys(previous)
  for (let i = 0; i < previousKeys.length; i++) {
    if (!props.hasOwnProperty(previousKeys[i]) && !previousKeys[i].startsWith('__'))
      entries.push([previousKeys[i], CONSTANTS.DEFAULT_REMOVE])
  }
  // 从少key到多key，保证添加的顺序，否则会出错
  entries.sort((a, b) => a[0].split('-').length - b[0].split('-').length)
  entries.forEach(([key, value]) => {
    /**
     * 因为属性和其前缀属性(如果存在)之间是联动的，所以需要按照属性的顺序进行操作
     * entries.sort 排序已经保证其 key 顺序是从少 key 到多 key
     * 比如 layout 和 layout-gap 属性
     * 1 如果  layout-gap 的前缀 layout 属性改变
     * 无论如何, layout-gap 属性都需要做出操作
     *  1.1 layout-gap 是 Remove，则插入在 layout 之前，
     *  因为 layout 也可能是 remove，这样就保证了 layout-gap 移除在 layout 移除之前
     *  1.2 layout 变更存在，则插入在 layout 之后，
     *  因为 layout 更新后可能是新的实例, 需要重新应用所有后缀属性
     * 2 否则走正常的操作
     */
    const keys = key.split('-')
    const isRemove = value === CONSTANTS.DEFAULT_REMOVE
    const prefixKey = keys.slice(0, keys.length - 1).join('-')
    const prefixPropIndex = prefixKey === '' ? -1 : changes.findIndex(([prefixPropKey]) => prefixPropKey === prefixKey)
    if (prefixPropIndex !== -1 && (isRemove || changes[prefixPropIndex][1] !== CONSTANTS.DEFAULT_REMOVE)) {
      return changes.splice(prefixPropIndex + Number(!isRemove), 0, [
        key,
        isRemove ? CONSTANTS.DEFAULT_REMOVE : value,
        false,
        keys,
      ])
    }

    // 属性对比
    const propDiff = info.propsHandlers[`${CONSTANTS.CUSTOM_DIFF_PREFIX}${key}`] ?? is.equ
    return propDiff(value, previous[key]) || changes.push([key, value, isEvent(key), keys])
  })

  const memoized: { [key: string]: any } = { ...props }

  return { memoized, changes }
}

/**
 * @description 将属性和事件改变应用到实例 This function applies a set of changes to the instance
 */
export function applyProps(instance: Instance, data: IElementProps | DiffSet) {
  const info = instance[CONSTANTS.INFO_KEY]
  const oldMemoizedProps = info.memoizedProps
  const { memoized, changes } = isDiffSet(data) ? data : diffProps(instance, data, {})

  // Prepare memoized props
  if (info) info.memoizedProps = memoized
  changes.forEach(([key, newValue, isEvent, keys]) => {
    if (key.startsWith('__')) return

    const oldValue = oldMemoizedProps.hasOwnProperty(key) ? oldMemoizedProps[key] : CONSTANTS.PROP_MOUNT
    const isRemove = newValue === CONSTANTS.DEFAULT_REMOVE
    const isMount = !info.memoizedResetter.hasOwnProperty(key)

    if (isEvent) {
      const eInfo = splitEventKeyToInfo(key)
      let setter = info.propsHandlers[eInfo.name] as PropSetter<any>
      if (!is.fun(setter)) {
        if (isMount && !key.startsWith('on-'))
          console.warn(`\`${key}\` maybe not a valid event, it will be handle by default way`)
        setter = EventProp.eventSetter as unknown as PropSetter<any>
      }

      // 无论如何都会先清除副作用

      info.memoizedResetter[key]?.(isRemove)
      info.memoizedResetter[key] = () => void 0

      if (isRemove) {
        delete info.memoizedResetter[key]
      } else {
        const resetter = setter({
          newValue,
          oldValue,
          instance,
          target: instance,
          targetKey: key,
          keys,
          eInfo,
        })
        if (!is.fun(resetter)) {
          return console.warn(
            `Egreact(applyProps):Return type of set of EventHandler ${key} must be a function,meaning remove event`,
          )
        }
        info.memoizedResetter[key] = resetter
      }
    } else {
      const [target, targetKey, prefixKeys] = reduceKeysToTarget(instance, keys.join('-'))

      if (target === null) {
        const prefixKey = prefixKeys.join('-')
        return DevThrow(`\`${targetKey}\` depends on \`${prefixKey}\`, you must set \`${prefixKey}\` before`, {
          from: 'applyProps',
        })
      }

      // 存储一下初始值
      if (isMount) {
        info.memoizedDefault[key] = target[targetKey]
        if (!is.fun(info.propsHandlers[key]))
          console.warn(`Egreact(applyProps):\`${key}\` may not be a valid prop in ${instance.constructor.name}`)
      }

      const defaultPropsHandler =
        ({ newValue, target, targetKey }: { newValue: any; target: ExtensionObj; targetKey: string }) =>
        () => ((target[targetKey] = newValue), void 0)
      const setter = (info.propsHandlers[key] ?? defaultPropsHandler) as PropSetter<any>

      const lastResetter = info.memoizedResetter[key]

      info.memoizedResetter[key] =
        setter({
          newValue,
          oldValue,
          instance,
          target,
          targetKey,
          keys,
        }) || ((isRemove) => isRemove && (target[targetKey] = info.memoizedDefault[key]))

      // 移除情况 清除副作用
      if (isRemove) {
        // target[targetKey]?.dispose?.()
        is.fun(lastResetter) && lastResetter(true)
        delete info.memoizedResetter[key]
        delete info.memoizedDefault[key]
      } else is.fun(lastResetter) && lastResetter(false)
    }
  })

  if (isBrowserDev) {
    injectMemoizedProps(instance, info)
  }
  return instance
}
