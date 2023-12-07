import Request from "@/common/request"

type process = {
  id: string
  name: string
  context: string
  command: string
  encoding?: string
  env?: Record<string, string>
  deploy?: Record<string, any>
  autostart?: boolean
}

type data = {
  id: string
  name: string
  type: string
  sort: string
  process: process[] | null
}

type processInfo = {
  pty: {
    status: boolean
    stdout: string[]
    stats: {
      cpu: string
      memory: string
    } | null
  }
  status: boolean
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
    process: processInfo | null
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
  }),
  detail: Request.main<{ id: string }, {
    process: process
    info: processInfo
    deploy: {
      type: 'running' | 'success' | 'failed'
      msg: string
      actived: string
    } | null
    main?: true
  }[]>({
    url: "/project/detail",
  })
}