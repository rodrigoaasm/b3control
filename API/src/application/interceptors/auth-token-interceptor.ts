import { IApplicationRequest } from '@application/types';
import { UnauthorizedError } from '@domain-error/custom-error';
import { IJWTHandlerAdapter } from '@domain-ports/adapters/jwt-handler-adapter-interface';

export class AuthTokenInterceptor {
  constructor(
    private jwtHandler: IJWTHandlerAdapter,
  ) {
  }

  public verify = (request: IApplicationRequest, next: Function) => {
    if (!request?.headers?.authorization) {
      throw UnauthorizedError('The token was not informed!');
    }

    const [bearer, accessToken] = request.headers.authorization.split(' ');
    if (bearer !== 'Bearer') {
      throw UnauthorizedError('The authorization header format is invalid!');
    }

    try {
      request.headers.owner = this.jwtHandler.verifyAndDecodeToken(accessToken).id;
    } catch (verifyError) {
      throw UnauthorizedError(verifyError.message);
    }
    next();
  };
}

export default AuthTokenInterceptor;
