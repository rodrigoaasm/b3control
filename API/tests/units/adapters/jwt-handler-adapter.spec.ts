import { JWTHandlerAdapter } from '@external/adapters/jwt-handler-adapter';

describe('JWTHandlerAdapter', () => {
  let jwtHandlerAdapter: JWTHandlerAdapter;
  beforeEach(() => {
    jwtHandlerAdapter = new JWTHandlerAdapter('secret');
  });

  it('Should generate the access token', () => {
    const accessToken = jwtHandlerAdapter.generateToken({
      id: 'id',
    });

    expect(accessToken).toBeDefined();
  });

  it('Should throw a error when access token generation fails', () => {
    expect.assertions(1);
    try {
      jwtHandlerAdapter.generateToken(undefined);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('Should generate the access token and decode', () => {
    const accessToken = jwtHandlerAdapter.generateToken({
      id: 'id',
    });

    const jwtBody = jwtHandlerAdapter.verifyAndDecodeToken(accessToken);
    expect(jwtBody.id).toEqual('id');
  });

  it('Should throw a error when access token decodification fails', () => {
    expect.assertions(1);
    try {
      jwtHandlerAdapter.verifyAndDecodeToken('accessToken');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
