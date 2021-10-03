import { connectionMock } from '@test-mocks/type-orm-mock';
import { ReportsRepository } from '@external/datasource/relational/repositories/reports-repository';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { AssetEntity } from '@entities/asset';
import { PositionEntity } from '@entities/position';

class PositionFactory implements IPositionFactory {
  // eslint-disable-next-line class-methods-use-this
  make(asset: AssetEntity, quantity: number, price: number, date: Date): PositionEntity {
    return new PositionEntity(asset, quantity, price, date);
  }
}

describe('Relational - Reports Repository', () => {
  let reportsRepository: ReportsRepository;
  beforeAll(async () => {
    reportsRepository = new ReportsRepository(connectionMock as any, new PositionFactory());
  });

  it('Should return a dataset, when there is data', async () => {
    const raws = [
      {
        asset_id: 1,
        asset_code: 'TEST11',
        asset_social: '',
        asset_logo: '',
        asset_category: 'stock',
        quantity: 20,
        price: 10,
        date: new Date(),
      },
      {
        asset_id: 2,
        asset_code: 'TEST4',
        asset_social: '',
        asset_logo: '',
        asset_category: 'stock',
        quantity: 20,
        price: 10,
        date: new Date(),
      },
    ];
    connectionMock.queryBuilder.setRawManyReturnValue(raws);

    const assetTimeseries = await reportsRepository.getAssetTimeseries([], new Date(), new Date());
    expect(assetTimeseries.length).toEqual(2);
  });

  it('Should return a empty dataset, when there is no data ', async () => {
    connectionMock.queryBuilder.setRawManyReturnValue([]);

    const assetTimeseries = await reportsRepository.getAssetTimeseries([], new Date(), new Date());
    expect(assetTimeseries.length).toEqual(0);
  });
});
