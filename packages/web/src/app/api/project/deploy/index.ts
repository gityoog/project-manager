import Request from "@/common/request"

export default {
  start: Request.main<{
    project: string
    process: string
    output: string
  }, boolean | null>({
    url: '/project/deploy/start'
  }),
  stop: Request.main<{
    project: string
    process: string
  }, boolean | null>({
    url: '/project/deploy/stop'
  })
}