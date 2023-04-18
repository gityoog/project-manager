import Status from "@/common/status"
import { iElDialog } from "."
import { Message } from "element-ui"

export default class IElDialog implements iElDialog {
  visible: boolean
  scroll: boolean
  maxHeight: string = 'unset'
  isCanSubmit: boolean
  footer: boolean
  status: Status = new Status
  width: string
  title: string
  closeOnClickModal: boolean
  top?: string = undefined
  appendToBody?: boolean = undefined
  center?: boolean = undefined
  beforeClose?: (done: () => void) => void
  onOpened?: () => void
  private isFirstOpen = true
  private firstOpenCallback?: () => void
  private onSubmit?: (status: Status) => void
  private onClose?: () => void
  constructor({
    top,
    width = '600px',
    center,
    visible = false,
    scroll = false,
    isCanSubmit = true,
    onOpened, onClose, onSubmit, onFirstOpen,
    footer = true,
    title = '数据编辑',
    closeOnClickModal = ENV.isDev,
    appendToBody
  }: {
    visible?: boolean
    scroll?: boolean
    maxHeight?: string
    isCanSubmit?: boolean
    footer?: boolean
    onClose?: () => void
    onSubmit?: (status: Status) => void
    onOpened?: () => void
    onFirstOpen?: () => void
    title?: string
    closeOnClickModal?: boolean
    width?: string
    top?: string
    center?: boolean
    appendToBody?: boolean
  } = {}) {
    this.firstOpenCallback = onFirstOpen

    this.title = title
    this.width = width
    this.closeOnClickModal = closeOnClickModal
    this.top = top
    this.center = center
    this.appendToBody = appendToBody

    this.visible = visible
    this.scroll = scroll
    this.isCanSubmit = isCanSubmit
    this.footer = footer
    this.onClose = onClose
    this.onOpened = onOpened

    this.beforeClose = done => {
      if (!this.status.loading) {
        done()
      } else {
        Message.warning('请稍后')
      }
    }
  }
  fireClose() {
    if (!this.visible) {
      this.onClose?.()
    }
  }
  open(onSubmit?: (status: Status) => void) {
    this.onSubmit = onSubmit
    if (this.isFirstOpen) {
      this.firstOpenCallback?.()
      this.isFirstOpen = false
    }
    this.visible = true
    this.status.normal()
  }
  close() {
    this.visible = false
  }
  loading = new Status
  submit() {
    if (this.loading.error) {
      return this.status.fail(this.loading.msg)
    }
    if (this.loading.loading) {
      return this.status.fail('请等待数据加载完成')
    }
    this.onSubmit?.(this.status)
  }
  setTitle(title: string) {
    this.title = title
  }
  destroy() {

  }
  enableSubmit() {
    this.isCanSubmit = true
  }
  disableSubmit() {
    this.isCanSubmit = false
  }
}