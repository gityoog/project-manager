export default class ProjectDto {
  readonly id!: string
  readonly name!: string
  readonly type!: string
  readonly sort!: string
  readonly process?: {
    id: string
    name: string
    context: string
    command: string
    encoding?: string
    env?: Record<string, string>
    deploy?: Record<string, any>
  }[]
}