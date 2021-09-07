import { IDateValidatorAdapter } from '@domain-ports/adapters/idate-validator-adapter';
import { IOperationFactory } from '@domain-ports/factories/ioperation-factory';
import { PaperEntity } from '@entities/paper/paper-entity';
import { OperationEntity } from './operation-entity';
import { OperationType } from './operation-type';

export class OperationFactory implements IOperationFactory {
  constructor(private dateValidatorAdapter: IDateValidatorAdapter) {

  }

  make(value : number, quantity : number, type : OperationType,
    paper : PaperEntity, createdAt: Date | string, id : number | undefined = undefined)
    : OperationEntity {
    if (!Number(value) || Number(value) < 0) {
      throw new Error("It was not possible create the operation object!\n The value of the field 'value' is not accept");
    }
    if (!Number(quantity) || Number(quantity) < 0) {
      throw new Error("It was not possible create the operation object!\n The value of the field 'qtd' is not accept");
    }
    if (type !== 'sale' && type !== 'buy') {
      throw new Error("It was not possible create the operation object!\n The type is invalid! Expect 'buy' or 'sale'.");
    }
    if (!paper) {
      throw new Error('It was not possible create the operation object!\n Stock not found.');
    }
    if (!createdAt || !this.dateValidatorAdapter.validate(createdAt)) {
      throw new Error('It was not possible create the operation object!\n Date is invalid.');
    }

    const operation = {
      id,
      value: Number(value),
      quantity: type === 'sale' ? Number(quantity) * -1 : Number(quantity),
      type,
      paper,
      createdAt: new Date(createdAt),
    };

    return operation;
  }
}

export default OperationFactory;
