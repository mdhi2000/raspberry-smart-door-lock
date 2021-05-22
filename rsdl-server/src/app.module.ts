import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevicesModule } from './devices/devices.module';
import { GlobalServicesModule } from './global-services/global-services.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DevicesModule,
    MongooseModule.forRoot('mongodb://127.0.0.1/rsdl'),
    UsersModule,
    GlobalServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
