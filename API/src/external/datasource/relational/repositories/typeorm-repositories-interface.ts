import { EntityManager } from 'typeorm';

export interface ITypeORMRepository {
  setTransactionManager(transactionManager: EntityManager): void;
}
