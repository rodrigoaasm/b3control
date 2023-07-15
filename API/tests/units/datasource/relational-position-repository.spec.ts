import { PositionRepository, IPositionQueryRaw } from '@external/datasource/relational/repositories/position-repository';
import { IPositionFactory, IPositionFactoryMakeInput } from '@domain-ports/factories/position-factory-interface';
import { AssetEntity } from '@entities/asset';
import { PositionEntity, UserPositionEntity } from '@entities/position';

import createConnectionMock from '@test-mocks/type-orm-mock';
import { UserEntity } from '@entities/user';

const mockRepositoryTypeOrm = {
  save: jest.fn(),
};
const connectionMock = createConnectionMock(mockRepositoryTypeOrm);

class PositionFactory implements IPositionFactory {
  // eslint-disable-next-line class-methods-use-this
  make<T extends PositionEntity>(args: IPositionFactoryMakeInput): T {
    const {
      asset, user, quantity, date, price, averageBuyPrice, investmentValue, id,
    } = args;

    return new UserPositionEntity(
      asset, user, quantity, new Date(date), price, averageBuyPrice, investmentValue, id,
    ) as unknown as T;
  }
}

describe('Relational - Position Repository', () => {
  let positionRepository: PositionRepository;
  let user: UserEntity;
  let positionRaw: IPositionQueryRaw;
  let positionRawInTimeseries: IPositionQueryRaw;
  const beginDate = new Date('2021-01-01T13:00:00.000Z');
  const endDate = new Date('2022-01-01T13:00:00.000Z');

  beforeEach(async () => {
    const date = new Date();
    user = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);
    positionRaw = {
      id: '1',
      created_at: beginDate.toISOString(),
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
      average_buy_price: '10',
      investment_value: '2200',
    };
    positionRawInTimeseries = {
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
      average_buy_price: '15.00',
      investment_value: '3300,00',
    };
    positionRepository = new PositionRepository(
      connectionMock as any, new PositionFactory(),
    );
  });

  describe('getUserCurrentPositions()', () => {
    it('Should return a position list', async () => {
      connectionMock.queryBuilder.getRawMany.mockResolvedValue([
        positionRaw,
      ]);

      const currentPositions = await positionRepository.getUserCurrentPositions(user.id);
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
        _price: 15,
        _quantity: 220,
        _averageBuyPrice: 10,
        _investmentValue: 2200,
      }]);
    });

    it('Should return an empty list when user has no positions', async () => {
      connectionMock.queryBuilder.getRawMany.mockResolvedValue([]);

      const currentPositions = await positionRepository.getUserCurrentPositions(user.id);
      expect(currentPositions).toEqual([]);
    });
  });

  describe('getUserCurrentPosition()', () => {
    it('Should return one position', async () => {
      connectionMock.queryBuilder.getRawOne.mockResolvedValue(
        positionRaw,
      );

      const currentPosition = await positionRepository.getUserCurrentPosition(user.id, 999);
      expect(currentPosition).toEqual({
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
        _price: 15,
        _investmentValue: 2200,
        _averageBuyPrice: 10,
      });
    });

    it('Should return undefined when the user has no position for that asset', async () => {
      connectionMock.queryBuilder.getRawOne.mockResolvedValue(undefined);

      const currentPosition = await positionRepository.getUserCurrentPosition(user.id, 999);
      expect(currentPosition).toBeUndefined();
    });
  });

  describe('getAssetTimeseries()', () => {
    it('Should run successfully when there is data and all filters are active', async () => {
      connectionMock.queryBuilder.getRawMany.mockResolvedValueOnce([
        positionRawInTimeseries,
      ]);
      connectionMock.queryBuilder.andWhere.mockClear();

      const result = await positionRepository.getAssetTimeseries(user.id, ['TEST11'], beginDate, endDate);

      expect(connectionMock.queryBuilder.andWhere.mock.calls[0]).toEqual(
        ['sq.date >= :startDate', { startDate: beginDate }],
      );
      expect(connectionMock.queryBuilder.andWhere.mock.calls[1]).toEqual(
        ['sq.date <= :endDate', { endDate }],
      );
      expect(connectionMock.queryBuilder.andWhere.mock.calls[2]).toEqual([
        's.code in (:...codes)', { codes: ['TEST11'] },
      ]);
      expect(result).toEqual([
        {
          _id: undefined,
          _date: beginDate,
          _asset: {
            _id: 1,
            _code: 'TEST11',
            _social: 'Teste',
            _logo: '',
            _category: 'stock',
          },
          _price: 15.00,
          _quantity: 220,
          _user: user,
          _averageBuyPrice: 15.00,
          _investmentValue: NaN,
        },
      ]);
    });

    it('Should run successfully when there is data and start date was entered in the filter', async () => {
      connectionMock.queryBuilder.getRawMany.mockResolvedValueOnce([
        positionRawInTimeseries,
      ]);
      connectionMock.queryBuilder.andWhere.mockClear();
      const result = await positionRepository.getAssetTimeseries(user.id, ['TEST11'], beginDate, undefined);

      expect(connectionMock.queryBuilder.andWhere.mock.calls[0]).toEqual(
        ['sq.date >= :startDate', { startDate: beginDate }],
      );
      expect(connectionMock.queryBuilder.andWhere.mock.calls[1]).toEqual([
        's.code in (:...codes)', { codes: ['TEST11'] },
      ]);
      expect(result).toEqual([
        {
          _id: undefined,
          _date: beginDate,
          _asset: {
            _id: 1,
            _code: 'TEST11',
            _social: 'Teste',
            _logo: '',
            _category: 'stock',
          },
          _price: 15.00,
          _quantity: 220,
          _investmentValue: NaN,
          _user: user,
          _averageBuyPrice: 15.00,
        },
      ]);
    });

    it('Should run successfully when there is data and end date was entered in the filter', async () => {
      connectionMock.queryBuilder.getRawMany.mockResolvedValueOnce([
        positionRawInTimeseries,
      ]);
      connectionMock.queryBuilder.andWhere.mockClear();

      const result = await positionRepository.getAssetTimeseries(user.id, ['TEST11'], undefined, endDate);

      expect(connectionMock.queryBuilder.andWhere.mock.calls[0]).toEqual(
        ['sq.date <= :endDate', { endDate }],
      );
      expect(connectionMock.queryBuilder.andWhere.mock.calls[1]).toEqual([
        's.code in (:...codes)', { codes: ['TEST11'] },
      ]);
      expect(result).toEqual([
        {
          _id: undefined,
          _date: beginDate,
          _asset: {
            _id: 1,
            _code: 'TEST11',
            _social: 'Teste',
            _logo: '',
            _category: 'stock',
          },
          _price: 15.00,
          _quantity: 220,
          _user: user,
          _averageBuyPrice: 15.00,
          _investmentValue: NaN,
        },
      ]);
    });

    it('Should run successfully when only code filter was entered ', async () => {
      connectionMock.queryBuilder.getRawMany.mockResolvedValueOnce([
        positionRawInTimeseries,
      ]);
      connectionMock.queryBuilder.andWhere.mockClear();

      const result = await positionRepository.getAssetTimeseries(user.id, ['TEST11'], undefined, undefined);

      expect(connectionMock.queryBuilder.andWhere.mock.calls[0]).toEqual([
        's.code in (:...codes)', { codes: ['TEST11'] },
      ]);
      expect(result).toEqual([
        {
          _id: undefined,
          _date: beginDate,
          _asset: {
            _id: 1,
            _code: 'TEST11',
            _social: 'Teste',
            _logo: '',
            _category: 'stock',
          },
          _price: 15.00,
          _quantity: 220,
          _averageBuyPrice: 15,
          _investmentValue: NaN,
          _user: user,
        },
      ]);
    });

    it('Should return a empty dataset, when there is no data ', async () => {
      connectionMock.queryBuilder.getRawMany.mockResolvedValueOnce([]);
      const assetTimeseries = await positionRepository
        .getAssetTimeseries(user.id, [], new Date(), new Date());
      expect(assetTimeseries.length).toEqual(0);
    });
  });

  describe('saveUserCurrentPosition()', () => {
    it('Should save the user current position', async () => {
      const userCurrentPosition = new UserPositionEntity(
        new AssetEntity(1, 'TEST11', '', '', 'stock'),
        user,
        4,
        beginDate,
        0,
        0,
        0,
        1,
      );

      await positionRepository.saveUserCurrentPosition(userCurrentPosition);

      expect(mockRepositoryTypeOrm.save).toHaveBeenCalled();
      expect(mockRepositoryTypeOrm.save.mock.calls[0]).toEqual([{
        id: 1,
        user: {
          id: user.id,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        asset: {
          id: 1,
          code: 'TEST11',
          social: '',
          logo: '',
          category: 'stock',
        },
        quantity: 4,
        averageBuyPrice: 0,
        investmentValue: 0,
        createdAt: beginDate,
        updatedAt: expect.any(Date),
      }]);
    });

    it('Should throw an error', async () => {
      expect.assertions(1);
      const userCurrentPosition = new UserPositionEntity(
        new AssetEntity(1, 'TEST11', '', '', 'stock'),
        user,
        4,
        beginDate,
        0,
        0,
        0,
        1,
      );
      mockRepositoryTypeOrm.save.mockRejectedValueOnce(new Error('Database error'));

      try {
        await positionRepository.saveUserCurrentPosition(userCurrentPosition);
      } catch (error) {
        expect(error.message).toEqual('Database error');
      }
    });
  });
});
