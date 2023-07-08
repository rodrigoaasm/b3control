/* eslint-disable no-underscore-dangle */
import { AssetEntity } from '@entities/asset/asset-entity';
import { UserEntity } from '@entities/user/user-entity';
import { PositionEntity } from '@entities/position/position-entity';

export class UserPositionEntity extends PositionEntity {
  private _id : number;

  constructor(
    asset: AssetEntity,
    user: UserEntity,
    quantity: number,
    date: Date,
    price: number | undefined,
    averageBuyPrice: number | undefined,
    investmentValue: number | undefined,
    id: number | undefined,
  ) {
    super(asset, user, quantity, date, price, averageBuyPrice, investmentValue);
    this.id = id;
  }

  get id() {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }
}

export default UserPositionEntity;
