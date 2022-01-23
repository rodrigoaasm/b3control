import { AssetEntity } from '@entities/asset';
import { PositionEntity } from '@entities/position';
import { UserEntity } from '@entities/user/user-entity';

describe('Position Entity', () => {
  let stock: AssetEntity;
  let date: Date;
  let user: UserEntity;

  beforeEach(() => {
    stock = new AssetEntity(1, 'TEST11', 'Test', '', 'stock');
    date = new Date();
    user = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);
  });

  it('Should make a position', async () => {
    const position = new PositionEntity(stock, user, 200, 10.000, date, 1);

    expect(position.asset).toEqual(stock);
    expect(position.quantity).toEqual(200);
    expect(position.price).toEqual(10.000);
    expect(position.date).toEqual(date);
    expect(position.user).toEqual(user);
    expect(position.value).toEqual(2000);
  });

  it("Should throw an Error when the value of the field 'date' is undefined. ", async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(stock, user, 1000, 10.00, undefined, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it('Should make a position with a maximum price of three decimal digits ', async () => {
    const position = new PositionEntity(stock, user, 200, 10.0412345, date, 1);

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
      new PositionEntity(undefined, user, 200, 10.00, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it('Should throw an Error when the user is undefined. ', async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(stock, undefined, 200, 10.00, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'price' is negative. ", async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(stock, user, 200, -10.00, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'price' is not number. ", async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(stock, user, 200, undefined, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'quantity' is negative. ", async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(stock, user, -200, 10.00, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });

  it("Should throw an Error when the value of the field 'quantity' is not number. ", async () => {
    let error: Error;

    try {
      // eslint-disable-next-line no-new
      new PositionEntity(stock, user, undefined, 10.00, date, 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });
});
