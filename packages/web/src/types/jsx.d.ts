namespace JSX {
  interface VueComponentAttributes {
    on?: Record<string, Function | Function[]>
    attrs?: Record<string, any>
    vModel?: string | number | boolean
  }
  interface IntrinsicClassAttributes<T> extends VueComponentAttributes {
    onClick?: (event: MouseEvent) => void
    onInput?: (value: any) => void
  }
}