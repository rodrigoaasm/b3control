/* eslint-disable no-underscore-dangle */
import { AssetEntity } from '@entities/asset';
import { QueryFailedError } from 'typeorm';
import { IDividendPaymentFactory } from '@domain-ports/factories/dividend-payment-factory-interface';
import { DividendPaymentEntity } from '@entities/dividend-payment';
import DividendPaymentRepository from '@external/datasource/relational/repositories/dividend-payment-repository';

const mockParentRepository = {
  save: jest.fn((object: any) => ({
    ...object,
    id: 1,
  })),
};

const connectionMock = {
  getRepository: () => mockParentRepository,
};

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

  beforeEach(() => {
    date = new Date();
    asset = new AssetEntity(1, 'TEST11', 'Teste', '', 'stock');
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
});
