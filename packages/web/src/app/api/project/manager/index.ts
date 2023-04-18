import Request from "@/common/request"

type data = {
  id: string
  name: string
  type: string
  context: string
  build: string
  dev: string
  deploy: string
  sort: string
}

export default {
  query: Request.main<{
    type?: string | null
  }, data[]>({
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