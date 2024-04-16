import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  // 1:normal  2:vip
  @Prop({ default: 1 })
  type: number;

  //1:user 2:admin
  @Prop({ default: 1 })
  role: number;

  // 1:enable 0:disable
  @Prop({ default: 1 })
  enable: number;

  @Prop({ default: 0 })
  money: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
