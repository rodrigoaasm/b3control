/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IApplicationRequest } from '@application/types';
import { WalletDistributionReportController } from '@controllers/wallet-distribution-report-controller';
import { AssetEntity } from '@entities/asset';
import { IReportInput } from '@usecases/reports/report-interfaces';
import { IWalletDistributionOutput, IWalletDistributionUseCase } from '@usecases/reports/wallet-distribution-report/wallet-distribution-report-interface';

const output = {
  assets: [
    {
      _quantity: 100,
      _price: 25,
      _value: 2500,
      _date: new Date(),
      _asset: new AssetEntity(1, 'TEST4', 'teste', '', 'stock'),
    },
    {
      _quantity: 100,
      _price: 12,
      _value: 1200,
      _date: new Date(),
      _asset: new AssetEntity(1, 'TEST11', 'teste', '', 'FII'),
    },
  ],
  categories: [
    {
      _quantity: 100,
      _price: 25,
      _value: 2500,
      _date: new Date(),
      _category: 'stock',
    },
    {
      _quantity: 100,
      _price: 12,
      _value: 1200,
      _date: new Date(),
      _category: 'FII',
    },
  ],
} as IWalletDistributionOutput;

class MockWalletDistributionUseCase implements IWalletDistributionUseCase {
  async get(filters: IReportInput): Promise<IWalletDistributionOutput> {
    return output;
  }
}

describe('Wallet Distribution Report Controller', () => {
  let walletDistributionUseCase: IWalletDistributionUseCase;
  let walletDistributionController: WalletDistributionReportController;

  beforeEach(() => {
    walletDistributionUseCase = new MockWalletDistributionUseCase();
    walletDistributionController = new WalletDistributionReportController(
      walletDistributionUseCase,
    );
  });

  it('getWalletDistribution() - Should run successfully', async () => {
    const request = {
      headers: {
        owner: 1,
      },
      body: {},
      params: {},
    } as IApplicationRequest;

    const walletOutput = await walletDistributionController.getWalletDistribution(request);
    expect(walletOutput).toEqual({
      body: output,
      code: 200,
    });
  });
});
