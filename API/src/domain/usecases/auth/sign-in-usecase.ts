import { BadRequestError, UnauthorizedError } from '@domain-error/custom-error';
import { ICryptHandlerAdapter } from '@domain-ports/adapters/crypt-handler-adapter-interface';
import { IJWTHandlerAdapter } from '@domain-ports/adapters/jwt-handler-adapter-interface';
import { IUserRepository } from '@domain-ports/repositories/user-repository-interface';
import { ISignInOutput, ISignInUseCase } from './sign-in-interface';

export class SignInUsecase implements ISignInUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtHandler: IJWTHandlerAdapter,
    private cryptAdapter: ICryptHandlerAdapter,
  ) {
  }

  // eslint-disable-next-line class-methods-use-this
  async signIn(username: string, password: string): Promise<ISignInOutput> {
    if (!username || username?.length < 5 || !password || password.length < 8) {
      throw BadRequestError('The username (min: 5 ch.) or/and password (min: 8 ch.) is invalid.');
    }

    const signInResult = await this.userRepository.signIn(username);

    if (signInResult === null
      || (!(await this.cryptAdapter.compare(password, signInResult.password)))) {
      throw UnauthorizedError('Username and password don\'t match a user!');
    }

    const { user } = signInResult;
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
