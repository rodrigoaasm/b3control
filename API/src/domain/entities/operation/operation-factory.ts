import { ConstructorEntityError } from '@domain-error/custom-error';
import { IDateValidatorAdapter } from '@domain-ports/adapters/idate-validator-adapter';
import { IOperationFactory } from '@domain-ports/factories/ioperation-factory';
import { AssetEntity } from '@entities/asset/';
import { OperationEntity } from './operation-entity';
import { OperationType } from './operation-type';

export class OperationFactory implements IOperationFactory {
  constructor(private dateValidatorAdapter: IDateValidatorAdapter) {

  }

  make(value : number, quantity : number, type : OperationType,
    asset : AssetEntity, createdAt: Date | string, id : number | undefined = undefined)
    : OperationEntity {
    if (!Number(value) || Number(value) < 0) {
      throw ConstructorEntityError("It was not possible create the operation object!\n The value of the field 'value' is not accept");
    }
    if (!Number(quantity) || Number(quantity) < 0) {
      throw ConstructorEntityError("It was not possible create the operation object!\n The value of the field 'quantity' is not accept");
    }
    if (type !== 'sale' && type !== 'buy') {
      throw ConstructorEntityError("It was not possible create the operation object!\n The type is invalid! Expect 'buy' or 'sale'.");
    }
    if (!asset) {
      throw ConstructorEntityError('It was not possible create the operation object!\n Stock not found.');
    }
    if (!createdAt || !this.dateValidatorAdapter.validate(createdAt)) {
      throw ConstructorEntityError('It was not possible create the operation object!\n Date is invalid.');
    }

    const operation = {
      id,
      value: Number(value),
      quantity: type === 'sale' ? Number(quantity) * -1 : Number(quantity),
      type,
      asset,
      createdAt: new Date(createdAt),
    };

    return operation;
  }
}

export default OperationFactory;
