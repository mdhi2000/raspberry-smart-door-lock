import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createSHA512Hash } from 'src/Utils/hash';
import { CreateUserDto } from './Dtos/user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    const checkExist = this.userModel.find({ email: createUserDto.email });
    if (!(await checkExist).length) {
      createUserDto.password = createSHA512Hash(createUserDto.password);
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    }
    throw new HttpException('User already exists', HttpStatus.CONFLICT);
  }
}
