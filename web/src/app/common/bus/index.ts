import AppWs from "app/ws"
import { Destroy, Service } from "ioc-di"

@Service()
export default class AppBus {
  private project = AppWs.project()
  private category = AppWs.category()

  onProjectUpdate(callabck: (row: Project.data) => void) {
    return this.project.on('Update', callabck)
  }

  onProjectRemove(callabck: (data: Project.data) => void) {
    return this.project.on('Remove', row => {
      callabck(row)
    })
  }

  onCategoryChange(callabck: () => void) {
    return this.category.onAny(() => {
      callabck()
    })
  }

  onCategoryRemove(callabck: (data: Project.category) => void) {
    return this.category.on('Remove', row => {
      callabck(row)
    })
  }

  onListUpdate({ type, remove, add }: {
    type: string | null
    remove: (row: Project.data) => void
    add: (row: Project.data) => void
  }) {
    const off = [
      this.project.on('Remove', row => {
        if (type === row.type) {
          remove(row)
        }
      }),
      this.project.on('Add', row => {
        if (type === row.type) {
          add(row)
        }
      }),
      this.project.on('Update', (row, origin) => {
        if (row.type !== origin.type) {
          if (row.type === type) {
            add(row)
          }
          if (origin.type === type) {
            remove(row)
          }
        }
      })
    ]
    return () => {
      off.forEach(fn => fn())
      off.splice(0, off.length)
    }
  }

  @Destroy
  destroy() {
    this.category.destroy()
  }
}