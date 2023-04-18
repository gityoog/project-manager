import Request from "@/common/request"

export default {
  setting: Request.main<void, {
    shell: string
  }>({
    url: '/config/setting'
  }),
  saveShell: Request.main<{ shell: string }, void>({
    url: '/config/shell/save'
  })
}