import { DividendPaymentEntity } from '@entities/dividend-payment';

export interface IDividendPaymentRepository {
  save (payment: DividendPaymentEntity): Promise<DividendPaymentEntity>;
}
