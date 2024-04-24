import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FilmDocument = HydratedDocument<Film>;

@Schema({ timestamps: true })
export class Film {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  poster: string;

  @Prop()
  url: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Category' })
  category: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop()
  type: number;
  // 1: admin upload - 2:user upload

  @Prop()
  status: number;
  // 0:delete 1:active  2:pending 3:reject
}

export const FilmSchema = SchemaFactory.createForClass(Film);
