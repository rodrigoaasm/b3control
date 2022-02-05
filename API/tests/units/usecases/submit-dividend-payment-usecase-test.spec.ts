/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssetEntity } from '@entities/asset';

import { IDividendPaymentFactory } from '@domain-ports/factories/dividend-payment-factory-interface';
import { IUserRepository } from '@domain-ports/repositories/user-repository-interface';
import { DividendPaymentEntity } from '@entities/dividend-payment';
import { SubmitDividendPaymentUseCase } from '@usecases/submit-dividend/submit-dividend-payments-usecase';
import DividendPaymentRepositoryMock from '@test-mocks/dividend-payment-repository-mock';
import AssetRepositoryMock from '@test-mocks/asset-repository-mock';
import { UserEntity } from '@entities/user';

class DividendPaymentFactoryMock implements IDividendPaymentFactory {
  constructor(private date: Date) {

  }

  make(
    user: UserEntity, value: number, paper: AssetEntity, createdAt: string | Date, id: number,
  ): DividendPaymentEntity {
    return new DividendPaymentEntity(1, user, 2.00, new AssetEntity(1, 'TEST11', '', '', 'stock'), this.date);
  }
}

const date = new Date();
const user = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);

class UserRepositoryMock implements IUserRepository {
  async findUser(userId: string): Promise<UserEntity> {
    if (userId) {
      return user;
    }

    return undefined;
  }
}

describe('Submit Dividend Payment Use Case', () => {
  let submitDividendPaymentUseCase : SubmitDividendPaymentUseCase;

  beforeEach(() => {
    submitDividendPaymentUseCase = new SubmitDividendPaymentUseCase(
      new DividendPaymentRepositoryMock(),
      new AssetRepositoryMock(),
      new UserRepositoryMock(),
      new DividendPaymentFactoryMock(date),
    );
  });

  it('Should register an dividend payment', async () => {
    const submitedPayment = await submitDividendPaymentUseCase.submit({
      userId: user.id,
      value: 15.95,
      assetCode: 'TEST11',
      createdAt: date,
    });

    expect(submitedPayment.id).toEqual(1);
    expect(submitedPayment.value).toEqual(2.00);
    expect(submitedPayment.asset.id).toEqual(1);
    expect(submitedPayment.asset.code).toEqual('TEST11');
    expect(submitedPayment.asset.social).toEqual('');
    expect(submitedPayment.asset.logo).toEqual('');
    expect(submitedPayment.asset.category).toEqual('stock');
    expect(submitedPayment.createdAt).toEqual(date);
    expect(submitedPayment.user).toEqual(user);
  });

  it('Should throw an error when the asset not found', async () => {
    let error: Error;

    try {
      await submitDividendPaymentUseCase.submit({
        userId: user.id,
        value: 15.95,
        assetCode: 'TEST4',
        createdAt: date,
      });
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.message).toBe('Asset not found');
  });

  it('Should throw an error when the user not found', async () => {
    let error: Error;

    try {
      await submitDividendPaymentUseCase.submit({
        userId: undefined,
        value: 15.95,
        assetCode: 'TEST11',
        createdAt: date,
      });
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.message).toEqual('User not found');
  });

  it('Should throw an error when required attributes are not entered', async () => {
    let error: Error;

    try {
      await submitDividendPaymentUseCase.submit({} as any);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });
});
