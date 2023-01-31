/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { AssetEntity } from '@entities/asset';
import { QueryFailedError } from 'typeorm';
import { IDividendPaymentFactory } from '@domain-ports/factories/dividend-payment-factory-interface';
import { DividendPaymentEntity } from '@entities/dividend-payment';
import { DividendPaymentRepository } from '@external/datasource/relational/repositories/dividend-payment-repository';
import createConnectionMock from '@test-mocks/type-orm-mock';
import { UserEntity } from '@entities/user';

const mockParentRepository = {
  save: jest.fn((object: any) => ({
    ...object,
    id: 1,
  })),
};

const connectionMock = createConnectionMock(mockParentRepository);

class DividendPaymentFactoryMock implements IDividendPaymentFactory {
  // eslint-disable-next-line class-methods-use-this
  make(
    user: UserEntity,
    value: number,
    asset: AssetEntity,
    createdAt: Date,
    id?: number,
  ): DividendPaymentEntity {
    return new DividendPaymentEntity(id, user, value, asset, createdAt);
  }
}

describe('Relational - payment Repository', () => {
  let date: Date;
  let asset: any;
  let dividendPaymentRepository: DividendPaymentRepository;
  let user: UserEntity;
  const dateRegex = /([A-Za-z]{3} ){2}[\d]{2} [\d]{4}/g;

  beforeEach(() => {
    date = new Date();
    asset = new AssetEntity(1, 'TEST11', 'Teste', '', 'stock');
    user = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);

    dividendPaymentRepository = new DividendPaymentRepository(
      connectionMock as any, new DividendPaymentFactoryMock(),
    );
  });

  it('Should insert the entry in the database', async () => {
    const payment = new DividendPaymentEntity(undefined, user, 1.95, asset, date);

    const savedPayment = await dividendPaymentRepository.save(payment);

    expect(savedPayment.id).toBeTruthy();
    expect(savedPayment).toEqual({
      ...payment,
      _id: savedPayment.id,
    });
  });

  it('Should throw an error when there is an transaction error in the database', async () => {
    let error: Error;
    mockParentRepository.save.mockImplementationOnce(() => {
      throw new QueryFailedError('', [], {});
    });

    const payment = new DividendPaymentEntity(undefined, user, 1.95, asset, date);
    try {
      await dividendPaymentRepository.save(payment);
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('QueryFailedError');
  });

  it('should run successfully when there is data and time interval in the filter', async () => {
    connectionMock.queryBuilder.getRawMany.mockReturnValueOnce([]);
    await dividendPaymentRepository.getDividendPaymentsByMonth(user.id, [], new Date('2021-01-01T13:00:00.000Z'), new Date('2022-01-01T13:00:00.000Z'));

    const dates = connectionMock.queryBuilder.innerJoin.mock.calls[0][0].match(dateRegex);
    expect(dates[0]).toEqual(new Date('2021-01-01T13:00:00.000Z').toDateString());
    expect(dates[1]).toEqual(new Date('2022-01-01T13:00:00.000Z').toDateString());
  });

  it('Should run successfully when code filter was entered ', async () => {
    connectionMock.queryBuilder.getRawMany.mockReturnValueOnce([]);
    await dividendPaymentRepository.getDividendPaymentsByMonth(user.id, ['TEST11'], new Date(), new Date());

    expect(connectionMock.queryBuilder.andWhere.mock.calls[0][1]).toEqual({ codes: ['TEST11'] });
  });

  it('Should return a empty dataset, when there is no data ', async () => {
    connectionMock.queryBuilder.getRawMany.mockReturnValueOnce([]);
    const assetTimeseries = await dividendPaymentRepository
      .getDividendPaymentsByMonth(user.id, [], new Date(), new Date());
    expect(assetTimeseries.length).toEqual(0);
  });
});
