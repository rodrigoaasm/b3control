import { EntityConstructionError } from '@domain-error/custom-error';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { IPositionFactory, IPositionFactoryMakeInput } from '@domain-ports/factories/position-factory-interface';
import { PositionEntity } from './position-entity';
import { UserPositionEntity } from './user-position-entity';

export class PositionFactory implements IPositionFactory {
  constructor(private dateValidatorAdapter: IDateValidatorAdapter) {

  }

  make<T extends PositionEntity>(input: IPositionFactoryMakeInput): T {
    const {
      clazzName,
      asset,
      user,
      quantity,
      date,
      averageBuyPrice,
      investmentValue,
      price,
      id,
    } = input;

    if (!date || !this.dateValidatorAdapter.validate(date)) {
      throw EntityConstructionError('It was not possible create the position object!\n Date is invalid.');
    }

    const validDate = typeof date === 'string' ? new Date(date) : date;
    const validAverageBuyPrice = !Number.isNaN(Number(averageBuyPrice))
      ? Number(averageBuyPrice) : 0;
    const validInvestmentValue = !Number.isNaN(Number(investmentValue))
      ? Number(investmentValue) : 0;

    if (Number.isNaN(Number(price)) || price < 0) {
      throw EntityConstructionError('It was not possible create the position time object!\n Price is invalid.');
    }

    if (clazzName === 'UserPositionEntity') {
      return new UserPositionEntity(
        asset,
        user,
        Number(quantity),
        validDate as Date,
        price,
        validAverageBuyPrice,
        validInvestmentValue,
        id,
      ) as unknown as T;
    }

    return new PositionEntity(
      asset,
      user,
      Number(quantity),
      validDate as Date,
      price,
      validAverageBuyPrice,
      validInvestmentValue,
    ) as T;
  }
}

export default PositionFactory;
