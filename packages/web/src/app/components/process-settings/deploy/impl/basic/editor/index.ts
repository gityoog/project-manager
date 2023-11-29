import LocaleService from "@/app/common/locale"
import { Inject, Service } from "ioc-di"

@Service()
export default abstract class OutputDeployBasicEditor {
  @Inject() locale!: LocaleService
  abstract setData(data: Json): void
  abstract getData(): Json
  abstract Render: Tsx.Component | null
}