import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { User, UserDocument } from './users/schema/user.schema';
import { verifyToken } from './Utils/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization
      .toString()
      .replace(/^Bearer /, '');
    return verifyToken(accessToken, 'accessToken').then((currentUser) => {
      if (currentUser) {
        request.body.currentUser = this.userModel.findOne({ _id: currentUser });
        return true;
      }
      return false;
    });
  }
}
