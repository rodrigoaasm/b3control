import { OperationController } from '@controllers/operation-controller';
import { OperationEntity } from '@entities/operation';
import { PaperEntity } from '@entities/paper';
import { ISubmitOperationInput, ISubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-interfaces';

class SubmitOperationMock implements ISubmitOperationUseCase {
  private paper: PaperEntity;

  constructor() {
    this.paper = {
      id: 1,
      code: 'TEST11',
      category: 'stock',
      logo: '',
      social: '',
    };
  }

  async submit(submitOperationInput: ISubmitOperationInput): Promise<OperationEntity> {
    return {
      ...(submitOperationInput),
      paper: this.paper,
      createdAt: new Date(submitOperationInput.createdAt),
    };
  }
}

describe('Operation Controller', () => {
  let operationController: OperationController;
  let submitOperationMock: SubmitOperationMock;

  beforeEach(() => {
    submitOperationMock = new SubmitOperationMock();
    operationController = new OperationController(submitOperationMock);
  });

  it('Should', async () => {
    const date = new Date();

    const response = await operationController.submit({
      header: [],
      params: [],
      body: {
        createdAt: date,
      },
    });

    expect(response.code).toEqual(201);
    expect(response.body).toEqual({
      createdAt: date,
      paper: {
        id: 1,
        code: 'TEST11',
        category: 'stock',
        logo: '',
        social: '',
      },
    });
  });

  it('Should', async () => {
    submitOperationMock.submit = jest.fn(() => { throw new Error('message'); });

    const response = await operationController.submit({
      header: [],
      params: [],
      body: [],
    });

    expect(response.code).toEqual(500);
    expect(response.body).toEqual({
      error: 'message',
    });
  });
});
