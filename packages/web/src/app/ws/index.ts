import Websocket from "@/common/websocket"


const AppWs = {
  project: Websocket.main<{
    Add: [row: Project.data]
    Update: [row: Project.data, origin: Project.data]
    Remove: [row: Project.data]
  }, {}>({
    namesapce: '/project'
  }),
  category: Websocket.main<{
    Add: [row: Project.category]
    Update: [row: Project.category, origin: Project.category]
    Remove: [row: Project.category]
  }, {}>({
    namesapce: '/project/category'
  }),
  process: Websocket.main<{
    status: [data: {
      id: string
      value: boolean
    }]
    stdout: [data: {
      id: string
      value: string
    }]
    stats: [data: {
      id: string
      value: {
        cpu: string
        memory: string
      } | null
    }]
    url: [data: {
      id: string
      value: {
        host: string
        port: string
      } | null
    }]
    file: []
  }, {
    stdin: [string]
  }, `/${string}`>({
    namesapce: '/project/process'
  }),
  stats: Websocket.main<{
    stats: [data: {
      cpu: string
      memory: string
    }]
  }>({
    namesapce: '/stats'
  })
}
export default AppWs