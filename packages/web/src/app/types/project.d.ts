namespace Project {
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
    build_proc: proc | null
    dev: string
    dev_proc: proc | null
    deploy: string
    sort: string
  }
  type category = {
    id: string
    name: string
    sort: string
    created_at: string
    updated_at: string
  }
}