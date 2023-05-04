declare module 'better-sqlite3-session-store' {
  import session, { Store } from "express-session"
  type session = typeof session
  interface SqliteStore extends Store {
    new(options: {
      client: any
      expired: {
        clear: boolean
        intervalMs: number //ms 
      }
    }): SqliteStore
  }
  export default function store(session: session): SqliteStore
}

declare module 'node-pty' {
  interface IPty {
    destroy(): void
  }
}

declare module '@achrinza/node-ipc' {
  import * as RootIPC from 'node-ipc'
  export = RootIPC
}

declare module 'process-tree' {
  type Tree<T> = T & {
    children: Tree<T>[]
  }
  export default function (pid: number, callback: (err: Error | null, children: Tree<{
    pid: number
    ppid: number
    name: number
  }>[]) => void): void
}

declare module 'lodash.debounce' {
  export default function debounce(fn: Function, delay: number): Function
}