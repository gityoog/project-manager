import { Concat, Inject, Root, Service } from 'ioc-di'
import WebProjectOptions from "./options"
import WebProjectBuilder from "./builder"
import WebProjectDeveloper from "./developer"

@Root()
@Service()
export default class WebProject {
  @Inject() private developer!: WebProjectDeveloper
  @Inject() private builder!: WebProjectBuilder

  constructor(...options: ConstructorParameters<typeof WebProjectOptions>) {
    Concat(this, new WebProjectOptions(...options), WebProjectOptions, false)
  }

  dev() {
    return this.developer.run()
  }

  build() {
    return this.builder.run()
  }
}