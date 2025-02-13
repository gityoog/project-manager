import ProjectManager from '.'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import path from 'path'
import ProjectManagerIpc from 'project-manager-ipc'

yargs(hideBin(process.argv))
  .scriptName("project-manager")
  .command({
    command: '*',
    describe: 'Start the project manager',
    builder: (yargs) => {
      return yargs.option('port', { type: 'number', default: 4000, describe: 'The port to listen on' })
        .option('db', { type: 'string', default: './config/app.db', describe: 'The path to the database file' })
        .option('pwd', { type: 'string', default: '', describe: 'The password to auth' })
    },
    handler(data) {
      ProjectManager({
        port: data.port,
        db: path.resolve(process.cwd(), data.db),
        web: require('../dist/web.zip'),
        password: data.pwd
      })
    }
  })
  .command({
    command: 'dist',
    describe: 'Nptice Dist Path to the project',
    builder: (yargs) => {
      return yargs.option('path', { type: 'string', default: '', describe: 'The path to the dist folder' })
        .option('version', { type: 'string', default: undefined, describe: 'The version of the project' })
        .option('name', { type: 'string', default: undefined, describe: 'The name of the project' })
    },
    handler(data) {
      const path = data.path
      const ipc = new ProjectManagerIpc()
      ipc.connect({
        success: () => {
          ipc.emitDist(path, { version: data.version, name: data.name })
          ipc.disconnect()
        },
        fail: err => {
          console.error(err)
          ipc.disconnect()
        }
      })
    }
  })
  .help()
  .strict()
  .parse()