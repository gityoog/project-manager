export default class ProjectDto {
  readonly id!: string
  readonly name!: string
  readonly type!: string
  readonly context!: string
  readonly build!: string
  readonly dev!: string
  readonly deploy!: string
  readonly build_proc?: {
    encoding?: string
    env?: Record<string, string>
  }
  readonly dev_proc?: {
    encoding?: string
    env?: Record<string, string>
  }
}