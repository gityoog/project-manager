#!/usr/bin/env node
import ProjectManagerServer from '..'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import path from 'path'
import fs from 'fs'

yargs(hideBin(process.argv))
  .option('port', { type: 'number', default: 4000, describe: 'The port to listen on' })
  .option('db', { type: 'string', default: './config/app.db', describe: 'The path to the database file' })
  .version()
  .help()
  .command('start', 'Start the server', yargs => yargs, (data) => {
    const web = path.resolve(__dirname, '../web')
    ProjectManagerServer({
      port: data.port,
      db: path.resolve(process.cwd(), data.db),
      web: fs.existsSync(web) ? web : undefined
    })
  })
  .usage('Usage: $0 <command> [options]')
  .strict(true)
  .parse()
