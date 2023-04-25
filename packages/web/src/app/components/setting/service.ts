import LocaleService from "@/app/common/locale"
import IElDialog from "@/components/el-dialog/service"
import { Already, Concat, Inject, Service } from "ioc-di"
import { iAppSetting } from "."
import IProjectCategoryManager from "../category-manager/service"
import ILoggingManager from "../logging-manager/service"
import ISettingForm from "./form/service"

@Service()
export default class IAppSetting implements iAppSetting {
  @Inject() locale!: LocaleService
  dialog = new IElDialog({
    footer: false,
    onFirstOpen: () => {
      this.init()
    }
  })
  category?: IProjectCategoryManager = null!
  logging?: ILoggingManager = null!
  form?: ISettingForm = null!

  @Already
  private init() {
    this.activeForm()
  }

  activeForm() {
    if (!this.form) {
      this.form = Concat(this, new ISettingForm(), ISettingForm)
    } else {
      this.form.refresh()
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