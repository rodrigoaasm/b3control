/* eslint-disable arrow-body-style */
import { Request, Response } from 'express';
import { IApplicationRequest, IApplicationResponse } from '@application/types';
import { IExpressHttpErrorAdapter } from '@application/ports/express-http-error-adapter-interface';

export class ExpressRouterAdapter {
  constructor(private expressHTTPErrorAdapter: IExpressHttpErrorAdapter) {
  }

  public routerAdapter = async (routeFunc : Function) => {
    return async (expressRequest : Request, expressResponse : Response) => {
      const aplicationRequest: IApplicationRequest = {
        headers: expressRequest.headers,
        body: expressRequest.body,
        params: expressRequest.params,
      };

      let aplicationResponse : IApplicationResponse;
      try {
        aplicationResponse = await routeFunc(aplicationRequest);
      } catch (aplicationError) {
        return this.expressHTTPErrorAdapter.handleHTTPError(expressResponse, aplicationError);
      }

      return expressResponse.status(aplicationResponse.code).json(aplicationResponse.body);
    };
  };
}

export default ExpressRouterAdapter;
