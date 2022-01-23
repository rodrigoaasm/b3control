import { DividendPaymentEntity } from '@entities/dividend-payment';
import { AssetEntity } from '@entities/asset';
import CustomError from '@domain-error/custom-error';
import { ISubmitDividendPaymentUseCase, ISubmitDividendPaymentInput, ISubmitDividendPaymentOutput } from '@usecases/submit-dividend/submit-dividend-payments-interfaces';
import DividendPaymentController from '@controllers/dividend-payment-controller';
import { UserEntity } from '@entities/user';

const date = new Date();

class SubmitDividendPaymentMock implements ISubmitDividendPaymentUseCase {
  private asset: AssetEntity;

  private user: UserEntity;

  constructor() {
    this.user = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);
    this.asset = new AssetEntity(1, 'TEST11', 'Teste', '', 'stock');
  }

  async submit(input: ISubmitDividendPaymentInput): Promise<ISubmitDividendPaymentOutput> {
    return new DividendPaymentEntity(
      1, this.user, input.value, this.asset, new Date(input.createdAt),
    );
  }
}

describe('Operation Controller', () => {
  let dividendPaymentController: DividendPaymentController;
  let submitDividendPaymentMock: SubmitDividendPaymentMock;

  beforeEach(() => {
    submitDividendPaymentMock = new SubmitDividendPaymentMock();
    dividendPaymentController = new DividendPaymentController(submitDividendPaymentMock);
  });

  it('Should execute the submission successfully', async () => {
    const response = await dividendPaymentController.submit({
      header: [],
      params: [],
      body: {
        value: 2.00,
        createdAt: date,
        asset: 'TEST11',
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
      _user: {
        _id: 'jbfjbkglkbnlknglkb',
        _name: 'user',
        _createdAt: date,
        _updatedAt: date,
      },
      _id: 1,
      _value: 2.00,
    });
  });

  it('Should return an error response when there is any error', async () => {
    let error: CustomError;
    submitDividendPaymentMock.submit = jest.fn(() => { throw new CustomError('FAKE_ERROR', 'message'); });

    try {
      await dividendPaymentController.submit({
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
