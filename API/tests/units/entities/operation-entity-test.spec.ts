/* eslint-disable no-new */
import { OperationEntity, OperationType } from '@entities/operation/';
import { AssetCategory, AssetEntity } from '@entities/asset';

describe('Operation Entity', () => {
  let stock: AssetEntity;
  let date: Date;

  beforeEach(() => {
    stock = new AssetEntity(1, 'TEST11', 'Test', '', 'stock');
    date = new Date();
  });

  it('Should register a buy operation with the positive _value', async () => {
    const operation = new OperationEntity(1, 15.95, 200, 'buy', stock, date);

    expect(operation).toEqual({
      _id: 1,
      _value: 15.95,
      _quantity: 200,
      _type: 'buy',
      _asset: {
        _category: 'stock' as AssetCategory,
        _id: 1,
        _code: 'TEST11',
        _social: 'Test',
        _logo: '',
      },
      _createdAt: date,
    });
  });

  it('Should throw an Error when the stock is undefined. ', async () => {
    let error: Error;

    try {
      new OperationEntity(1, 15.95, 200, 'sale', undefined, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field '_value' is negative. ", async () => {
    let error: Error;

    try {
      new OperationEntity(1, 15.95, -200, 'sale', stock, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field '_value' is not number. ", async () => {
    let error: Error;

    try {
      new OperationEntity(1, '_value' as any as number, 200, 'sale', stock, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field '_quantity' is negative. ", async () => {
    let error: Error;

    try {
      new OperationEntity(1, 15.95, -200, 'sale', stock, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field '_quantity' is not number. ", async () => {
    let error: Error;

    try {
      new OperationEntity(1, 15.95, '_quantity' as unknown as number, 'sale', stock, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field '_type' is invalid. ", async () => {
    let error: Error;

    try {
      new OperationEntity(1, 15.95, 200, '_type' as OperationType, stock, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field '_createdAt' is undefined. ", async () => {
    let error: Error;

    try {
      new OperationEntity(1, 15.95, 200, 'sale', stock, undefined);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });
});
