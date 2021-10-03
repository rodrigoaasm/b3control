import { AssetCategory, AssetEntity } from '@entities/asset';
import { PositionEntity } from '@entities/position';

describe('Position Entity', () => {
  let stock: AssetEntity;
  let date: Date;

  beforeEach(() => {
    stock = {
      category: 'stock' as AssetCategory,
      id: 1,
      code: 'TEST11',
      social: 'Test',
      logo: '',
    };
    date = new Date();
  });

  it('Should make a position', async () => {
    const position = new PositionEntity(stock, 200, 10.000, date);

    expect(position.asset).toEqual(stock);
    expect(position.quantity).toEqual(200);
    expect(position.price).toEqual(10.000);
    expect(position.date).toEqual(date);
    expect(position.value).toEqual(2000);
  });

  it("Should throw an Error when the value of the field 'date' is undefined. ", async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(stock, 1000, 10.00, undefined);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it('Should make a position with a maximum price of three decimal digits ', async () => {
    const position = new PositionEntity(stock, 200, 10.0412345, date);

    expect(position.asset).toEqual(stock);
    expect(position.quantity).toEqual(200);
    expect(position.price).toEqual(10.041);
    expect(position.date).toEqual(date);
    expect(position.value).toEqual(2008.2);
  });

  it('Should throw an Error when the asset is undefined. ', async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(undefined, 200, 10.00, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'quote' is negative. ", async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(stock, 200, -10.00, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'quote' is not number. ", async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(stock, 200, undefined, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'quantity' is negative. ", async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(stock, -200, 10.00, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'quantity' is not number. ", async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(stock, undefined, 10.00, date);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });
});
