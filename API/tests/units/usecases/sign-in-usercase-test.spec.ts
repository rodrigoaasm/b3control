/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IJWTHandlerAdapter } from '@domain-ports/adapters/jwt-handler-adapter-interface';
import { IUserRepository } from '@domain-ports/repositories/user-repository-interface';
import { UserEntity } from '@entities/user';
import { SignInUsecase } from '@usecases/auth/sign-in-usecase';

const date = new Date();
const defaultUser = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);

class UserRepositoryMock implements IUserRepository {
  async signIn(username: string, password: string): Promise<UserEntity> {
    if (!(username === 'user' && password === 'hash')) {
      throw new Error('Error');
    }

    return defaultUser;
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

describe('SignInUsecase', () => {
  let signInUsecase: SignInUsecase;
  let jwtHandlerUtil: JWTHandlerUtil;

  beforeEach(() => {
    jwtHandlerUtil = new JWTHandlerUtil();
    signInUsecase = new SignInUsecase(new UserRepositoryMock(), jwtHandlerUtil);
  });

  it('Should throw an error when the password was not entered', async () => {
    expect.assertions(1);

    try {
      await signInUsecase.signIn('user', undefined);
    } catch (signInError) {
      expect(signInError.message).toEqual('Username or/and password was not entered');
    }
  });

  it('Should throw an error when the username was not entered', async () => {
    expect.assertions(1);

    try {
      await signInUsecase.signIn(undefined, 'password');
    } catch (signInError) {
      expect(signInError.message).toEqual('Username or/and password was not entered');
    }
  });

  it('Should generate a JWT token with user id when username and password match a user ', async () => {
    const signInOutput = await signInUsecase.signIn('user', 'hash');

    expect(signInOutput).toEqual({
      // eslint-disable-next-line no-useless-escape
      _token: '{\"id\":\"jbfjbkglkbnlknglkb\"}-1800000',
      _authenticatedUser: {
        _id: 'jbfjbkglkbnlknglkb',
        _username: 'user',
      },
    });
  });

  it('Should throw an error when username or password do not match', async () => {
    expect.assertions(1);

    try {
      await signInUsecase.signIn('username', 'password');
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
      await signInUsecase.signIn('user', 'hash');
    } catch (signInError) {
      expect(signInError.message).toEqual('JWT encoding error!');
    }
  });
});
