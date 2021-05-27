import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { createSHA512Hash } from 'src/Utils/hash';
import { setRefreshToken, tradeToken } from 'src/Utils/jwt';
import { LoginDto } from './Dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async login(req: Request, res: Response): Promise<LoginDto> {
    const email = req.body.email;
    const password = req.body.password;
    const foundUser = await this.userModel.findOne({ email });
    if (foundUser && foundUser.password === createSHA512Hash(password)) {
      const { accessToken, refreshToken } = await tradeToken(foundUser);
      setRefreshToken(res, refreshToken);
      return { accessToken };
    }
    throw new HttpException('User Not Found', HttpStatus.UNAUTHORIZED);
  }
}
