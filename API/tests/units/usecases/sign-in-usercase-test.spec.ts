/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import CustomError from '@domain-error/custom-error';
import { ICryptHandlerAdapter } from '@domain-ports/adapters/crypt-handler-adapter-interface';
import { IJWTHandlerAdapter } from '@domain-ports/adapters/jwt-handler-adapter-interface';
import { IUserRepository, ISignInResult } from '@domain-ports/repositories/user-repository-interface';
import { UserEntity } from '@entities/user';
import { SignInUsecase } from '@usecases/auth/sign-in-usecase';

const date = new Date();
const defaultUser = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);

class UserRepositoryMock implements IUserRepository {
  async signIn(username: string): Promise<ISignInResult> {
    if (!(username === 'user123')) {
      return null;
    }

    return {
      user: defaultUser,
      password: 'hash',
    };
  }

  async findUser(userId: string): Promise<UserEntity> {
    return undefined;
  }
}

class JWTHandlerUtil implements IJWTHandlerAdapter {
  generateToken(bodyObject: any, expiresIn: number): string {
    return `${JSON.stringify(bodyObject)}-${expiresIn}`;
  }

  verifyAndDecodeToken(token: string) {
    return {};
  }
}

class CryptAdapterMock implements ICryptHandlerAdapter {
  compare(data: string, hash: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  // eslint-disable-next-line class-methods-use-this
  generateHash(payload: string, round: number = 10): Promise<string> {
    return Promise.resolve(payload + round);
  }
}

describe('SignInUsecase', () => {
  let signInUsecase: SignInUsecase;
  let jwtHandlerUtil: JWTHandlerUtil;
  let cryptAdapter: CryptAdapterMock;

  beforeEach(() => {
    jwtHandlerUtil = new JWTHandlerUtil();
    cryptAdapter = new CryptAdapterMock();
    signInUsecase = new SignInUsecase(new UserRepositoryMock(), jwtHandlerUtil, cryptAdapter);
  });

  it('Should throw an error when the password was not entered', async () => {
    expect.assertions(1);

    try {
      await signInUsecase.signIn('user', undefined);
    } catch (signInError) {
      expect(signInError.message).toEqual('The username (min: 5 ch.) or/and password (min: 8 ch.) is invalid.');
    }
  });

  it('Should throw an error when the password is less than 8 characters', async () => {
    expect.assertions(1);

    try {
      await signInUsecase.signIn('user', '123456');
    } catch (signInError) {
      expect(signInError.message).toEqual('The username (min: 5 ch.) or/and password (min: 8 ch.) is invalid.');
    }
  });

  it('Should throw an error when the username was not entered', async () => {
    expect.assertions(1);

    try {
      await signInUsecase.signIn(undefined, 'password');
    } catch (signInError) {
      expect(signInError.message).toEqual('The username (min: 5 ch.) or/and password (min: 8 ch.) is invalid.');
    }
  });

  it('Should throw an error when the username is less than 5 characters', async () => {
    expect.assertions(1);

    try {
      await signInUsecase.signIn('1234', 'password');
    } catch (signInError) {
      expect(signInError.message).toEqual('The username (min: 5 ch.) or/and password (min: 8 ch.) is invalid.');
    }
  });

  it('Should generate a JWT token with user id when username and password match a user ', async () => {
    const signInOutput = await signInUsecase.signIn('user123', 'password');

    expect(signInOutput).toEqual({
      // eslint-disable-next-line no-useless-escape
      _token: '{\"id\":\"jbfjbkglkbnlknglkb\"}-1800000',
      _authenticatedUser: {
        _id: 'jbfjbkglkbnlknglkb',
        _username: 'user',
      },
    });
  });

  it('Should throw an error when username do not match', async () => {
    expect.assertions(1);

    try {
      await signInUsecase.signIn('username', 'password');
    } catch (signInError) {
      expect(signInError.message).toEqual('Username and password don\'t match a user!');
    }
  });

  it('Should throw an error when password do not match', async () => {
    cryptAdapter.compare = jest.fn().mockResolvedValue(false);
    expect.assertions(1);

    try {
      await signInUsecase.signIn('user123', 'password');
    } catch (signInError) {
      expect(signInError.message).toEqual('Username and password don\'t match a user!');
    }
  });

  it('Should throw an error when jwt encoding fails', async () => {
    expect.assertions(1);
    jwtHandlerUtil.generateToken = () => {
      throw new Error('JWT encoding error!');
    };

    try {
      await signInUsecase.signIn('user123', 'password');
    } catch (signInError) {
      expect(signInError.message).toEqual('JWT encoding error!');
    }
  });
});
