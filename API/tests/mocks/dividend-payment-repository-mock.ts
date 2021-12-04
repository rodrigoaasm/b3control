import { IDividendPaymentRepository } from '@domain-ports/repositories/dividend-payment-repository-interface';
import { AssetEntity } from '@entities/asset';
import { DividendPaymentEntity } from '@entities/dividend-payment';

export default class DividendPaymentRepositoryMock implements IDividendPaymentRepository {
  private items = [];

  private assets: Array<AssetEntity> = [
    new AssetEntity(1, 'TEST11', '', '', 'stock'),
    new AssetEntity(2, 'TEST4', '', '', 'stock'),
    new AssetEntity(3, 'TEST3', '', '', 'general'),
  ];

  private payments: Array<any> = [
    {
      code: this.assets[0].code, category: this.assets[0].category, month: new Date('2021-01-31T00:00:00.000Z'), value: 5.00,
    },
    {
      code: this.assets[0].code, category: this.assets[0].category, month: new Date('2021-02-28T00:00:00.000Z'), value: 5.00,
    },
    {
      code: this.assets[0].code, category: this.assets[0].category, month: new Date('2021-03-30T00:00:00.000Z'), value: 5.00,
    },
    {
      code: this.assets[1].code, category: this.assets[1].category, month: new Date('2021-01-31T00:00:00.000Z'), value: 7.00,
    },
    {
      code: this.assets[1].code, category: this.assets[1].category, month: new Date('2021-02-28T00:00:00.000Z'), value: 0.00,
    },
    {
      code: this.assets[1].code, category: this.assets[1].category, month: new Date('2021-03-30T00:00:00.000Z'), value: 7.00,
    },
    {
      code: this.assets[2].code, category: this.assets[2].category, month: new Date('2021-01-31T00:00:00.000Z'), value: 0.00,
    },
    {
      code: this.assets[2].code, category: this.assets[2].category, month: new Date('2021-02-28T00:00:00.000Z'), value: 0.00,
    },
    {
      code: this.assets[2].code, category: this.assets[2].category, month: new Date('2021-03-30T00:00:00.000Z'), value: 0.00,
    },
  ];

  public save(payment: DividendPaymentEntity): Promise<DividendPaymentEntity> {
    const tmpPayment = payment;
    tmpPayment.id = this.items.length + 1;
    this.items.push(tmpPayment);
    return Promise.resolve(tmpPayment);
  }

  getDividendPaymentsByMonth(codes: string[], begin: Date, end: Date): Promise<any[]> {
    return Promise.resolve(
      this.payments.filter((payment: any): boolean => (
        (!codes || codes.length === 0 || codes.includes(payment.code))
          && (!begin || payment.month >= begin)
          && (!end || payment.month <= end)
      )),
    );
  }
}
