import Request from "@/common/request"

type data = {
  id: string
  name: string
  version: string
  create_at: string
  process: string | null
}

export default {
  query: Request.main<{
    project: string
    process?: string
  }, data[]>({
    url: "/project/output/query",
  }),
  remove: Request.main<{ id: string }, void>({
    url: "/project/output/remove",
  }),
  download: Request.main.url((data: { id: string }) => `/project/output/download?id=${data.id}`),
  clear: Request.main({
    url: "/project/output/clear",
  })
}