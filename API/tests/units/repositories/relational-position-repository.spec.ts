import { PositionRepository, IPositionQueryRaw } from '@external/datasource/relational/repositories/position-repository';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { AssetEntity } from '@entities/asset';
import { PositionEntity } from '@entities/position';

import createConnectionMock from '@test-mocks/type-orm-mock';
import { UserEntity } from '@entities/user';

const connectionMock = createConnectionMock({});

class PositionFactory implements IPositionFactory {
  // eslint-disable-next-line class-methods-use-this
  make(
    asset: AssetEntity, user: UserEntity, quantity: number, price: number, date: Date, id?: number,
  ): PositionEntity {
    return new PositionEntity(asset, user, quantity, price, date, id);
  }
}

describe('Relational - Position Repository', () => {
  let reportsRepository: PositionRepository;
  let user: UserEntity;
  let positionRaw: IPositionQueryRaw;
  const beginDate = new Date('2021-01-01T13:00:00.000Z');
  const endDate = new Date('2022-01-01T13:00:00.000Z');

  beforeEach(async () => {
    const date = new Date();
    user = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);
    positionRaw = {
      id: '1',
      date: beginDate.toISOString(),
      asset_id: '1',
      asset_code: 'TEST11',
      asset_social: 'Teste',
      asset_logo: '',
      asset_category: 'stock',
      price: '15.00',
      quantity: '220',
      user_id: user.id,
      user_name: user.name,
      user_createdAt: user.createdAt.toISOString(),
      user_updatedAt: user.updatedAt.toISOString(),
    };
    connectionMock.queryBuilder.where = () => connectionMock.queryBuilder;
    connectionMock.queryBuilder.andWhere = () => connectionMock.queryBuilder;
    connectionMock.queryBuilder.setRawManyReturnValue([]);
    reportsRepository = new PositionRepository(
      connectionMock as any, new PositionFactory(),
    );
  });

  it('should return formated data', async () => {
    const formatedData = await reportsRepository
      .formatPositions([
        positionRaw,
      ]);

    expect(formatedData).toEqual([{
      _id: 1,
      _date: beginDate,
      _asset: {
        _id: 1,
        _code: 'TEST11',
        _social: 'Teste',
        _logo: '',
        _category: 'stock',
      },
      _user: {
        _id: user.id,
        _name: user.name,
        _createdAt: user.createdAt,
        _updatedAt: user.updatedAt,
      },
      _quantity: 220,
      _price: 15.00,
    }]);
  });

  it('should return formated data without id and with current date when there is no id and date', async () => {
    const formatedData = await reportsRepository
      .formatPositions([
        {
          ...positionRaw,
          id: undefined,
          date: undefined,
        },
      ]);

    expect(formatedData[0].asset).toEqual({
      _id: 1,
      _code: 'TEST11',
      _social: 'Teste',
      _logo: '',
      _category: 'stock',
    });
    expect(formatedData[0].user).toEqual({
      _id: user.id,
      _name: user.name,
      _createdAt: user.createdAt,
      _updatedAt: user.updatedAt,
    });
    expect(formatedData[0].quantity).toEqual(220);
    expect(formatedData[0].price).toEqual(15.00);
    expect(formatedData[0].id).toBeUndefined();
    expect(formatedData[0].date).toBeDefined();
  });

  it('getUserCurrentPositions() - Should run successfully  ', async () => {
    connectionMock.queryBuilder.setRawManyReturnValue([
      positionRaw,
    ]);

    const currentPositions = await reportsRepository.getUserCurrentPositions(user.id);
    expect(currentPositions).toEqual([{
      _id: 1,
      _date: beginDate,
      _asset: {
        _id: 1,
        _code: 'TEST11',
        _social: 'Teste',
        _logo: '',
        _category: 'stock',
      },
      _user: {
        _id: user.id,
        _name: user.name,
        _createdAt: user.createdAt,
        _updatedAt: user.updatedAt,
      },
      _quantity: 220,
      _price: 15.00,
    }]);
  });

  it('getAssetTimeseries() - Should run successfully when there is data and time interval in the filter', async () => {
    expect.assertions(2);
    connectionMock.queryBuilder.andWhere = (query, params) => {
      if (params.startDate) {
        expect(params.startDate).toEqual(beginDate);
      }
      if (params.endDate) {
        expect(params.endDate).toEqual(endDate);
      }
      return connectionMock.queryBuilder;
    };

    await reportsRepository.getAssetTimeseries(user.id, [], beginDate, endDate);
    expect.anything();
  });

  it('getAssetTimeseries() - Should run successfully when there is data and only a start date was entered in the filter', async () => {
    expect.assertions(1);
    connectionMock.queryBuilder.andWhere = (query, params) => {
      if (params.startDate) {
        expect(params.startDate).toEqual(beginDate);
      }
      return connectionMock.queryBuilder;
    };
    await reportsRepository.getAssetTimeseries(user.id, [], beginDate, undefined);
    expect.anything();
  });

  it('getAssetTimeseries() - Should run successfully when there is data and only a end date was entered in the filter', async () => {
    expect.assertions(1);
    connectionMock.queryBuilder.andWhere = (query, params) => {
      if (params.endDate) {
        expect(params.endDate).toEqual(endDate);
      }
      return connectionMock.queryBuilder;
    };
    await reportsRepository.getAssetTimeseries(user.id, [], undefined, endDate);
    expect.anything();
  });

  it('getAssetTimeseries() - Should run successfully when code filter was entered ', async () => {
    expect.assertions(1);
    connectionMock.queryBuilder.andWhere = (query, params) => {
      if (params) {
        expect(params.codes).toEqual(['TEST11']);
      }
      return connectionMock.queryBuilder;
    };
    await reportsRepository.getAssetTimeseries(user.id, ['TEST11'], undefined, undefined);
    expect.anything();
  });

  it('getAssetTimeseries() - Should return a empty dataset, when there is no data ', async () => {
    const assetTimeseries = await reportsRepository
      .getAssetTimeseries(user.id, [], new Date(), new Date());
    expect(assetTimeseries.length).toEqual(0);
  });
});
