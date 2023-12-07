import AppApi from "@/app/api"

export default class ProjectDeploy {
  private status
  private project
  private process
  enabled
  constructor({ process, project, status }: {
    project: string
    process: Project.process
    status: Project.Deploy.status
  }) {
    this.project = project
    this.process = process
    this.status = status
    this.enabled = !!process.deploy
  }

  update(status: Project.Deploy.status) {
    this.status = status
  }

  getStatus(output: string) {
    if (output === this.status?.actived) {
      return this.status
    } else {
      return null
    }
  }

  async start(output: string) {
    return AppApi.project.deploy.start({
      project: this.project,
      process: this.process.id,
      output
    })
  }

  async stop() {
    return AppApi.project.deploy.stop({
      project: this.project,
      process: this.process.id
    })
  }

  destroy() {
    this.process = null!
    this.status = null!
  }
}