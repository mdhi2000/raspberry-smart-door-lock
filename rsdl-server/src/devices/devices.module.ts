import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesGateway } from './devices.gateway';
import { Device, DeviceSchema } from './schema/device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  providers: [DevicesGateway],
  exports: [MongooseModule],
})
export class DevicesModule {}
