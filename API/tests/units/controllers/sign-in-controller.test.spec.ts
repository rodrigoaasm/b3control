/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ISignInUseCase, ISignInOutput } from '@usecases/auth/sign-in-interface';
import { SignInController } from 'src/application/controllers/sign-in-controller';
import CustomError from '@domain-error/custom-error';
import { ICryptHandlerAdapter } from '@domain-ports/adapters/crypt-handler-adapter-interface';

class SignInUseCaseMock implements ISignInUseCase {
  // eslint-disable-next-line class-methods-use-this
  async signIn(username: string, password: string): Promise<ISignInOutput> {
    return {
      _authenticatedUser: {
        _id: 'uuid',
        _username: username,
      },
      _token: 'access_token',
    };
  }
}

describe('Operation Controller', () => {
  let signInController: SignInController;
  let signInUseCaseMock: SignInUseCaseMock;

  beforeEach(() => {
    signInUseCaseMock = new SignInUseCaseMock();
    signInController = new SignInController(signInUseCaseMock);
  });

  it('Should execute the submission successfully', async () => {
    const date = new Date();

    const response = await signInController.signIn({
      headers: [],
      params: [],
      body: {
        username: 'test-user',
        password: 'password123',
      },
    });

    expect(response.code).toEqual(200);
    expect(response.body).toEqual({
      _authenticatedUser: {
        _id: 'uuid',
        _username: 'test-user',
      },
      _token: 'access_token',
    });
  });

  it('Should throw an unauthorized error response when there are problems with credentials ', async () => {
    expect.assertions(2);
    signInUseCaseMock.signIn = jest.fn(() => { throw new CustomError('FAKE_ERROR', 'message'); });

    try {
      await signInController.signIn({
        headers: [],
        params: [],
        body: {
          username: 'test-user',
          password: 'password123',
        },
      });
    } catch (error) {
      expect(error.message).toEqual('message');
      expect(error.status).toEqual('FAKE_ERROR');
    }
  });
});
