import { BadRequestError } from '@domain-error/custom-error';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { IReportInputHandler } from '@usecases/reports/report-input-handler-interface';
import { ITimeSeriesReportInput } from '@usecases/reports/timeseries-report-interfaces';

export class ReportInputHandler implements IReportInputHandler {
  constructor(private dateValidator: IDateValidatorAdapter) {
  }

  public handle(params: any): ITimeSeriesReportInput {
    if (!params.userId) {
      throw BadRequestError('The user was not informed.');
    }

    if (params.begin && !this.dateValidator.validate(params.begin)) {
      throw BadRequestError('The begin date is invalid.');
    }

    if (params.end && !this.dateValidator.validate(params.end)) {
      throw BadRequestError('The end date is invalid.');
    }

    const beginDate = params.begin ? new Date(params.begin) : undefined;
    const endDate = params.end ? new Date(params.end) : undefined;

    if (params.begin && params.end
      && !this.dateValidator.isTimeInterval(beginDate, endDate)) {
      throw BadRequestError('The begin date is greater than end date.');
    }

    return {
      userId: params.userId,
      codes: params.codes ? params.codes.split(',') : [],
      begin: beginDate,
      end: endDate,
    };
  }
}

export default ReportInputHandler;
