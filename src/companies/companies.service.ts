import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument, CompanySchema } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) 
  {}

  create(createCompanyDto: CreateCompanyDto, user : IUser) {
    return  this.companyModel.create ({
       ...createCompanyDto,
       createdBy : {
          _id : user._id,
          email : user.email
       }
    });
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user : IUser) {
    return this.companyModel.updateOne(
      { _id : id},
      {...updateCompanyDto,
        updatedBy: {
          id : user._id,
          user : user.email
        }
      }

    )
    ;
  }

  async remove(id: string, user : IUser) {  
    if ( !mongoose.Types.ObjectId.isValid(id))
            return 'not found  company'
    await this.companyModel.softDelete({
      _id : id
    })
    this.companyModel.updateOne({
      deletedBy :{
        id : user._id,
        user: user.email
      }
    })
    return;
  }
}
