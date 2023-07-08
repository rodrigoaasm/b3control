import { EntityConstructionError, EntityError } from '@domain-error/custom-error';
import { AssetEntity } from '@entities/asset';
import { UserEntity } from '@entities/user';

export class PositionEntity {
  private _asset: AssetEntity;

  private _user: UserEntity;

  private _quantity : number;

  private _price: number;

  private _averageBuyPrice: number;

  private _investmentValue: number;

  private _date : Date;

  constructor(
    asset: AssetEntity,
    user: UserEntity,
    quantity: number,
    date: Date,
    price: number,
    averageBuyPrice: number | undefined,
    investmentValue: number | undefined,
  ) {
    try {
      this.asset = asset;
      this.user = user;
      this.quantity = quantity;
      this.date = date;
      this.averageBuyPrice = averageBuyPrice;
      this.investmentValue = investmentValue;
      this.price = price;
    } catch (error) {
      throw EntityConstructionError(error.message);
    }
  }

  get asset() {
    return this._asset;
  }

  set asset(asset: AssetEntity) {
    if (!asset) {
      throw EntityError('It was not possible set an asset in the position object!\n Asset is undefined.');
    }

    this._asset = asset;
  }

  get user(): UserEntity {
    return this._user;
  }

  set user(user: UserEntity) {
    if (!user) {
      throw EntityError('It was not possible create the position object!\n User is undefined.');
    }

    this._user = user;
  }

  get quantity() {
    return this._quantity;
  }

  set quantity(quantity: number) {
    if (Number.isNaN(Number(quantity)) || Number(quantity) < 0) {
      throw EntityError("It was not possible set a quantity in the position object!\n The value of the field 'quantity' is not accept");
    }

    this._quantity = quantity;
  }

  get averageBuyPrice() {
    return this._averageBuyPrice;
  }

  set averageBuyPrice(averageBuyPrice: number) {
    if (!Number.isNaN(Number(averageBuyPrice)) && Number(averageBuyPrice) < 0) {
      throw EntityError("It was not possible set a average buy price in the position object!\n The value of the field 'averageBuyPrice' is not accept");
    }
    this._averageBuyPrice = Number(Number(averageBuyPrice).toFixed(3));
  }

  get investmentValue() {
    return this._investmentValue;
  }

  set investmentValue(investmentValue: number) {
    if (!Number.isNaN(Number(investmentValue)) && Number(investmentValue) < 0) {
      throw EntityError("It was not possible set a average buy price in the position object!\n The value of the field 'averageBuyPrice' is not accept");
    }
    this._investmentValue = Number(Number(investmentValue).toFixed(3));
  }

  get price() {
    return this._price;
  }

  set price(price: number) {
    if ((!Number(price) && price !== 0) || Number(price) < 0) {
      throw EntityError("It was not possible set a price in the position object!\n The value of the field 'price' is not accept");
    }
    this._price = Number(Number(price).toFixed(3));
  }

  get date() {
    return this._date;
  }

  set date(date: Date) {
    if (!date) {
      throw EntityError('It was not possible set a date in the position object!\n Date is invalid.');
    }
    this._date = date;
  }

  get value() {
    return this.price * this.quantity;
  }
}

export default PositionEntity;
