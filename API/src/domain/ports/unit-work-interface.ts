export interface IUnitOfWork {
  start(): Promise<void>;
  complete(work: () => void): Promise<void>;
}
