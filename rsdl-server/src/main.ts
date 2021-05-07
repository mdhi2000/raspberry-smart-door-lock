import { NestFactory } from '@nestjs/core';
import { WsAdapter } from './adapters/web-socket.adapter';
// import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(8000);
}
bootstrap();
