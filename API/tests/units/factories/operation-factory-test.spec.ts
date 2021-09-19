import { OperationFactory, OperationType } from '@entities/operation/';
import { AssetCategory, AssetEntity } from '@entities/asset';
import DateValidatorUtil from '@utils/date-validator-util';

describe('Operation Factory', () => {
  let stock: AssetEntity;
  let date: Date;
  let operationFactory: OperationFactory;

  beforeEach(() => {
    stock = {
      category: 'stock' as AssetCategory,
      id: 1,
      code: 'TEST11',
      social: 'Test',
      logo: '',
    };
    date = new Date();
    operationFactory = new OperationFactory(new DateValidatorUtil());
  });

  it('Should register a buy operation with the positive value', async () => {
    const operation = operationFactory.make(15.95, 200, 'buy', stock, date, 1);

    expect(operation).toEqual({
      id: 1,
      value: 15.95,
      quantity: 200,
      type: 'buy',
      asset: {
        category: 'stock' as AssetCategory,
        id: 1,
        code: 'TEST11',
        social: 'Test',
        logo: '',
      },
      createdAt: date,
    });
  });

  it('Should register a sale operation with the negative value', async () => {
    const operation = operationFactory.make(15.95, 200, 'sale', stock, date, 1);

    expect(operation).toEqual({
      id: 1,
      value: 15.95,
      quantity: -200,
      type: 'sale',
      asset: {
        category: 'stock' as AssetCategory,
        id: 1,
        code: 'TEST11',
        social: 'Test',
        logo: '',
      },
      createdAt: date,
    });
  });

  it('Should throw an Error when the stock is undefined. ', async () => {
    let error: Error;

    try {
      operationFactory.make(15.95, 200, 'sale', undefined, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'value' is negative. ", async () => {
    let error: Error;

    try {
      operationFactory.make(15.95, -200, 'sale', stock, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'value' is not number. ", async () => {
    let error: Error;

    try {
      operationFactory.make('value' as unknown as number, 200, 'sale', stock, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'quantity' is negative. ", async () => {
    let error: Error;

    try {
      operationFactory.make(15.95, -200, 'sale', stock, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'quantity' is not number. ", async () => {
    let error: Error;

    try {
      operationFactory.make(15.95, 'quantity' as unknown as number, 'sale', stock, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'type' is invalid. ", async () => {
    let error: Error;

    try {
      operationFactory.make(15.95, 200, 'type' as OperationType, stock, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'createdAt' is undefined. ", async () => {
    let error: Error;

    try {
      operationFactory.make(15.95, 200, 'sale', stock, undefined, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should parse the date string for the date type when the value of the field 'createdAt' is a date string.", async () => {
    const operation = operationFactory.make(15.95, 200, 'buy', stock, '2020-09-01T13:00:00.000Z', 1);

    expect(operation).toEqual({
      id: 1,
      value: 15.95,
      quantity: 200,
      type: 'buy',
      asset: {
        category: 'stock' as AssetCategory,
        id: 1,
        code: 'TEST11',
        social: 'Test',
        logo: '',
      },
      createdAt: new Date('2020-09-01T13:00:00.000Z'),
    });
  });
});
