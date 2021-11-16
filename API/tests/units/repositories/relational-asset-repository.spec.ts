import { AssetRepository } from '@external/datasource/relational/repositories/asset-repository';

const mockParentRepository = {
  findOne: jest.fn(),
};

const connectionMock = {
  getRepository: () => mockParentRepository,
};

describe('Relational - Asset Repository', () => {
  let assetRepository: AssetRepository;

  beforeEach(async () => {
    assetRepository = new AssetRepository(connectionMock as any);
  });

  it('Should retrieve the asset when the asset code exist in the database', async () => {
    const stock = {
      id: 1,
      code: 'TEST11',
      social: 'Teste',
      logo: '',
      category: 'stock',
    };
    mockParentRepository.findOne.mockReturnValueOnce(stock);
    const retrievedAsset = await assetRepository.findByCode(stock.code);

    expect(retrievedAsset.category).toEqual(stock.category);
    expect(retrievedAsset.code).toEqual(stock.code);
    expect(retrievedAsset.id).toEqual(stock.id);
    expect(retrievedAsset.logo).toEqual(stock.logo);
    expect(retrievedAsset.social).toEqual(stock.social);
  });

  it('Should retrieve the asset when the asset code exist in the database', async () => {
    mockParentRepository.findOne.mockReturnValueOnce(undefined);
    const retrievedAsset = await assetRepository.findByCode('TEST4');

    expect(retrievedAsset).toBeNull();
  });
});
