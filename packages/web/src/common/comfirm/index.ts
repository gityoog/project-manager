import Status from "@/common/status"
import ConfirmDialog from "@/components/confirm-dialog"
import IConfirmDialog from "@/components/confirm-dialog/service"

export default function Confirm({
  title, message, callback, content
}: {
  title?: string
  message: string
  content?: string
  callback: (data: {
    status: Status
    close: () => void
    content: string
  }) => void
}) {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const service = new IConfirmDialog({
    content,
    onClose: () => {
      instance.$destroy()
      service.destroy()
      div.remove()
    }
  })
  const instance = new ConfirmDialog({
    propsData: {
      service
    }
  })
  instance.$mount(div)
  service.open({
    title,
    message,
    callback
  })
}