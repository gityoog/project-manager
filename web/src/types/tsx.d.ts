namespace Tsx {
  type ClassComponentGeneric<T extends (props: any) => void> = new <T>() => { [key in keyof JSX.ElementAttributesProperty]: Parameters<T>[0] }
  type ClassComponent<Props> = new () => { [key in keyof JSX.ElementAttributesProperty]: Props }
  type FunctionalComponent<Props> = (props: Props) => JSX.Element
  type Component<Props = {}> = ClassComponent<Props> | FunctionalComponent<Props>
  type ScopedSlot<T, N extends string = 'default'> = { [key in N]: (...args: T) => JSX.Element | JSX.Element[] }
  type ScopedSlots<T extends Record<string, any>> = { [K in keyof T]?: (props: T[K]) => JSX.Element }
}