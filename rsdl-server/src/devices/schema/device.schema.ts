import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type DeviceDocument = Device & Document;

@Schema()
export class Device extends Document {
  @Prop({ required: true })
  serialNumber: string;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'users' } })
  owner: User;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
