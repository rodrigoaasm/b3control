import { AssetCategory, AssetEntity } from '@entities/asset';
import { PositionFactory } from '@entities/position';
import { DateValidatorUtil } from '@external/utils/date-validator-util';

describe('Position Factory', () => {
  let stock: AssetEntity;
  let date: Date;
  let positionFactory: PositionFactory;

  beforeEach(() => {
    stock = {
      category: 'stock' as AssetCategory,
      id: 1,
      code: 'TEST11',
      social: 'Test',
      logo: '',
    };
    date = new Date();
    positionFactory = new PositionFactory(new DateValidatorUtil());
  });

  it('Should make a position', async () => {
    const position = positionFactory.make(stock, 200, 10.000, date);

    expect(position.asset).toEqual(stock);
    expect(position.quantity).toEqual(200);
    expect(position.price).toEqual(10.000);
    expect(position.date).toEqual(date);
    expect(position.value).toEqual(2000);
  });

  it('Should make a position when the date is a ISO string date ', async () => {
    const position = positionFactory.make(stock, 200, 10.000, date.toISOString());

    expect(position.asset).toEqual(stock);
    expect(position.quantity).toEqual(200);
    expect(position.price).toEqual(10.000);
    expect(position.date).toEqual(date);
    expect(position.value).toEqual(2000);
  });

  it("Should throw an Error when the value of the field 'date' is undefined. ", async () => {
    let error: Error;

    try {
      positionFactory.make(stock, 1000, 10.00, undefined);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });
});
