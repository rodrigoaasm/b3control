import { AssetEntity } from '@entities/asset';
import { PositionFactory } from '@entities/position';

const mockDateValidatorUtil = {
  validate: jest.fn(),
  isTimeInterval: jest.fn(),
};

describe('Position Factory', () => {
  let stock: AssetEntity;
  let date: Date;
  let positionFactory: PositionFactory;

  beforeEach(() => {
    stock = new AssetEntity(1, 'TEST11', 'Test', '', 'stock');
    date = new Date();

    positionFactory = new PositionFactory(mockDateValidatorUtil);
  });

  it('Should make a position', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const position = positionFactory.make(stock, 200, 10.000, date);

    expect(position.asset).toEqual(stock);
    expect(position.quantity).toEqual(200);
    expect(position.price).toEqual(10.000);
    expect(position.date).toEqual(date);
    expect(position.value).toEqual(2000);
  });

  it('Should make a position when the date is a ISO string date ', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const position = positionFactory.make(stock, 200, 10.000, date.toISOString());

    expect(position.asset).toEqual(stock);
    expect(position.quantity).toEqual(200);
    expect(position.price).toEqual(10.000);
    expect(position.date).toEqual(date);
    expect(position.value).toEqual(2000);
  });

  it("Should throw an Error when the value of the field 'date' is undefined. ", async () => {
    let error: Error;
    mockDateValidatorUtil.validate.mockReturnValueOnce(false);

    try {
      positionFactory.make(stock, 1000, 10.00, undefined);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });
});
