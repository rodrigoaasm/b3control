/* eslint-disable arrow-body-style */
import { Request, Response } from 'express';
import { IApplicationRequest, IApplicationResponse } from '@application/types';
import CustomError from '@domain-error/custom-error';

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
      const aplicationRequest: IApplicationRequest = {
        header: expressRequest.header,
        body: expressRequest.body,
        params: expressRequest.params,
      };

      let aplicationResponse : IApplicationResponse;
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
