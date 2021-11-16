import { AssetEntity } from '@entities/asset';
import { PositionEntity } from '@entities/position/position-entity';

export interface IPositionFactory {
  make(asset: AssetEntity, quantity : number, price : number,
    date : Date): PositionEntity;
}
