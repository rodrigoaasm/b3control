/* eslint-disable no-underscore-dangle */
import { EntityConstructionError, EntityError } from '@domain-error/custom-error';
import { AssetEntity } from '@entities/asset';

export class DividendPaymentEntity {
  private _id: number;

  private _value: number;

  private _asset: AssetEntity;

  private _createdAt: Date;

  constructor(
    id: number, value: number, asset: AssetEntity, createdAt: Date,
  ) {
    try {
      this.id = id;
      this.asset = asset;
      this.value = value;
      this.createdAt = createdAt;
    } catch (error) {
      throw EntityConstructionError(error.message);
    }
  }

  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }

  get asset(): AssetEntity {
    return this._asset;
  }

  set asset(asset: AssetEntity) {
    if (!asset) {
      throw EntityError('It was not possible create the dividend payment object!\n Asset is undefined.');
    }

    this._asset = asset;
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (Number.isNaN(Number(value)) || Number(value) < 0) {
      throw EntityError('It was not possible create the dividend payment object!\n The value of the field "value" is not accept');
    }

    this._value = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(createdAt: Date) {
    if (!createdAt) {
      throw EntityError('It was not possible create the dividend payment object!\n Date is invalid.');
    }

    this._createdAt = createdAt;
  }
}

export default DividendPaymentEntity;
