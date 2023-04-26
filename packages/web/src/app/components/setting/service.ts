import LocaleService from "@/app/common/locale"
import IElDialog from "@/components/el-dialog/service"
import { Already, Concat, Inject, Service } from "ioc-di"
import { iAppSetting } from "."
import ProjectCategoryManager from "../category-manager"
import IProjectCategoryManager from "../category-manager/service"
import LoggingManager from "../logging-manager"
import ILoggingManager from "../logging-manager/service"
import LocalSetting from "./local"
import ILocalSetting from "./local/service"
import ServerSetting from "./server"
import IServerSetting from "./server/service"

@Service()
export default class IAppSetting implements iAppSetting {
  @Inject() locale!: LocaleService
  private get $t() {
    return this.locale.t.setting
  }
  dialog = new IElDialog({
    footer: false,
    onFirstOpen: () => {
      this.init()
    }
  })
  category?: IProjectCategoryManager = null!
  logging?: ILoggingManager = null!
  server?: IServerSetting = null!
  local?: ILocalSetting = null!

  data = [{
    self: this,
    active: () => {
      if (this.local) {
        this.local.refresh()
      } else {
        this.local = Concat(this, new ILocalSetting(), ILocalSetting)
      }
    },
    get label() {
      return this.self.$t.local.title
    },
    get service() {
      return this.self.local
    },
    view: LocalSetting
  }, {
    self: this,
    active: () => {
      if (this.server) {
        this.server.refresh()
      } else {
        this.server = Concat(this, new IServerSetting(), IServerSetting)
      }
    },
    get label() {
      return this.self.$t.server.title
    },
    get service() {
      return this.self.server
    },
    view: ServerSetting
  }, {
    self: this,
    active: () => {
      if (this.category) {

      } else {
        this.category = Concat(this, new IProjectCategoryManager(), IProjectCategoryManager)
      }
    },
    get label() {
      return this.self.$t.category.title
    },
    get service() {
      return this.self.category
    },
    view: ProjectCategoryManager
  }, {
    self: this,
    active: () => {
      if (this.logging) {
        this.logging.refresh()
      } else {
        this.logging = Concat(this, new ILoggingManager(), ILoggingManager)
      }
    },
    get label() {
      return this.self.$t.logging.title
    },
    get service() {
      return this.self.logging
    },
    view: LoggingManager
  }]

  active(index: number) {
    this.data[index].active()
  }

  @Already
  private init() {
    this.data[0].active()
  }

  open() {
    this.dialog.open()
  }
}