import Request from "@/common/request"

type data = {
  id: string
  action: string
  target: string
  ip: string
  user: string
  description: string
  time: string
}

export default {
  query: Request.main.page<{}, data>({
    url: "/logging/query",
  }),
  remove: Request.main<{
    id: string
  }, boolean>({
    url: "/logging/remove",
  }),
  clear: Request.main({
    url: "/logging/clear",
  })
}