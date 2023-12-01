namespace App {
  namespace Project {
    namespace Process {
      type Config = {
        id: string
        name: string
        context: string
        command: string
        encoding?: string
        env?: Record<string, string>
        deploy?: Deploy.Config
        autostart?: boolean
      }
      namespace Deploy {
        type Config = {
          type: string
          data: Json
        }
      }
    }
  }
}