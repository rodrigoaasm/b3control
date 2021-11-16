/* eslint-disable no-underscore-dangle */
import { EntityConstructionError, EntityError } from '@domain-error/custom-error';
import { AssetEntity } from '@entities/asset/asset-entity';
import { OperationType } from './operation-type';

export class OperationEntity {
  private _id: number;

  private _value : number;

  private _quantity : number;

  private _type : OperationType;

  private _asset : AssetEntity;

  private _createdAt : Date;

  constructor(
    id: number, value: number, quantity: number,
    type: OperationType, asset: AssetEntity, createdAt: Date,
  ) {
    try {
      this.id = id;
      this.asset = asset;
      this.quantity = quantity;
      this.value = value;
      this.type = type;
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

  get quantity(): number {
    return this._quantity;
  }

  set quantity(quantity: number) {
    if (Number.isNaN(Number(quantity)) || Number(quantity) < 0) {
      throw EntityError("It was not possible create the operation object!\n The value of the field 'quantity' is not accept");
    }

    this._quantity = quantity;
  }

  get type(): OperationType {
    return this._type;
  }

  set type(type: OperationType) {
    if (type !== 'sale' && type !== 'buy') {
      throw EntityError("It was not possible create the operation object!\n The type is invalid! Expect 'buy' or 'sale'.");
    }

    this._type = type;
  }

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (!Number(value) || Number(value) < 0) {
      throw EntityError("It was not possible create the operation object!\n The value of the field 'value' is not accept");
    }

    this._value = value;
  }

  get asset(): AssetEntity {
    return this._asset;
  }

  set asset(asset: AssetEntity) {
    if (!asset) {
      throw EntityError('It was not possible create the operation object!\n Stock not found.');
    }

    this._asset = asset;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(createdAt: Date) {
    if (!createdAt) {
      throw EntityError('It was not possible create the operation object!\n Date is invalid.');
    }

    this._createdAt = createdAt;
  }
}

export default OperationEntity;
