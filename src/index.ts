import { HttpAdapterHost, NestFactory } from "@nestjs/core"
import { ExpressAdapter, NestExpressApplication } from "@nestjs/platform-express"
import Options from "./options"
import AppModule from "./module"
import WsIoAdapter from "./module/websocket/adapter"

export default async function ProjectManagerServer(...args: ConstructorParameters<typeof Options>) {
  const config = Options.default(...args)
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter, {
    logger: config.isDev ? undefined : ['error', 'warn', 'log']
  })
  const io = app.get(WsIoAdapter)
  io.setHttpServer(app.getHttpServer())
  app.useWebSocketAdapter(io)
  app.set('trust proxy', true)
  return await app.listen(config.port)
}