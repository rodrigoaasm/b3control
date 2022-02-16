import CustomError from '@domain-error/custom-error';
import { Response } from 'express';

export interface IExpressHttpErrorAdapter {
  handleHTTPError(expressResponse: Response, aplicationError: CustomError): Response;
}
