/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { IExpressHttpErrorAdapter } from '@application/ports/express-http-error-adapter-interface';
import { IApplicationRequest } from '@application/types';
import CustomError from '@domain-error/custom-error';
import { ExpressMiddlewareAdapter } from '@external/adapters/express-middleware-adapter';
import { Response } from 'express';

class ExpressHTTPErrorAdapterMock implements IExpressHttpErrorAdapter {
  handleHTTPError(expressResponse: Response, aplicationError: CustomError) {
    return expressResponse
      .status(500)
      .json({
        message: 'test',
        status: 'FAKE_ERROR',
      });
  }
}

const fakeExpressResponse = {
  status(code: number) {
    return {
      json(body: any) {
        return {
          code,
          body,
        };
      },
    };
  },
};

describe('ExpressMiddlewareAdapter', () => {
  let expressHTTPErrorAdapterMock: ExpressHTTPErrorAdapterMock;
  let expressMiddlewareAdapter: ExpressMiddlewareAdapter;
  beforeEach(() => {
    expressHTTPErrorAdapterMock = new ExpressHTTPErrorAdapterMock();
    expressMiddlewareAdapter = new ExpressMiddlewareAdapter(expressHTTPErrorAdapterMock);
  });

  it('Should convert from express request to application request', () => {
    expect.assertions(2);
    const interceptor = (appRequest: IApplicationRequest, next: Function) => {
      expect(appRequest).toEqual({
        headers: {
          Authorization: 'token',
        },
        body: {
          id: 'request_id',
        },
        params: {},
      });
      expect(next).toBeDefined();
    };
    const expressMiddleware = expressMiddlewareAdapter.middlewareAdapter(interceptor);

    const request = {
      headers: {
        Authorization: 'token',
      },
      body: {
        id: 'request_id',
      },
      params: {},
    };
    const response = {};

    expressMiddleware(request, response, () => {});
  });

  it('Should run the next function', () => {
    const tNext = jest.fn();
    const interceptor = (appRequest: IApplicationRequest, next: Function) => {
      next();
    };
    const expressMiddleware = expressMiddlewareAdapter.middlewareAdapter(interceptor);

    expressMiddleware({}, {}, tNext);
    expect(tNext).toHaveBeenCalled();
  });

  it('Should return an http error response when interceptor throws an error', async () => {
    const tNext = jest.fn();
    const interceptor = () => {
      throw new CustomError('FAKE_ERROR', 'message');
    };
    const expressMiddleware = expressMiddlewareAdapter.middlewareAdapter(interceptor);

    const response = await expressMiddleware({}, fakeExpressResponse, tNext);

    expect(response.code).toEqual(500);
    expect(response.body.status).toEqual('FAKE_ERROR');
  });
});
