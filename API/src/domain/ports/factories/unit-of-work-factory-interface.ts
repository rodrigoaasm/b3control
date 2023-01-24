import { IUnitOfWork } from '@domain-ports/unit-work-interface';

export interface IUnitOfWorkFactory {
  make(): IUnitOfWork
}
