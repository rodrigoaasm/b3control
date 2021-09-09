import { OperationEntity } from '@entities/operation/operation-entity';

export interface IOperationRepository {
  save(entity: OperationEntity): Promise<OperationEntity>;
}
