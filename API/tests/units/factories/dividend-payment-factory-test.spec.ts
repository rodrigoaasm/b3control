/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { AssetEntity } from '@entities/asset';
import { DividendPaymentFactory } from '@entities/dividend-payment';

const mockDateValidatorUtil = {
  validate: jest.fn(),
  isTimeInterval: jest.fn(),
};

describe('DividendPaymentFactory', () => {
  let stock: AssetEntity;
  let date: Date;
  let dividendPaymentFactory: DividendPaymentFactory;

  beforeEach(() => {
    stock = new AssetEntity(1, 'TEST11', 'Test', '', 'stock');
    date = new Date();

    dividendPaymentFactory = new DividendPaymentFactory(mockDateValidatorUtil);
  });

  it('Should register a dividend payment with the positive value', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const payment = dividendPaymentFactory.make(15.95, stock, date, 1);

    expect(payment.id).toEqual(1);
    expect(payment.value).toEqual(15.95);
    expect(payment.asset).toEqual(stock);
    expect(payment.createdAt).toEqual(date);
  });

  it("Should parse the date string for the date type when the value of the field '_createdAt' is a date string.", async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const payment = dividendPaymentFactory.make(15.95, stock, date.toISOString(), 1);

    expect(payment.id).toEqual(1);
    expect(payment.value).toEqual(15.95);
    expect(payment.asset).toEqual(stock);
    expect(payment.createdAt).toEqual(date);
  });

  it('Should throw an error when _createdAt is invalid', async () => {
    let error;
    mockDateValidatorUtil.validate.mockReturnValueOnce(false);

    try {
      dividendPaymentFactory.make(15.95, stock, 'invalid', 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.message).toEqual('It was not possible create the dividend payments object!\n Date is invalid.');
  });
});
