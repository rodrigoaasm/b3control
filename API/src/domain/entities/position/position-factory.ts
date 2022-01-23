import { EntityConstructionError } from '@domain-error/custom-error';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { AssetEntity } from '@entities/asset';
import { UserEntity } from '@entities/user';
import { PositionEntity } from './position-entity';

export class PositionFactory implements IPositionFactory {
  constructor(private dateValidatorAdapter: IDateValidatorAdapter) {

  }

  public make(
    asset: AssetEntity,
    user: UserEntity,
    quantity: number,
    price: number,
    date: Date | string,
    id: number | undefined = undefined,
  ) : PositionEntity {
    if (!date || !this.dateValidatorAdapter.validate(date)) {
      throw EntityConstructionError('It was not possible create the position object!\n Date is invalid.');
    }

    const validDate = typeof date === 'string' ? new Date(date) : date;

    const position = new PositionEntity(
      asset,
      user,
      Number(quantity),
      Number(price),
      validDate as Date,
      id,
    );
    return position;
  }
}

export default PositionFactory;
