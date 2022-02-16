import { IExpressHttpErrorAdapter } from '@application/ports/express-http-error-adapter-interface';
import CustomError from '@domain-error/custom-error';
import { Response } from 'express';

export class ExpressHTTPErrorAdapter implements IExpressHttpErrorAdapter {
  private HttpError: any;

  constructor() {
    this.HttpError = {
      ENTITY_CONSTRUCTION_ERROR: 400,
      BAD_REQUEST_ERROR: 400,
      UNAUTHORIZED_ERROR: 401,
      NOT_FOUND_ERROR: 404,
    };
  }

  public handleHTTPError(expressResponse: Response, aplicationError: CustomError) {
    return expressResponse
      .status(this.HttpError[aplicationError.status] ?? 500)
      .json({
        message: aplicationError.message,
        status: aplicationError instanceof CustomError ? aplicationError.status : 'UNKNOWN',
      });
  }
}

export default ExpressHTTPErrorAdapter;
