import { IApplicationRequest, IApplicationResponse } from 'src/application/types';
import { IWalletDistributionUseCase } from '@usecases/reports/wallet-distribution-report/wallet-distribution-report-interface';

export class WalletDistributionReportController {
  constructor(
    private walletDistributionUseCase : IWalletDistributionUseCase,
  ) {

  }

  public getWalletDistribution =
  async (req : IApplicationRequest) : Promise<IApplicationResponse> => {
    const result = await this.walletDistributionUseCase.get({ userId: req.headers.owner });
    return {
      body: result,
      code: 200,
    };
  };
}

export default WalletDistributionReportController;
