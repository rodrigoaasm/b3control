import { IApplicationRequest, IApplicationResponse } from 'src/application/types';
import { ISignInUseCase } from '@usecases/auth/sign-in-interface';

export class SignInController {
  constructor(
    private signInUseCase : ISignInUseCase,
  ) {

  }

  public signIn = async (req : IApplicationRequest) : Promise<IApplicationResponse> => {
    const { username, password } = req.body;

    const result = await this.signInUseCase.signIn(username, password);

    return {
      body: result,
      code: 200,
    };
  };
}

export default SignInController;
