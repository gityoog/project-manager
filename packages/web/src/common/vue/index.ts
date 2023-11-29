import { FunctionalComponentOptions, Component } from 'vue'

export function FC<T extends object>(component: FunctionalComponentOptions<T> | NonNullable<FunctionalComponentOptions<T>['render']>) {
  if (typeof component === 'function') {
    component = { render: component, functional: true }
  }
  component.functional = true
  return component as unknown as Tsx.Component<T>
}

export function FCGeneric<T extends ((props: any) => JSX.Element)>(component: FunctionalComponentOptions<Parameters<T>[0]>) {
  return component as unknown as Tsx.Component<Parameters<T>[0]>
}

export function GenericComponent<T extends ((props: any) => JSX.Element)>(component: any) {
  return component as unknown as Tsx.Component<Parameters<T>[0]>
}

export function ToFC<T extends object>(component: Tsx.Component<T>, props: T) {
  return FC<{}>(h => h(component as unknown as Component, { props }))
}