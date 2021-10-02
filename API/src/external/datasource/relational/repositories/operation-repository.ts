import { IOperationRepository } from '@domain-ports/repositories/operation-repository-interface';
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';
import { OperationEntity } from '@entities/operation';
import { getRepository, Repository } from 'typeorm';
import { OperationModel } from '@external/datasource/relational/models';

export class OperationRepository implements IOperationRepository {
  private repo: Repository<OperationModel>;

  constructor(private operationFactory: IOperationFactory) {
    this.repo = getRepository(OperationModel);
  }

  // eslint-disable-next-line class-methods-use-this
  async save(operation: OperationEntity): Promise<OperationEntity> {
    const entity: OperationModel = {
      ...operation,
    };

    const {
      value, id, quantity, type, createdAt,
    } = await this.repo.save(entity);

    return this.operationFactory.make(
      value, Math.abs(quantity), type, operation.asset, createdAt, id,
    );
  }
}

export default OperationRepository;
