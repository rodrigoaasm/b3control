/* eslint-disable class-methods-use-this */
import { AuthTokenInterceptor } from '@application/interceptors/auth-token-interceptor';
import { IApplicationRequest } from '@application/types';
import { IJWTHandlerAdapter } from '@domain-ports/adapters/jwt-handler-adapter-interface';

class JWTHandlerUtil implements IJWTHandlerAdapter {
  generateToken(bodyObject: any, expiresIn: number): string {
    return `${JSON.stringify(bodyObject)}-${expiresIn}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verifyAndDecodeToken(token: string) {
    return {};
  }
}

describe('AuthTokenInterceptor', () => {
  let authTokenInterceptor: AuthTokenInterceptor;
  let jwtHandlerUtil: IJWTHandlerAdapter;

  beforeEach(() => {
    jwtHandlerUtil = new JWTHandlerUtil();
    authTokenInterceptor = new AuthTokenInterceptor(jwtHandlerUtil);
  });

  it('Should verify token and return the jwt data when the token is valid', () => {
    const request: IApplicationRequest = {
      body: {},
      headers: { authorization: 'Bearer token' },
      params: {},
    };

    authTokenInterceptor.verify(request, () => {
      expect(request.owner).toBeDefined();
    });
  });

  it('Should throw an error when verification fails', () => {
    expect.assertions(1);
    const request: IApplicationRequest = {
      body: {},
      headers: { authorization: 'Bearer token' },
      params: {},
    };

    jwtHandlerUtil.verifyAndDecodeToken = () => {
      throw new Error('Token verification fails');
    };

    try {
      authTokenInterceptor.verify(request, () => {
        expect(request.owner).toBeDefined();
      });
    } catch (verificationError) {
      expect(verificationError.message).toEqual('Token verification fails');
    }
  });

  it('Should throw an error when the token was not informed', () => {
    expect.assertions(1);
    const request: IApplicationRequest = {
      body: {},
      headers: { authorization: 'Bearer token' },
      params: {},
    };

    try {
      authTokenInterceptor.verify(request, () => {
        expect(request.owner).toBeDefined();
      });
    } catch (verificationError) {
      expect(verificationError.message).toEqual('The token was not informed!');
    }
  });
});
