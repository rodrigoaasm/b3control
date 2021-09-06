import DateValidator from '@utils/date-validator-util';
import { PaperEntity } from '@entities/paper/paper-entity';
import { OperationEntity } from './operation-entity';
import { OperationType } from './operation-type';

export class OperationFactory {
  static getInstance(value : number, quatity : number, type : OperationType,
    stock : PaperEntity, createdAt: Date | string, id : number | undefined = undefined)
    : OperationEntity {
    if (!Number(value) || Number(value) < 0) {
      throw new Error("It was not possible create the operation object!\n The value of the field 'value' is not accept");
    }
    if (!Number(quatity) || Number(quatity) < 0) {
      throw new Error("It was not possible create the operation object!\n The value of the field 'qtd' is not accept");
    }
    if (type !== 'sale' && type !== 'buy') {
      throw new Error("It was not possible create the operation object!\n The type is invalid! Expect 'buy' or 'sale'.");
    }
    if (!stock) {
      throw new Error('It was not possible create the operation object!\n Stock not found.');
    }
    if (!createdAt || !DateValidator.validate(createdAt)) {
      throw new Error('It was not possible create the operation object!\n Date is invalid.');
    }

    const operation = {
      id,
      value: Number(value),
      quatity: type === 'sale' ? Number(quatity) * -1 : Number(quatity),
      type,
      stock,
      createdAt: new Date(createdAt),
    };

    return operation;
  }
}

export default OperationFactory;
