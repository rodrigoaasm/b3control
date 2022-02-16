/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { IExpressHttpErrorAdapter } from '@application/ports/express-http-error-adapter-interface';
import { IApplicationRequest, IApplicationResponse } from '@application/types';
import CustomError from '@domain-error/custom-error';
import { ExpressRouterAdapter } from '@external/adapters/express-router-adapter';
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

describe('Express Router Adapter - routerAdapter()', () => {
  let expressHTTPErrorAdapterMock: ExpressHTTPErrorAdapterMock;
  let expressRouterAdapter: ExpressRouterAdapter;
  beforeEach(() => {
    expressHTTPErrorAdapterMock = new ExpressHTTPErrorAdapterMock();
    expressRouterAdapter = new ExpressRouterAdapter(expressHTTPErrorAdapterMock);
  });

  it('Should execute aplicationMethod', async () => {
    const aplicationMethod = jest.fn().mockReturnValue({
      code: 200,
      body: {},
    });
    const route = await expressRouterAdapter.routerAdapter(aplicationMethod);
    const response = await route({}, fakeExpressResponse);

    expect(aplicationMethod).toHaveBeenCalled();
    expect(response.code).toEqual(200);
  });

  it('Should return a custom error response, when applicationMethod throws a CustomError', async () => {
    const aplicationMethod = async (request: IApplicationRequest) => {
      throw new CustomError('FAKE_ERROR', request.body.test);
    };

    const route = await expressRouterAdapter.routerAdapter(aplicationMethod);
    const response = await route({}, fakeExpressResponse);

    expect(response).toEqual({
      code: 500,
      body: {
        status: 'FAKE_ERROR',
        message: 'test',
      },
    });
  });

  it('Should return an unknown error response, when applicationMethod throws a Native Error ', async () => {
    const aplicationMethod = async (request: IApplicationRequest) => {
      throw new Error(request.body.test);
    };

    const route = await expressRouterAdapter.routerAdapter(aplicationMethod);
    const response = await route({ }, fakeExpressResponse);

    expect(response).toEqual({
      code: 500,
      body: {
        status: 'FAKE_ERROR',
        message: 'test',
      },
    });
  });
});
