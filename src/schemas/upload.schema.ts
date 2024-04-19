import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UploadDocument = HydratedDocument<Upload>;

@Schema({ timestamps: true })
export class Upload {
  @Prop()
  title: string;

  @Prop()
  type: number;
  // 1:video 2:other
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
