import { OperationEntity } from '@entities/operation/';

import { IOperationRepository } from '@domain-ports/repositories/ioperation-repository';
import { IPaperRepository } from '@domain-ports/repositories/ipaper-repository';
import { IOperationFactory } from '@domain-ports/factories/ioperation-factory';

import { ISubmitOperationInput, ISubmitOperationUseCase } from './submit-operation-interfaces';

export class SubmitOperationUseCase implements ISubmitOperationUseCase {
  constructor(
    private operationRepository: IOperationRepository,
    private paperRepository: IPaperRepository,
    private operationFactory: IOperationFactory,
  ) {
  }

  public async submit(submitOperationInput: ISubmitOperationInput) : Promise<OperationEntity> {
    const {
      value, quantity, type, paperCode, createdAt,
    } = submitOperationInput;
    const paper = await this.paperRepository.findByCode(paperCode);
    if (!paper) throw new Error('Paper not found');

    const operation = this.operationFactory.make(value, quantity, type, paper, createdAt);
    const submitedOperation = await this.operationRepository.save(operation);
    return submitedOperation;
  }
}

export default SubmitOperationUseCase;
