import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type DeviceDocument = Device & mongoose.Document;

@Schema()
export class Device {
  @Prop({ required: true })
  serialNumber: string;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: User.name } })
  owner: User;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
