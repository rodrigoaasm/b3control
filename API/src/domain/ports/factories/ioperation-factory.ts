import { OperationEntity, OperationType } from '@entities/operation';
import { PaperEntity } from '@entities/paper';

export interface IOperationFactory {
  make(value : number, quantity : number, type : OperationType,
    paper : PaperEntity, createdAt: Date | string, id ?: number | undefined)
  : OperationEntity;
}
