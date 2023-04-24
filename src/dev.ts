import ProjectManagerServer from "."
import path from "path"

ProjectManagerServer({
  port: 3737,
  db: path.resolve(process.cwd(), './config/app.db'),
  dev: true,
  web: path.resolve(__dirname, '../dist/web')
})