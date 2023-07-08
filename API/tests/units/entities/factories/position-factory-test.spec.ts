import { AssetEntity } from '@entities/asset';
import { PositionFactory } from '@entities/position';
import { UserEntity } from '@entities/user';

const mockDateValidatorUtil = {
  validate: jest.fn(),
  isTimeInterval: jest.fn(),
};

describe('Position Factory', () => {
  let stock: AssetEntity;
  let date: Date;
  let positionFactory: PositionFactory;
  let user: UserEntity;

  beforeEach(() => {
    stock = new AssetEntity(1, 'TEST11', 'Test', '', 'stock');
    date = new Date();
    user = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);

    positionFactory = new PositionFactory(mockDateValidatorUtil);
  });

  it('Should make a position', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const position = positionFactory.make(stock, user, 200, 10, date, 0, 1);

    expect(position.asset).toEqual(stock);
    expect(position.quantity).toEqual(200);
    expect(position.price).toEqual(10.00);
    expect(position.date).toEqual(date);
    expect(position.value).toEqual(2000);
    expect(position.user).toEqual(user);
    expect(position.id).toEqual(1);
    expect(position.averageBuyPrice).toEqual(0);
  });

  it('Should make a position without optional fields', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const position = positionFactory.make(stock, user, 200, 10, date);

    expect(position.asset).toEqual(stock);
    expect(position.quantity).toEqual(200);
    expect(position.price).toEqual(10.00);
    expect(position.date).toEqual(date);
    expect(position.value).toEqual(2000);
    expect(position.user).toEqual(user);
    expect(position.averageBuyPrice).toEqual(0);
  });

  it('Should make a position when the date is a ISO string date ', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const position = positionFactory.make(stock, user, 200, 10, date.toISOString(), 10, 1);

    expect(position.asset).toEqual(stock);
    expect(position.quantity).toEqual(200);
    expect(position.price).toEqual(10.000);
    expect(position.date).toEqual(date);
    expect(position.value).toEqual(2000);
    expect(position.user).toEqual(user);
    expect(position.averageBuyPrice).toEqual(10);
  });

  it("Should throw an Error when the value of the field 'date' is undefined. ", async () => {
    let error: Error;
    mockDateValidatorUtil.validate.mockReturnValueOnce(false);

    try {
      positionFactory.make(stock, user, 1000, 10.00, undefined, 0, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });
});
