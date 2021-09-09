import { IOperationRepository } from '@domain-ports/repositories/ioperation-repository';
import { OperationEntity } from '@entities/operation/operation-entity';

export default class OperationRepositoryMock implements IOperationRepository {
  private items = [];

  public save(operation: OperationEntity): Promise<OperationEntity> {
    const tmpOperation = operation;
    tmpOperation.id = this.items.length + 1;
    this.items.push(tmpOperation);
    return Promise.resolve(tmpOperation);
  }
}
