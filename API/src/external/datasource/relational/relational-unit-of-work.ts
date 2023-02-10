/* eslint-disable class-methods-use-this */
import { DatabaseError } from '@domain-error/custom-error';
import { IOperationRepository } from '@domain-ports/repositories/operation-repository-interface';
import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { IUnitOfWork } from '@domain-ports/unit-work-interface';
import { Connection, EntityManager } from 'typeorm';
import { ITypeORMRepository } from './repositories/typeorm-repositories-interface';

export class RelationalUnitOfWork implements IUnitOfWork {
  constructor(
    private connection: Connection,
    private operationRepository: IOperationRepository & ITypeORMRepository,
    private positionRepository: IPositionRepository & ITypeORMRepository,
  ) {

  }

  async runTransaction(work: Function): Promise<void> {
    try {
      await this.connection.manager.transaction(async (transactionManager: EntityManager) => {
        this.reinjectTransactionManagerInRepositories(transactionManager);

        await work();
      });
    } catch (error) {
      throw DatabaseError('There is an error in transaction');
    } finally {
      this.reinjectTransactionManagerInRepositories(this.connection.manager);
    }
  }

  private reinjectTransactionManagerInRepositories(transactionManager: EntityManager) {
    this.operationRepository.setTransactionManager(
      transactionManager,
    );

    this.positionRepository.setTransactionManager(
      transactionManager,
    );
  }

  public getOperationRepository(): IOperationRepository {
    return this.operationRepository;
  }

  public getPositionRepository(): IPositionRepository {
    return this.positionRepository;
  }

  public async kill() {
    this.connection.close();
  }
}

export default RelationalUnitOfWork;
