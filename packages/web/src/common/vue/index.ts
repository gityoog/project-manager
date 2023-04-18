import { FunctionalComponentOptions } from 'vue'

export function FC<T extends object>(component: FunctionalComponentOptions<T>) {
  return component as unknown as Tsx.Component<T>
}

export function FCGeneric<T extends ((props: any) => JSX.Element)>(component: FunctionalComponentOptions<Parameters<T>[0]>) {
  return component as unknown as Tsx.Component<Parameters<T>[0]>
}

export function GenericComponent<T extends ((props: any) => JSX.Element)>(component: any) {
  return component as unknown as Tsx.Component<Parameters<T>[0]>
}