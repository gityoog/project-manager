import Request from "@/common/request"

export default {
  start: Request.main<{
    project: string
    id?: string
  }, number | null>({
    url: '/project/process/start'
  }),
  stop: Request.main<{
    project: string
    id?: string
  }, boolean>({
    url: '/project/process/stop'
  })
}