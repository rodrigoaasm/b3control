import { IOperationRepository } from './repositories/operation-repository-interface';
import { IPositionRepository } from './repositories/position-repository-interface';

export interface IUnitOfWork {
  runTransaction(work: Function): Promise<void>;

  getOperationRepository(): IOperationRepository;
  getPositionRepository(): IPositionRepository;

  kill(): void;
}
