import Request from "@/common/request"

type proc = {
  encoding?: string
  env?: Record<string, string>
}
type data = {
  id: string
  name: string
  type: string
  context: string
  build: string
  dev: string
  deploy: string
  sort: string
  build_proc: proc | null
  dev_proc: proc | null
}

type devInfo = {
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
} | null

export default {
  query: Request.main<{
    type?: string | null
  }, {
    data: data
    dev: devInfo | null
  }[]>({
    url: "/project/query",
  }),
  save: Request.main<data, data>({
    url: "/project/save",
  }),
  remove: Request.main<{
    ids: string[]
  }, boolean>({
    url: "/project/remove",
  })
}