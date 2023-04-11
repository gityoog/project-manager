import IElDialog from "@/components/el-dialog/service"
import Status from "@/common/status"
import { iConfirmDialog } from "."

export default class IConfirmDialog implements iConfirmDialog {
  dialog = new IElDialog({
    onClose: this.options.onClose,
    title: '询问',
    width: '400px'
  })
  message = ''
  content
  data = {
    content: ''
  }
  open({ title, message, callback }: {
    title?: string
    message: string
    callback: (data: {
      status: Status
      close: () => void
      content: string
    }) => void
  }) {
    if (title) {
      this.dialog.setTitle(title)
    }
    this.message = message
    this.dialog.open(() => {
      callback({
        status: this.dialog.status,
        close: () => this.dialog.close(),
        content: this.data.content
      })
    })
  }
  constructor(private options: {
    onClose: () => void
    content?: string
  }) {
    this.content = options.content
  }
  destroy() {
    this.dialog.destroy()
  }
}