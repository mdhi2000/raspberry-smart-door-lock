import { NestFactory } from '@nestjs/core';
import { WsAdapter } from './adapters/web-socket.adapter';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();
  await app.listen(5000);
}
bootstrap();
