/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssetEntity } from '@entities/asset';

import { IDividendPaymentFactory } from '@domain-ports/factories/dividend-payment-factory-interface';
import { DividendPaymentEntity } from '@entities/dividend-payment';
import { SubmitDividendPaymentUseCase } from '@usecases/submit-dividend/submit-dividend-payments-usecase';
import DividendPaymentRepositoryMock from '@test-mocks/dividend-payment-repository-mock';
import AssetRepositoryMock from '@test-mocks/asset-repository-mock';

class DividendPaymentFactoryMock implements IDividendPaymentFactory {
  constructor(private date: Date) {

  }

  make(
    value: number, paper: AssetEntity, createdAt: string | Date, id: number,
  ): DividendPaymentEntity {
    return new DividendPaymentEntity(1, 2.00, new AssetEntity(1, 'TEST11', '', '', 'stock'), this.date);
  }
}

describe('Submit Dividend Payment Use Case', () => {
  let submitDividendPaymentUseCase : SubmitDividendPaymentUseCase;
  let date: Date;

  beforeEach(() => {
    date = new Date();
    submitDividendPaymentUseCase = new SubmitDividendPaymentUseCase(
      new DividendPaymentRepositoryMock(),
      new AssetRepositoryMock(),
      new DividendPaymentFactoryMock(date),
    );
  });

  it('Should register an dividend payment', async () => {
    const submitedPayment = await submitDividendPaymentUseCase.submit({
      value: 15.95,
      assetCode: 'TEST11',
      createdAt: date,
    });

    expect(submitedPayment.id).toEqual(1);
    expect(submitedPayment.value).toEqual(2.00);
    expect(submitedPayment.asset.id).toEqual(1);
    expect(submitedPayment.asset.code).toEqual('TEST11');
    expect(submitedPayment.asset.social).toEqual('');
    expect(submitedPayment.asset.logo).toEqual('');
    expect(submitedPayment.asset.category).toEqual('stock');
    expect(submitedPayment.createdAt).toEqual(date);
  });

  it('Should throw an error when the asset not found', async () => {
    let error: Error;

    try {
      await submitDividendPaymentUseCase.submit({
        value: 15.95,
        assetCode: 'TEST4',
        createdAt: date,
      });
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it('Should throw an error when required attributes are not entered', async () => {
    let error: Error;

    try {
      await submitDividendPaymentUseCase.submit({} as any);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });
});
