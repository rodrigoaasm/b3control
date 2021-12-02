import { IApplicationRequest, IApplicationResponse } from '@application/types';
import { IAssetTimeSeriesReportUseCase } from '@usecases/reports/asset-timeseries-report/asset-timeseries-report-interface';
import { IReportInputHandler } from '@usecases/reports/report-input-handler-interface';

export class ReportsController {
  constructor(
    private assetTimeSeriesReportUseCase : IAssetTimeSeriesReportUseCase,
    private reportInputHandler: IReportInputHandler,
  ) {

  }

  public getStockTimeLine = async (req : IApplicationRequest) : Promise<IApplicationResponse> => {
    const filters = this.reportInputHandler.handle(req.params);
    const result = await this.assetTimeSeriesReportUseCase.get(filters);
    return {
      code: 200,
      body: result,
    };
  };
}

export default ReportsController;
