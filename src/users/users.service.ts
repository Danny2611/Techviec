import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import {genSaltSync,hash, compareSync} from "bcryptjs";
import { UsersModule } from './users.module';

import {  SoftDeleteModel } from 'soft-delete-plugin-mongoose';

// import bcrypt from "bcryptjs";
@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {}
  

  async create(createUserDto: CreateUserDto) {
     const salt = genSaltSync(10);
     const hashedPassword = await hash(createUserDto.password, salt);
      
    let user = await this.userModel.create({
        email : createUserDto.email,
        password: hashedPassword, 
        name: createUserDto.name, 
        address: createUserDto.address
    })
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return this.userModel.findOne({
      _id : id
    })
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({
      _id : updateUserDto._id
    }, 
    {... updateUserDto}
  )
  }

  remove(id: string) {
    if ( !mongoose.Types.ObjectId.isValid(id))
        return 'not found  user'
    return this.userModel.softDelete({
      _id: id 
    });
  }

    async findOneByUsername( username : string) {
    return await this.userModel.findOne({email : username});
  }

  async isValidPassword( password : string, hashPassword : string){
    return await compareSync(password, hashPassword);
  }

}
