import Request from "@/common/request"

type data = {
  id: string
  name: string
  sort: string
}

type view = data & {
  created_at: string
  updated_at: string
}

export default {
  query: Request.main<void, {
    data: view[],
    other: boolean
  }>({
    url: "/project/category/query",
  }),
  save: Request.main<data, view>({
    url: "/project/category/save",
  }),
  remove: Request.main<{
    id: string
  }, boolean>({
    url: "/project/category/remove",
  })
}