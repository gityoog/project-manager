namespace Project {
  type process = {
    id: string
    name: string
    context: string
    command: string
    encoding?: string
    env?: Record<string, string>
    deploy?: Record<string, any>
  }
  type data = {
    id: string
    name: string
    type: string
    sort: string
    process: process[] | null
  }
  type category = {
    id: string
    name: string
    sort: string
    created_at: string
    updated_at: string
  }
  type output = {
    id: string
    name: string
    project: string
    process: string | null
    size: string
    created_at: string
  }
  type stats = {
    cpu: string
    memory: string
  } | null
}