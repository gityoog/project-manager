import Request from "@/common/request"

export default {
  detail: Request.main<{
    id: string
  }, {
    pty: {
      status: boolean
      stdout: string[]
      stats: {
        cpu: string
        memory: string
      } | null
    }
    url: {
      host: string
      port: string
    } | null
  } | null>({
    url: '/project/process/dev/info'
  }),
  start: Request.main<{
    id: string
  }, boolean>({
    url: '/project/process/dev/start'
  }),
  stop: Request.main<{
    id: string
  }>({
    url: '/project/process/dev/stop'
  })
}