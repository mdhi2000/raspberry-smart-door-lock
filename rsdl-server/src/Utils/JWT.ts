import { HttpException, HttpStatus } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/schema/user.schema';

type TokenType =
  | 'accessToken'
  | 'refreshToken'
  | 'emailToken'
  | 'resetPassToken';

const common = {
  accessToken: {
    privateKey: process.env.ACCESS_TOKEN_SECRET,
    signOptions: {
      expiresIn: '30d', // 15m
    },
  },
  refreshToken: {
    privateKey: process.env.REFRESH_TOKEN_SECRET,
    signOptions: {
      expiresIn: '7d', // 7d
    },
  },
  resetPassToken: {
    privateKey: process.env.RESETPASS_TOKEN_SECRET,
    signOptions: {
      expiresIn: '1d', // 1d
    },
  },
};

/**
 * Returns token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param user - 1st input
 * @param type - 2nd input
 *
 * @returns The access token mean of `user`
 *
 * @beta
 */
export const generateToken = async (
  user: UserDocument,
  type: TokenType,
): Promise<string> => {
  return await sign(
    {
      _id: user._id,
    },
    common[type].privateKey,
    {
      issuer: ISSUER,
      subject: user.local
        ? user.local.email
        : user.google
        ? user.google.email
        : user.facebook.email,
      audience: AUDIENCE,
      algorithm: 'HS256',
      expiresIn: common[type].signOptions.expiresIn, // 15m
    },
  );
};

/**
 * Returns user by verify token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param token - 1st input
 * @param type - 2nd input
 *
 * @returns The user mean of `token`
 *
 * @beta
 */
export const verifyToken = async (
  token: string,
  type: TokenType,
): Promise<UserDocument> => {
  let userModel: Model<UserDocument>;
  let currentUser;

  await verify(token, common[type].privateKey, async (err, data) => {
    if (err) {
      throw new HttpException(
        'Authentication token is invalid, please try again.',
        HttpStatus.FORBIDDEN,
      );
    }

    // console.log(data)

    currentUser = await userModel.findOne({
      _id: data._id,
    });
  });

  // if (type === 'emailToken') {
  //   return currentUser;
  // }

  // console.log(currentUser)

  // if (currentUser && !currentUser.isVerified) {
  //   throw new ForbiddenError('Please verify your email.');
  // }

  return currentUser;
};

/**
 * Returns login response by trade token.
 *
 * @remarks
 * This method is part of the {@link auth/jwt}.
 *
 * @param user - 1st input
 *
 * @returns The login response mean of `user`
 *
 * @beta
 */
export const tradeToken = async (user: UserDocument): Promise<any> => {
  // if (!user.isVerified) {
  //   throw new ForbiddenError('Please verify your email.');
  // }

  // if (!user.isActive) {
  //   throw new ForbiddenError("User already doesn't exist.");
  // }

  // if (user.isLocked) {
  //   throw new ForbiddenError('Your email has been locked.');
  // }

  const accessToken = await generateToken(user, 'accessToken');
  const refreshToken = await generateToken(user, 'refreshToken');

  return { accessToken, refreshToken };
};
