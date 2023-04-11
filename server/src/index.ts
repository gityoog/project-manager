import { NestFactory } from "@nestjs/core"
import { ExpressAdapter, NestExpressApplication } from "@nestjs/platform-express"
import { IoAdapter } from '@nestjs/platform-socket.io'
import Options from "./options"
import AppModule from "./module"
import path from "path"

async function bootstrap() {
  const config = Options.default({
    port: 4000,
    db: path.resolve(process.cwd(), './config/app.db')
  })
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter)
  app.useWebSocketAdapter(new IoAdapter(app))
  return await app.listen(config.port)
}
bootstrap()