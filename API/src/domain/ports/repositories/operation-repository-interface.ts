import { OperationEntity } from '@entities/operation/operation-entity';

export interface IOperationRepository {
  save (operation: OperationEntity): Promise<OperationEntity>;
}
