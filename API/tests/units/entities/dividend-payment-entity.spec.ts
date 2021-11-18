/* eslint-disable no-new */
import { AssetEntity } from '@entities/asset';
import { DividendPaymentEntity } from '@entities/dividend-payment/dividend-payment-entity';

describe('DividendPaymentsEntity', () => {
  let stock: AssetEntity;
  let date: Date;

  beforeEach(() => {
    stock = new AssetEntity(1, 'TEST11', 'Test', '', 'stock');
    date = new Date();
  });

  it('Should make a dividend payment object', async () => {
    const payment = new DividendPaymentEntity(1, 20.00, stock, date);

    expect(payment).toEqual({
      _id: 1,
      _asset: stock,
      _createdAt: date,
      _value: 20.00,
    });
  });

  it('Should throw an Error when the stock is undefined. ', async () => {
    let error: Error;

    try {
      new DividendPaymentEntity(1, 20.00, undefined, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.message).toEqual('It was not possible create the dividend payment object!\n Asset is undefined.');
  });

  it("Should throw an Error when the value of the field '_value' is negative. ", async () => {
    let error: Error;

    try {
      new DividendPaymentEntity(1, -20.00, stock, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.message).toEqual('It was not possible create the dividend payment object!\n The value of the field "value" is not accept');
  });

  it("Should throw an Error when the value of the field '_value' is not number. ", async () => {
    let error: Error;

    try {
      new DividendPaymentEntity(1, '_value' as any, stock, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.message).toBe('It was not possible create the dividend payment object!\n The value of the field "value" is not accept');
  });

  it("Should throw an Error when the value of the field '_createdAt' is undefined. ", async () => {
    let error: Error;

    try {
      new DividendPaymentEntity(1, 20.00, stock, undefined);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.message).toEqual('It was not possible create the dividend payment object!\n Date is invalid.');
  });
});
