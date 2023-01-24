/* eslint-disable class-methods-use-this */
import { IUnitOfWorkFactory } from '@domain-ports/factories/unit-of-work-factory-interface';
import { IUnitOfWork } from '@domain-ports/unit-work-interface';

import { RelationalUnitOfWork } from '@external/datasource/relational/relational-unit-of-work';
import { Connection } from 'typeorm';

export class RelationalUnitOfWorkFactory implements IUnitOfWorkFactory {
  constructor(private connection: Connection) {

  }

  make(): IUnitOfWork {
    return new RelationalUnitOfWork(this.connection);
  }
}

export default RelationalUnitOfWorkFactory;
