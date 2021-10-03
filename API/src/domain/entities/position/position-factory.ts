import { ConstructorEntityError } from '@domain-error/custom-error';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { AssetEntity } from '@entities/asset';
import { PositionEntity } from './position-entity';

export class PositionFactory implements IPositionFactory {
  constructor(private dateValidatorAdapter: IDateValidatorAdapter) {

  }

  public make(asset: AssetEntity, quantity: number, price: number, date: Date | string)
    : PositionEntity {
    if (!date || !this.dateValidatorAdapter.validate(date)) {
      throw ConstructorEntityError('It was not possible create the position object!\n Date is invalid.');
    }

    const validDate = typeof date === 'string' ? new Date(date) : date;

    const position = new PositionEntity(asset, quantity, price, validDate as Date);
    return position;
  }
}

export default PositionFactory;
