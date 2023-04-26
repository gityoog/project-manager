import Request from "@/common/request"

export default {
  detail: Request.main<{
    id: string
  }, {
    status: boolean
    pty: {
      stdout: string[]
      stats: {
        cpu: string
        memory: string
      } | null
    }
  } | null>({
    url: '/project/process/build/info'
  }),
  start: Request.main<{
    id: string
  }, boolean>({
    url: '/project/process/build/start'
  }),
  stop: Request.main<{
    id: string
  }, boolean | undefined>({
    url: '/project/process/build/stop'
  })
}