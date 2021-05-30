import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevicesModule } from './devices/devices.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DevicesModule,
    MongooseModule.forRoot('mongodb://127.0.0.1/rsdl'),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development', '.env.development.local'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
