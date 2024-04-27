import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdvertismentDocument = HydratedDocument<Advertisment>;

@Schema({ timestamps: true })
export class Advertisment {
  @Prop()
  video1: string;

  @Prop()
  video2: string;

  @Prop()
  video3: string;

  @Prop()
  video4: string;
}

export const AdvertismentSchema = SchemaFactory.createForClass(Advertisment);
