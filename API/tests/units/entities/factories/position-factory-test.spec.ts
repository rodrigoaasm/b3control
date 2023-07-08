import { AssetEntity } from '@entities/asset';
import { PositionEntity, PositionFactory, UserPositionEntity } from '@entities/position';
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

  it('Should make a super position ', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const position = positionFactory.make<PositionEntity>({
      clazzName: 'PositionEntity',
      asset: stock,
      user,
      quantity: 200,
      date,
      price: 20,
      averageBuyPrice: 10,
      investmentValue: 2000,
    });

    expect(position instanceof PositionEntity).toBeTruthy();
    expect(position).toEqual({
      _asset: stock,
      _quantity: 200,
      _date: date,
      _user: user,
      _price: 20,
      _averageBuyPrice: 10,
      _investmentValue: 2000,
    });
  });

  it('Should make a PositionTime', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const position = positionFactory.make<UserPositionEntity>({
      clazzName: 'UserPositionEntity',
      asset: stock,
      user,
      quantity: 200,
      date,
      averageBuyPrice: 10,
      investmentValue: 2000,
      price: 20,
      id: 1,
    });

    expect(position instanceof UserPositionEntity).toBeTruthy();
    expect(position).toEqual({
      _asset: stock,
      _quantity: 200,
      _date: date,
      _user: user,
      _id: 1,
      _price: 20,
      _averageBuyPrice: 10,
      _investmentValue: 2000,
    });
  });

  it('Should make a position without id', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const position = positionFactory.make<PositionEntity>({
      clazzName: 'PositionEntity',
      asset: stock,
      user,
      price: 20,
      quantity: 200,
      date,
      averageBuyPrice: 10,
      investmentValue: 2000,
    });

    expect(position).toEqual({
      _asset: stock,
      _quantity: 200,
      _date: date,
      _user: user,
      _price: 20,
      _id: undefined,
      _averageBuyPrice: 10,
      _investmentValue: 2000,
    });
  });

  it('Should make a position when the date is a ISO string date ', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const position = positionFactory.make<PositionEntity>({
      clazzName: 'PositionEntity',
      asset: stock,
      user,
      quantity: 200,
      price: 20,
      date: date.toISOString(),
      averageBuyPrice: 10,
      investmentValue: 2000,
    });

    expect(position).toEqual({
      _asset: stock,
      _quantity: 200,
      _date: date,
      _price: 20,
      _user: user,
      _averageBuyPrice: 10,
      _investmentValue: 2000,
    });
  });

  it("Should throw an Error when the value of the field 'date' is undefined. ", async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);

    expect(() => positionFactory.make<PositionEntity>({
      clazzName: 'PositionEntity',
      asset: stock,
      user,
      quantity: 200,
      date: undefined,
      price: 20,
      averageBuyPrice: 10,
      investmentValue: 2000,
      id: 1,
    })).toThrowError('It was not possible create the position object!\n Date is invalid.');
  });

  it('Should throw an Error when trying to build a position with invalid price', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);

    expect(() => positionFactory.make<UserPositionEntity>({
      clazzName: 'UserPositionEntity',
      asset: stock,
      user,
      quantity: 200,
      date,
      price: undefined,
      averageBuyPrice: 10,
      investmentValue: 2000,
      id: 1,
    })).toThrowError('It was not possible create the position time object!\n Price is invalid.');
  });
});
