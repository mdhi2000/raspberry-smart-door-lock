import { NestFactory } from '@nestjs/core';
import { WsAdapter } from './adapters/web-socket.adapter';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.use(cookieParser());
  app.enableCors({ credentials: true });
  await app.listen(5000);
}
bootstrap();
