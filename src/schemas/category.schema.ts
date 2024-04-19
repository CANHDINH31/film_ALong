import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  poster: string;

  @Prop({ default: 1 })
  status: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
