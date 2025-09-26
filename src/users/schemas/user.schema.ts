
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
  @Prop( {required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop()
  name: string;

   @Prop()
   age: number;

   @Prop()
   address: string;
 
   @Prop()
   creatAt: Date;

   @Prop()
  updatedAt: Date;

  @Prop()
   isDeleted: boolean;

   @Prop()
  deleteAt: Date;


}

export const UserSchema = SchemaFactory.createForClass(User);
// Gắn plugin vào schema
UserSchema.plugin(softDeletePlugin);