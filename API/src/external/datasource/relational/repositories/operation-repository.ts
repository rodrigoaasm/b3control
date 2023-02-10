import { IOperationRepository } from '@domain-ports/repositories/operation-repository-interface';
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';
import { OperationEntity } from '@entities/operation';
import { Connection, EntityManager, Repository } from 'typeorm';
import { OperationModel } from '@external/datasource/relational/models';
import { UserEntity } from '@entities/user';
import { ITypeORMRepository } from './typeorm-repositories-interface';

export class OperationRepository implements IOperationRepository, ITypeORMRepository {
  private repo: Repository<OperationModel>;

  constructor(connection: Connection, private operationFactory: IOperationFactory) {
    this.repo = connection.getRepository(OperationModel);
  }

  setTransactionManager(transactionManager: EntityManager) {
    this.repo = transactionManager.getRepository(OperationModel);
  }

  async save(operation: OperationEntity): Promise<OperationEntity> {
    const entity: OperationModel = {
      asset: operation.asset,
      type: operation.type,
      value: operation.value,
      quantity: operation.quantity,
      user: {
        id: operation.user.id,
        name: operation.user.name,
        createdAt: operation.user.createdAt,
        updatedAt: operation.user.updatedAt,
      },
      createdAt: operation.createdAt,
    };

    const {
      value, id, quantity, type, user: userModel, createdAt,
    } = await this.repo.save(entity);

    const userEntity = new UserEntity(
      userModel.id,
      userModel.name,
      userModel.createdAt,
      userModel.updatedAt,
    );

    return this.operationFactory.make(
      value, Math.abs(quantity), type, operation.asset, userEntity, createdAt, id,
    );
  }
}

export default OperationRepository;
