import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [DevicesModule, MongooseModule.forRoot('mongodb://127.0.0.1/rsdl')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
