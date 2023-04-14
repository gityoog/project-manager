import ProjectManagerServer from "."
import path from "path"

ProjectManagerServer({
  port: 4000,
  db: path.resolve(process.cwd(), './config/app.db')
})