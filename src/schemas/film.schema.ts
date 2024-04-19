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
}

export const FilmSchema = SchemaFactory.createForClass(Film);
