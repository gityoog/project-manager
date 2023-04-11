import IElDialog from "@/components/el-dialog/service"
import { Already, Concat, Service } from "ioc-di"
import { iAppSetting } from "."
import IProjectCategoryManager from "../category-manager/service"
import ILoggingManager from "../logging-manager/service"
import ISettingForm from "./form/service"

@Service()
export default class IAppSetting implements iAppSetting {
  dialog = new IElDialog({
    footer: false
  })
  category?: IProjectCategoryManager = null!
  logging?: ILoggingManager = null!
  form?: ISettingForm = null!

  constructor() {
    this.init()
  }

  @Already
  private init() {
    this.activeForm()
  }

  activeForm() {
    if (!this.form) {
      this.form = Concat(this, new ISettingForm(), ISettingForm)
    }
  }

  activeCategory() {
    if (!this.category) {
      this.category = Concat(this, new IProjectCategoryManager(), IProjectCategoryManager)
    }
  }

  activeLogging() {
    if (!this.logging) {
      this.logging = Concat(this, new ILoggingManager(), ILoggingManager)
    } else {
      this.logging.refresh()
    }
  }

  open() {
    this.dialog.open()
  }
}