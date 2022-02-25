import { OperationController } from 'src/application/controllers/operation-controller';
import { OperationEntity } from '@entities/operation';
import { AssetEntity } from '@entities/asset';
import { ISubmitOperationInput, ISubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-interfaces';
import CustomError from '@domain-error/custom-error';
import { UserEntity } from '@entities/user';

class SubmitOperationMock implements ISubmitOperationUseCase {
  private asset: AssetEntity;

  private user: UserEntity;

  constructor() {
    this.asset = new AssetEntity(1, 'TEST11', 'Teste', '', 'stock');
  }

  async submit(input: ISubmitOperationInput): Promise<OperationEntity> {
    const date = new Date();
    const user = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);
    return new OperationEntity(
      1, input.value, input.quantity, input.type, this.asset, user, new Date(input.createdAt),
    );
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
      headers: [],
      params: [],
      body: {
        value: 20,
        quantity: 100,
        createdAt: date,
        type: 'buy',
      },
    });

    expect(response.code).toEqual(201);
    expect(response.body).toEqual({
      _createdAt: date,
      _asset: {
        _id: 1,
        _code: 'TEST11',
        _category: 'stock',
        _logo: '',
        _social: 'Teste',
      },
      _id: 1,
      _quantity: 100,
      _type: 'buy',
      _value: 20,
    });
  });

  it('Should return an error response when there is any error', async () => {
    let error: CustomError;
    submitOperationMock.submit = jest.fn(() => { throw new CustomError('FAKE_ERROR', 'message'); });

    try {
      await operationController.submit({
        headers: [],
        params: [],
        body: [],
      });
    } catch (e) {
      error = e;
    }

    expect(error.status).toEqual('FAKE_ERROR');
  });
});
