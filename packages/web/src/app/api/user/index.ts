import Request from "@/common/request"

type data = {
  id: string
  name: string
}

export default {
  info: Request.main<void, data>({
    url: '/user/info'
  }),
  pwd: Request.main<{
    pwd: string
  }, data>({
    url: '/user/pwd'
  })
}