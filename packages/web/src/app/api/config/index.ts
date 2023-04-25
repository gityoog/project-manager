import Request from "@/common/request"

export default {
  setting: Request.main<void, {
    shell: string
    pty: string
  }>({
    url: '/config/setting'
  }),
  save: Request.main<{
    shell: string
    pty: string
  }, {
    shell: string
    pty: string
  }>({
    url: '/config/save'
  }),
  ptys: Request.main<void, { name: string, value: string }[]>({
    url: '/config/ptys'
  })
}