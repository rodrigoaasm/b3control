import CustomError, { BadRequestError } from '@domain-error/custom-error';
import { ExpressHTTPErrorAdapter } from '@external/adapters/express-http-error-adapter';

describe('ExpressHTTPErrorAdapter', () => {
  let expressHTTPErrorAdapter: ExpressHTTPErrorAdapter;
  beforeEach(() => {
    expressHTTPErrorAdapter = new ExpressHTTPErrorAdapter();
  });

  it('Should return a response with code other than 500, when throws a mapped custom error', async () => {
    expect.assertions(2);

    const response = {
      status: (code: number) => {
        expect(code).toEqual(400);
        return response;
      },
      json: jest.fn(),
    };
    expressHTTPErrorAdapter.handleHTTPError(response, BadRequestError('Error'));
    expect(response.json).toHaveBeenCalled();
  });

  it('Should return a response with code 500, when throws a unmapped custom error', async () => {
    expect.assertions(2);

    const response = {
      status: (code: number) => {
        expect(code).toEqual(500);
        return response;
      },
      json: jest.fn(),
    };
    expressHTTPErrorAdapter.handleHTTPError(response, new CustomError('STATUS', 'Unmapped Error'));
    expect(response.json).toHaveBeenCalled();
  });
});
