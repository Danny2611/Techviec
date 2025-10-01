import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument, CompanySchema } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

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

  async findAll(currentPage : number,  limit : number,  qs: string ) {
    const { filter, sort, population } = aqp(qs);

    delete filter.currentPage;
    delete filter.limit;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    
    const result = await this.companyModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .populate(population)
    .exec();
    
    return {
      message : 'lấy thành công',
      meta: { 
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
      }
     
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
