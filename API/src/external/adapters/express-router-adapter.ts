/* eslint-disable arrow-body-style */
import CustomError from '@domain-error/custom-error';
import { Request, Response } from 'express';
import { IAplicationResponse } from 'src/application/types/aplication-response';

const HTTPError = {
  CONSTRUCTOR_ENTITY_ERROR: 400,
  NOT_FOUND_ERROR: 404,
  BAD_REQUEST_ERROR: 400,
};

export class ExpressRouterAdapter {
  public static parseHTTPError(status: string) {
    return (HTTPError[status] ? HTTPError[status] : 500);
  }

  public static routerAdapter = async (routeFunc : Function) => {
    return async (expressRequest : Request, expressResponse : Response) => {
      const aplicationRequest = {
        header: expressRequest.header,
        body: expressRequest.body,
      };

      let aplicationResponse : IAplicationResponse;
      try {
        aplicationResponse = await routeFunc(aplicationRequest);
      } catch (error) {
        return expressResponse.status(ExpressRouterAdapter.parseHTTPError(error.status)).json({
          message: error.message,
          status: error instanceof CustomError ? error.status : 'UNKNOWN',
        });
      }

      return expressResponse.status(aplicationResponse.code).json(aplicationResponse.body);
    };
  };
}

export default ExpressRouterAdapter;
