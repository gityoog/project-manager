import ProjectManagerServer from "."
import path from "path"

const port = parseInt(process.argv[2])

ProjectManagerServer({
  port: isNaN(port) ? 3737 : port,
  db: path.resolve(process.cwd(), './config/app.db'),
  dev: true,
  web: path.resolve(__dirname, '../packages/web/dist')
})