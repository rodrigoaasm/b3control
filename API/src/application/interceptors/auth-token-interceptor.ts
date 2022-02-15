import { IApplicationRequest } from '@application/types';
import { UnauthorizedError } from '@domain-error/custom-error';
import { IJWTHandlerAdapter } from '@domain-ports/adapters/jwt-handler-adapter-interface';

export class AuthTokenInterceptor {
  constructor(
    private jwtHandler: IJWTHandlerAdapter,
  ) {
  }

  verify(request: IApplicationRequest, next: Function) {
    if (!request?.header?.authorization) {
      throw UnauthorizedError('The token was not informed!');
    }

    request.owner = this.jwtHandler.verifyAndDecodeToken(request.header.authorization);
    next();
  }
}

export default AuthTokenInterceptor;
