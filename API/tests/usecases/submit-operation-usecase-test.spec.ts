import { PaperCategory, PaperEntity } from '@entities/paper/';
import { SubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-usecase';
import { IOperationFactory } from '@domain-ports/factories/ioperation-factory';

import OperationRepositoryMock from '@mocks/operation-repository-mock';
import PaperRepositoryMock from '@mocks/paper-repository-mock';
import { OperationType, OperationEntity } from '@entities/operation';

class OperationFactoryMock implements IOperationFactory {
  constructor(private date: Date) {

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  make(value: number, quantity: number, type: OperationType, paper: PaperEntity,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createdAt: string | Date, id: number)
    : OperationEntity {
    return {
      id: 1,
      value: 15.95,
      quantity: 200,
      type: 'buy',
      paper: {
        id: 1,
        code: 'TEST11',
        social: 'Teste',
        logo: '',
        category: 'stock' as PaperCategory,
      } as PaperEntity,
      createdAt: this.date,
    };
  }
}

describe('Submit Operation Service', () => {
  let submitOperationService : SubmitOperationUseCase;
  let date: Date;

  beforeEach(() => {
    date = new Date();
    submitOperationService = new SubmitOperationUseCase(
      new OperationRepositoryMock(), new PaperRepositoryMock(), new OperationFactoryMock(date),
    );
  });

  it('Should register a operation', async () => {
    const submitedOperation = await submitOperationService.submit({
      value: 15.95,
      quantity: 200,
      type: 'buy',
      paperCode: 'TEST11',
      createdAt: date,
    });

    expect(submitedOperation).toEqual({
      id: 1,
      value: 15.95,
      quantity: 200,
      type: 'buy',
      paper: {
        id: 1,
        code: 'TEST11',
        social: 'Teste',
        logo: '',
        category: 'stock' as PaperCategory,
      } as PaperEntity,
      createdAt: date,
    });
  });

  it('Should throw a error when the paper not found', async () => {
    let error: Error;

    try {
      await submitOperationService.submit({
        value: 15.95,
        quantity: 200,
        type: 'buy',
        paperCode: 'TEST4',
        createdAt: date,
      });
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });
});
