import { DividendPaymentEntity } from '@entities/dividend-payment';

export interface IDividendPaymentRepository {
  save (payment: DividendPaymentEntity): Promise<DividendPaymentEntity>;

  getDividendPaymentsByMonth(
    userId: string,
    codes: Array<string>,
    begin: Date | undefined,
    end: Date | undefined,
  ): Promise<Array<any>>;
}
