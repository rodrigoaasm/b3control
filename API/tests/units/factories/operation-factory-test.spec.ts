import { OperationFactory } from '@entities/operation/';
import { AssetCategory, AssetEntity } from '@entities/asset';

const mockDateValidatorUtil = {
  validate: jest.fn(),
  isTimeInterval: jest.fn(),
};

describe('Operation Factory', () => {
  let stock: AssetEntity;
  let date: Date;
  let operationFactory: OperationFactory;

  beforeEach(() => {
    stock = new AssetEntity(1, 'TEST11', 'Test', '', 'stock');
    date = new Date();

    operationFactory = new OperationFactory(mockDateValidatorUtil);
  });

  it('Should register a buy operation with the positive _value', async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const operation = operationFactory.make(15.95, 200, 'buy', stock, date, 1);

    expect(operation).toEqual({
      _id: 1,
      _value: 15.95,
      _quantity: 200,
      _type: 'buy',
      _asset: {
        _category: 'stock' as AssetCategory,
        _id: 1,
        _code: 'TEST11',
        _social: 'Test',
        _logo: '',
      },
      _createdAt: date,
    });
  });

  it("Should parse the date string for the date _type when the value of the field '_createdAt' is a date string.", async () => {
    mockDateValidatorUtil.validate.mockReturnValueOnce(true);
    const operation = operationFactory.make(15.95, 200, 'buy', stock, '2020-09-01T13:00:00.000Z', 1);

    expect(operation).toEqual({
      _id: 1,
      _value: 15.95,
      _quantity: 200,
      _type: 'buy',
      _asset: {
        _category: 'stock' as AssetCategory,
        _id: 1,
        _code: 'TEST11',
        _social: 'Test',
        _logo: '',
      },
      _createdAt: new Date('2020-09-01T13:00:00.000Z'),
    });
  });

  it('Should throw an error when _createdAt is invalid', async () => {
    let error;
    mockDateValidatorUtil.validate.mockReturnValueOnce(false);

    try {
      operationFactory.make(15.95, 200, 'buy', stock, 'invalid', 1);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error?.name).toBe('Error');
  });
});
