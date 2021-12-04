/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { AssetEntity } from '@entities/asset';
import { QueryFailedError } from 'typeorm';
import { IDividendPaymentFactory } from '@domain-ports/factories/dividend-payment-factory-interface';
import { DividendPaymentEntity } from '@entities/dividend-payment';
import { DividendPaymentRepository } from '@external/datasource/relational/repositories/dividend-payment-repository';
import createConnectionMock from '@test-mocks/type-orm-mock';

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
    value: number,
    asset: AssetEntity,
    createdAt: Date,
    id?: number,
  ): DividendPaymentEntity {
    return new DividendPaymentEntity(id, value, asset, createdAt);
  }
}

describe('Relational - payment Repository', () => {
  let date: Date;
  let asset: any;
  let dividendPaymentRepository: DividendPaymentRepository;
  const dateRegex = /(\d){4}-(\d){2}-(\d){2}T(\d){2}:(\d){2}:(\d){2}.(\d){3}Z/g;

  beforeEach(() => {
    date = new Date();
    asset = new AssetEntity(1, 'TEST11', 'Teste', '', 'stock');

    // clear mock
    connectionMock.queryBuilder.innerJoin = () => connectionMock.queryBuilder;
    connectionMock.queryBuilder.where = () => connectionMock.queryBuilder;

    dividendPaymentRepository = new DividendPaymentRepository(
      connectionMock as any, new DividendPaymentFactoryMock(),
    );
  });

  it('Should insert the entry in the database', async () => {
    const payment = new DividendPaymentEntity(undefined, 1.95, asset, date);

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

    const payment = new DividendPaymentEntity(undefined, 1.95, asset, date);
    try {
      await dividendPaymentRepository.save(payment);
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('QueryFailedError');
  });

  it('should run successfully when there is data and time interval in the filter', async () => {
    expect.assertions(2);
    connectionMock.queryBuilder.innerJoin = (query, allias, condition) => {
      const dates = query.match(dateRegex);
      expect(dates[0]).toEqual('2021-01-01T13:00:00.000Z');
      expect(dates[1]).toEqual('2022-01-01T13:00:00.000Z');
      return connectionMock.queryBuilder;
    };
    await dividendPaymentRepository.getDividendPaymentsByMonth([], new Date('2021-01-01T13:00:00.000Z'), new Date('2022-01-01T13:00:00.000Z'));

    expect.anything();
  });

  it('Should run successfully when there is data and only a start date was entered in the filter', async () => {
    expect.assertions(2);
    connectionMock.queryBuilder.innerJoin = (query, allias, condition) => {
      const dates = query.match(dateRegex);
      expect(dates[0]).toEqual('2021-01-01T13:00:00.000Z');
      expect(new Date(dates[1]).toDateString()).toEqual(new Date().toDateString());
      return connectionMock.queryBuilder;
    };
    await dividendPaymentRepository.getDividendPaymentsByMonth([], new Date('2021-01-01T13:00:00.000Z'), undefined);
    expect.anything();
  });

  it('Should run successfully when there is data and only a end date was entered in the filter', async () => {
    expect.assertions(2);
    connectionMock.queryBuilder.innerJoin = (query, allias, condition) => {
      const dates = query.match(dateRegex);
      expect(new Date(dates[0]).toDateString()).toEqual(new Date().toDateString());
      expect(dates[1]).toEqual('2222-01-01T13:00:00.000Z');
      return connectionMock.queryBuilder;
    };
    await dividendPaymentRepository.getDividendPaymentsByMonth([], undefined, new Date('2222-01-01T13:00:00.000Z'));
    expect.anything();
  });

  it('Should run successfully when code filter was entered ', async () => {
    expect.assertions(1);
    connectionMock.queryBuilder.where = (query, params) => {
      expect(params.codes).toEqual(['TEST11']);
      return connectionMock.queryBuilder;
    };
    await dividendPaymentRepository.getDividendPaymentsByMonth(['TEST11'], undefined, new Date());
    expect.anything();
  });

  it('Should return a empty dataset, when there is no data ', async () => {
    expect.assertions(3);
    connectionMock.queryBuilder.innerJoin = (query, allias, condition) => {
      const dates = query.match(dateRegex);
      expect(new Date(dates[0]).toDateString()).toEqual(new Date().toDateString());
      expect(new Date(dates[1]).toDateString()).toEqual(new Date().toDateString());
      return connectionMock.queryBuilder;
    };
    const assetTimeseries = await dividendPaymentRepository
      .getDividendPaymentsByMonth([], new Date(), new Date());
    expect(assetTimeseries.length).toEqual(0);
  });
});
