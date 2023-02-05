/* eslint-disable no-param-reassign */
import { Request, Response } from 'express';
import { IApplicationRequest } from '@application/types';
import { IExpressHttpErrorAdapter } from '@application/ports/express-http-error-adapter-interface';

export class ExpressMiddlewareAdapter {
  constructor(private expressHttpErrorAdapter: IExpressHttpErrorAdapter) {
  }

  public middlewareAdapter(middlewareFunc: Function): Response {
    return async (expressRequest: Request, expressResponse: Response, next: Function) => {
      const aplicationRequest: IApplicationRequest = {
        headers: expressRequest.headers,
        body: expressRequest.body,
        params: expressRequest.params,
      };

      try {
        middlewareFunc(aplicationRequest);
        expressRequest.headers = aplicationRequest.headers;
        next();
      } catch (middlewareError) {
        return this.expressHttpErrorAdapter.handleHTTPError(expressResponse, middlewareError);
      }
      return expressResponse;
    };
  }
}

export default ExpressMiddlewareAdapter;
