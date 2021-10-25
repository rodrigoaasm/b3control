import { IApplicationRequest, IApplicationResponse } from '@application/types';
import CustomError from '@domain-error/custom-error';
import { ExpressRouterAdapter } from '@external/adapters/express-router-adapter';

describe('Express Router Adapter - ParseHTTPError()', () => {
  it('Should return a code other than 500, when throws a mapped custom error', async () => {
    const code = ExpressRouterAdapter.parseHTTPError('BAD_REQUEST_ERROR');

    expect(code).toEqual(400);
  });

  it('Should return a code other than 500, when throws a unmapped custom error', async () => {
    const code = ExpressRouterAdapter.parseHTTPError('FAKE_ERROR');

    expect(code).toEqual(500);
  });
});

describe('Express Router Adapter - routerAdapter()', () => {
  const fakeExpressrequest = {
    body: {
      test: 'test',
    },
  };
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

  it('Should return a sucessful response, when aplicationMethod executes successfully', async () => {
    ExpressRouterAdapter.parseHTTPError = jest.fn(() => 500);
    const aplicationMethod = async (request: IApplicationRequest) => ({
      code: 200,
      body: request.body,
    } as IApplicationResponse);

    const route = await ExpressRouterAdapter.routerAdapter(aplicationMethod);
    const response = await route(fakeExpressrequest, fakeExpressResponse);

    expect(response).toEqual({
      code: 200,
      body: {
        test: 'test',
      },
    });
  });

  it('Should return a custom error response, when applicationMethod throws a CustomError', async () => {
    ExpressRouterAdapter.parseHTTPError = jest.fn(() => 500);
    const aplicationMethod = async (request: IApplicationRequest) => {
      throw new CustomError('FAKE_ERROR', request.body.test);
    };

    const route = await ExpressRouterAdapter.routerAdapter(aplicationMethod);
    const response = await route(fakeExpressrequest, fakeExpressResponse);

    expect(response).toEqual({
      code: 500,
      body: {
        status: 'FAKE_ERROR',
        message: 'test',
      },
    });
  });

  it('Should return an unknown error response, when applicationMethod throws a Native Error ', async () => {
    ExpressRouterAdapter.parseHTTPError = jest.fn(() => 500);
    const aplicationMethod = async (request: IApplicationRequest) => {
      throw new Error(request.body.test);
    };

    const route = await ExpressRouterAdapter.routerAdapter(aplicationMethod);
    const response = await route(fakeExpressrequest, fakeExpressResponse);

    expect(response).toEqual({
      code: 500,
      body: {
        status: 'UNKNOWN',
        message: 'test',
      },
    });
  });
});
