import ProjectManager from '..'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import path from 'path'
import fs from 'fs'

yargs(hideBin(process.argv))
  .scriptName("project-manager")
  .option('port', { type: 'number', default: 4000, describe: 'The port to listen on' })
  .option('db', { type: 'string', default: './config/app.db', describe: 'The path to the database file' })
  .command({
    command: '*',
    handler(data) {
      const web = path.resolve(__dirname, '../web')
      ProjectManager({
        port: data.port,
        db: path.resolve(process.cwd(), data.db),
        web: fs.existsSync(web) ? web : undefined
      })
    }
  })
  .help()
  .strict()
  .parse()