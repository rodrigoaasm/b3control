import { IApplicationRequest, IApplicationResponse } from '@application/types';
import { IAssetTimeSeriesReportUseCase } from '@usecases/reports/asset-timeseries-report/asset-timeseries-report-interface';
import { IReportInput } from '@usecases/reports/report-interfaces';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { BadRequestError } from '@domain-error/custom-error';

export class ReportsController {
  constructor(
    private assetTimeSeriesReportUseCase : IAssetTimeSeriesReportUseCase,
    private dateValidatorUtil: IDateValidatorAdapter,
  ) {

  }

  public getStockTimeLine = async (req : IApplicationRequest) : Promise<IApplicationResponse> => {
    if (req.params.begin && !this.dateValidatorUtil.validate(req.params.begin)) {
      throw BadRequestError('The begin date is invalid.');
    }

    if (req.params.end && !this.dateValidatorUtil.validate(req.params.end)) {
      throw BadRequestError('The end date is invalid.');
    }

    const filters : IReportInput = {
      codes: req.params.codes ? req.params.codes.split(',') : [],
      begin: req.params.begin ? new Date(req.params.begin) : undefined,
      end: req.params.end ? new Date(req.params.end) : undefined,
    };

    const result = await this.assetTimeSeriesReportUseCase.get(filters);

    return {
      code: 200,
      body: result,
    };
  };
}

export default ReportsController;
