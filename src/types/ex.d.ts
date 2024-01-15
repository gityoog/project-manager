import { } from 'express'

declare module 'typeorm/driver/Driver' {
  interface Driver {
    databaseConnection: any
  }
}

declare module 'express-session' {
  interface SessionData {
    name: string
    pwdAuth: boolean
  }
}