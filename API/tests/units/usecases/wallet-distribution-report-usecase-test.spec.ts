/* eslint-disable @typescript-eslint/no-unused-vars */
import { IWalletRepository } from '@domain-ports/repositories/wallet-repository-interface';
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

class WalletRepositoryMock implements IWalletRepository {
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
  let walletRepository: IWalletRepository;

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
          price: 11.5,
          quantity: 100,
          date: currentDate,
          value: 1150,
          asset: test11,
        },
        {
          price: 12.0,
          quantity: 100,
          value: 1200,
          date: currentDate,
          asset: test4,
        },
        {
          price: 13.0,
          quantity: 100,
          value: 1300,
          date: currentDate,
          asset: test3,
        },
      ],
      categories: [
        {
          value: 1150,
          date: currentDate,
          category: 'general',
        },
        {
          value: 2500,
          date: currentDate,
          category: 'stock',
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
