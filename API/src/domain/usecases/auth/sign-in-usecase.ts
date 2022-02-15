import { BadRequestError, UnauthorizedError } from '@domain-error/custom-error';
import { IJWTHandlerAdapter } from '@domain-ports/adapters/jwt-handler-adapter-interface';
import { IUserRepository } from '@domain-ports/repositories/user-repository-interface';
import { UserEntity } from '@entities/user';
import { ISignInOutput, ISignInUseCase } from './sign-in-interface';

export class SignInUsecase implements ISignInUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtHandler: IJWTHandlerAdapter,
  ) {
  }

  // eslint-disable-next-line class-methods-use-this
  async signIn(username: string, password: string): Promise<ISignInOutput> {
    if (!(username && password)) {
      throw BadRequestError('Username or/and password was not entered');
    }

    let user: UserEntity;
    try {
      user = await this.userRepository.signIn(username, password);
    } catch (userNotFoundError) {
      throw UnauthorizedError('Username and password don\'t match a user!');
    }

    const jwt = this.jwtHandler.generateToken({ id: user.id }, 1800000);

    return {
      _token: jwt,
      _authenticatedUser: {
        _id: user.id,
        _username: user.name,
      },
    };
  }
}

export default SignInUsecase;
