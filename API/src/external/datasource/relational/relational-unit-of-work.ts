/* eslint-disable class-methods-use-this */
import { DatabaseError } from '@domain-error/custom-error';
import { IUnitOfWork } from '@domain-ports/unit-work-interface';
import { Connection, EntityManager, QueryRunner } from 'typeorm';

export class RelationalUnitOfWork implements IUnitOfWork {
  private queryRunner: QueryRunner;

  private transactionManager: EntityManager;

  constructor(private connection: Connection) {
    this.queryRunner = this.connection.createQueryRunner();
  }

  async start(): Promise<void> {
    await this.queryRunner.startTransaction();
    this.transactionManager = this.queryRunner.manager;
  }

  async complete(work: () => void): Promise<void> {
    if (!this.transactionManager) {
      throw DatabaseError('Transaction not found');
    }

    try {
      await work();
      this.queryRunner.commitTransaction();
    } catch (error) {
      this.queryRunner.rollbackTransaction();
      throw DatabaseError('There is an error in transaction');
    } finally {
      this.queryRunner.release();
    }
  }
}

export default RelationalUnitOfWork;
