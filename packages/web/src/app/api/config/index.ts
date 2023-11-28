import Request from "@/common/request"

export default {
  setting: Request.main<void, {
    shell: string
    pty: string
    keepProcess: boolean
  }>({
    url: '/config/setting'
  }),
  save: Request.main<{
    shell: string
    pty: string
    keepProcess: boolean
  }, {
    shell: string
    pty: string
    keepProcess: boolean
  }>({
    url: '/config/save'
  }),
  ptys: Request.main<void, { name: string, value: string }[]>({
    url: '/config/ptys'
  })
}