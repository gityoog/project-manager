# ipc for project-manager

send message to project-manager

### Install

```bash
npm install project-manager-ipc --save-dev
```

### Usage

```ts
import ProjectManagerIpc from "project-manager-ipc";

const ipc = new ProjectManagerIpc({
  idKey: string // optional default: 'PROJECT_MANAGER_IPC_CHILD'
  serverKey: string // optional default: 'PROJECT_MANAGER_IPC_SERVER'
  log: (msg: string) {} // optional
})
ipc.connect({
  success: () => {

  },
  fail: (err: string) => {

  }
})
ipc.setLogger((msg: string) => {
  console.log(msg)
})
ipc.emitDist('/path/to/dist')
ipc.emitDist('/path/to/dist', { version: string, name: string })
ipc.emitUrl('0.0.0.0', 9000)
ipc.emitError('error message')
ipc.disconnect()
ipc.destroy()
```

### Changelog

2024-01-16 v1.0.6 add dist version and name
