import { AssetEntity } from '@entities/asset';
import { PositionEntity } from '@entities/position/position-entity';
import { UserEntity } from '@entities/user';

export interface IPositionFactory {
  make(asset: AssetEntity, user: UserEntity, quantity : number, price : number,
    date : Date, averageBuyPrice?: number | undefined, id?: number | undefined): PositionEntity;
}
