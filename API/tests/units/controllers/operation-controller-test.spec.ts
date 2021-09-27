import { OperationController } from 'src/application/controllers/operation-controller';
import { OperationEntity } from '@entities/operation';
import { AssetEntity } from '@entities/asset';
import { ISubmitOperationInput, ISubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-interfaces';
import CustomError from '@domain-error/custom-error';

class SubmitOperationMock implements ISubmitOperationUseCase {
  private asset: AssetEntity;

  constructor() {
    this.asset = {
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
      asset: this.asset,
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

  it('Should execute the submission successfully', async () => {
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
      asset: {
        id: 1,
        code: 'TEST11',
        category: 'stock',
        logo: '',
        social: '',
      },
    });
  });

  it('Should return an error response when there is any error', async () => {
    let error: CustomError;
    submitOperationMock.submit = jest.fn(() => { throw new CustomError('FAKE_ERROR', 'message'); });

    try {
      await operationController.submit({
        header: [],
        params: [],
        body: [],
      });
    } catch (e) {
      error = e;
    }

    expect(error.status).toEqual('FAKE_ERROR');
  });
});
