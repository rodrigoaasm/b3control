/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { AssetEntity } from '@entities/asset';
import { PositionEntity } from '@entities/position';
import { UserEntity } from '@entities/user';
import { IWalletDistributionOutput } from '@usecases/reports/wallet-distribution-report/wallet-distribution-report-interface';
import { WalletDistributionReportUseCase } from '@usecases/reports/wallet-distribution-report/wallet-distribution-report-usecase';

const currentDate = new Date();
const user = new UserEntity('userid', 'test_user', currentDate, currentDate);
const test11 = new AssetEntity(1, 'TEST11', '', '', 'general');
const test4 = new AssetEntity(2, 'TEST4', '', '', 'stock');
const test3 = new AssetEntity(3, 'TEST3', '', '', 'stock');

class WalletRepositoryMock implements IPositionRepository {
  getUserCurrentPosition(userId: string, assetId: number): Promise<PositionEntity> {
    throw new Error('Method not implemented.');
  }

  saveUserCurrentPosition(userCurrentPosition: PositionEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getAssetTimeseries(
    userId: string, codes: string[], begin: Date, end: Date,
  ): Promise<PositionEntity[]> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  getUserCurrentPositions(userId: string): Promise<Array<PositionEntity>> {
    return Promise.resolve([
      new PositionEntity(
        test11,
        user,
        100,
        11.5,
        currentDate,
        12,
      ),
      new PositionEntity(
        test4,
        user,
        100,
        12.0,
        currentDate,
        13,
      ),
      new PositionEntity(
        test3,
        user,
        100,
        13.0,
        currentDate,
        14,
      ),
    ] as Array<PositionEntity>);
  }
}

describe('Wallet Distribution Report UseCase ', () => {
  let walletDistributionUseCase: WalletDistributionReportUseCase;
  let walletRepository: IPositionRepository;

  beforeEach(() => {
    walletRepository = new WalletRepositoryMock();
    walletDistributionUseCase = new WalletDistributionReportUseCase(walletRepository);
  });

  afterEach(() => {
    walletRepository = null;
    walletDistributionUseCase = null;
  });

  it('Should return all current positions', async () => {
    const currentPositions = await walletDistributionUseCase.get({
      userId: '7a4c481a-909a-4fc9-bcda-fd8a9b76d768',
    });

    expect(currentPositions).toEqual({
      assets: [
        {
          _price: 11.5,
          _quantity: 100,
          _date: currentDate,
          _value: 1150,
          _asset: test11,
        },
        {
          _price: 12.0,
          _quantity: 100,
          _value: 1200,
          _date: currentDate,
          _asset: test4,
        },
        {
          _price: 13.0,
          _quantity: 100,
          _value: 1300,
          _date: currentDate,
          _asset: test3,
        },
      ],
      categories: [
        {
          _value: 1150,
          _date: currentDate,
          _category: 'general',
        },
        {
          _value: 2500,
          _date: currentDate,
          _category: 'stock',
        },
      ],
    } as IWalletDistributionOutput);
  });

  it('Should return any position when there is no position ', async () => {
    const mockGet = jest.fn();
    walletRepository.getUserCurrentPositions = mockGet;
    mockGet.mockResolvedValueOnce([]);

    const currentPositions = await walletDistributionUseCase.get({
      userId: '7a4c481a-909a-4fc9-bcda-fd8a9b76d768',
    });

    expect(currentPositions).toEqual({
      assets: [],
      categories: [],
    });
  });
});
