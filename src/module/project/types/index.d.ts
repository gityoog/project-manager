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
        deploy?: Record<string, any>
        autostart?: boolean
      }
    }
  }
}