import { IDividendPaymentRepository } from '@domain-ports/repositories/dividend-payment-repository-interface';
import { DividendPaymentEntity } from '@entities/dividend-payment';

export default class DividendPaymentRepositoryMock implements IDividendPaymentRepository {
  private items = [];

  public save(payment: DividendPaymentEntity): Promise<DividendPaymentEntity> {
    const tmpPayment = payment;
    tmpPayment.id = this.items.length + 1;
    this.items.push(tmpPayment);
    return Promise.resolve(tmpPayment);
  }
}
