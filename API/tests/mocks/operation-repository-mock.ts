import { IOperationRepository } from '@domain-ports/repositories/operation-repository-interface';
import { OperationEntity } from '@entities/operation/operation-entity';

export default class OperationRepositoryMock implements IOperationRepository {
  private items = [];

  setTransactionManager = jest.fn();

  public save(operation: OperationEntity): Promise<OperationEntity> {
    const tmpOperation = operation;
    tmpOperation.id = this.items.length + 1;
    this.items.push(tmpOperation);
    return Promise.resolve(tmpOperation);
  }
}
