import { EntityConstructionError } from '@domain-error/custom-error';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';
import { AssetEntity } from '@entities/asset/';
import { UserEntity } from '@entities/user';
import { OperationEntity } from './operation-entity';
import { OperationType } from './operation-type';

export class OperationFactory implements IOperationFactory {
  constructor(private dateValidatorAdapter: IDateValidatorAdapter) {

  }

  make(
    value : number,
    quantity : number,
    type : OperationType,
    asset : AssetEntity,
    user: UserEntity,
    createdAt: Date | string,
    id : number | undefined = undefined,
  ) : OperationEntity {
    if (!createdAt || !this.dateValidatorAdapter.validate(createdAt)) {
      throw EntityConstructionError('It was not possible create the operation object!\n Date is invalid.');
    }

    const validCreatedAt = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

    return new OperationEntity(id, value, quantity, type, asset, user, validCreatedAt);
  }
}

export default OperationFactory;
