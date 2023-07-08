import { AssetEntity } from '@entities/asset';
import { PositionEntity } from '@entities/position/position-entity';
import { UserEntity } from '@entities/user';

export interface IPositionFactoryMakeInput {
  clazzName: 'PositionEntity' | 'UserPositionEntity',
  asset: AssetEntity,
  user: UserEntity,
  quantity: number,
  date: Date | string,
  averageBuyPrice?: number,
  investmentValue?: number,
  price: number,
  id?: number,
}

export interface IPositionFactory {
  make<T extends PositionEntity>(args: IPositionFactoryMakeInput): T;
}
