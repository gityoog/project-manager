import ProjectManager from '.'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import path from 'path'

yargs(hideBin(process.argv))
  .scriptName("project-manager")
  .option('port', { type: 'number', default: 4000, describe: 'The port to listen on' })
  .option('db', { type: 'string', default: './config/app.db', describe: 'The path to the database file' })
  .option('pwd', { type: 'string', default: '', describe: 'The password to auth' })
  .command({
    command: '*',
    handler(data) {
      ProjectManager({
        port: data.port,
        db: path.resolve(process.cwd(), data.db),
        web: require('../dist/web.zip'),
        password: data.pwd
      })
    }
  })
  .help()
  .strict()
  .parse()