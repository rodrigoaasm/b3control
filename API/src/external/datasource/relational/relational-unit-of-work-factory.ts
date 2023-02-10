/* eslint-disable class-methods-use-this */
import { DatabaseError } from '@domain-error/custom-error';
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { IUnitOfWorkFactory } from '@domain-ports/factories/unit-of-work-factory-interface';
import { IUnitOfWork } from '@domain-ports/unit-work-interface';

import { RelationalUnitOfWork } from '@external/datasource/relational/relational-unit-of-work';
import { Connection } from 'typeorm';
import { OperationRepository } from './repositories/operation-repository';
import { PositionRepository } from './repositories/position-repository';

export class RelationalUnitOfWorkFactory implements IUnitOfWorkFactory {
  constructor(
    private connection: Connection,
    private operationFactory: IOperationFactory,
    private positionFactory: IPositionFactory,
  ) {
  }

  make(): IUnitOfWork {
    try {
      const operationRepository = new OperationRepository(this.connection, this.operationFactory);
      const positionRepository = new PositionRepository(this.connection, this.positionFactory);

      return new RelationalUnitOfWork(
        this.connection,
        operationRepository,
        positionRepository,
      );
    } catch (error) {
      throw DatabaseError('Database connection error');
    }
  }
}

export default RelationalUnitOfWorkFactory;
