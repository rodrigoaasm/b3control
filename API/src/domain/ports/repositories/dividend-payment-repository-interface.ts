import { DividendPaymentEntity } from '@entities/dividend-payment';
import { UserEntity } from '@entities/user';

export interface IDividendPaymentRepository {
  save (payment: DividendPaymentEntity): Promise<DividendPaymentEntity>;

  getDividendPaymentsByMonth(
    user: UserEntity,
    codes: Array<string>,
    begin: Date | undefined,
    end: Date | undefined,
  ): Promise<Array<any>>;
}
