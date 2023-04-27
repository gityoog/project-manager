import { NestFactory } from "@nestjs/core"
import { ExpressAdapter, NestExpressApplication } from "@nestjs/platform-express"
import { IoAdapter } from '@nestjs/platform-socket.io'
import Options from "./options"
import AppModule from "./module"

export default async function ProjectManagerServer(...args: ConstructorParameters<typeof Options>) {
  const config = Options.default(...args)
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter)
  app.useWebSocketAdapter(new IoAdapter(app))
  app.set('trust proxy', true)
  return await app.listen(config.port)
}