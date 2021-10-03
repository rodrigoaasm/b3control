/* eslint-disable no-underscore-dangle */
import { ConstructorEntityError, EntityError } from '@domain-error/custom-error';
import { AssetEntity } from '@entities/asset';

export class PositionEntity {
  private _asset: AssetEntity;

  private _quantity : number;

  private _price : number;

  private _date : Date;

  constructor(asset: AssetEntity, quantity: number, price: number, date: Date) {
    try {
      this.asset = asset;
      this.quantity = quantity;
      this.price = price;
      this.date = date;
    } catch (error) {
      throw ConstructorEntityError(error.message);
    }
  }

  get asset() {
    return this._asset;
  }

  set asset(asset: AssetEntity) {
    if (!asset) {
      throw EntityError('It was not possible set an asset in the position object!\n Asset is invalid.');
    }

    this._asset = asset;
  }

  get quantity() {
    return this._quantity;
  }

  set quantity(quantity: number) {
    if (!Number(quantity) || Number(quantity) < 0) {
      throw EntityError("It was not possible set a quantity in the position object!\n The value of the field 'quantity' is not accept");
    }

    this._quantity = quantity;
  }

  get price() {
    return this._price;
  }

  set price(price: number) {
    if (!Number(price) || Number(price) < 0) {
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
    return Number((this.quantity * this.price).toFixed(3));
  }
}

export default PositionEntity;
