import { AssetRepository } from '@external/datasource/relational/repositories/asset-repository';

const mockParentRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
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

  it('Should retrieve list of all assets', async () => {
    const stocks = [
      {
        id: 1,
        code: 'TEST11',
        social: 'Teste',
        logo: '',
        category: 'stock',
      },
      {
        id: 2,
        code: 'TEST4',
        social: 'Teste',
        logo: '',
        category: 'stock',
      },
    ];
    mockParentRepository.find.mockReturnValueOnce(stocks);
    const retrievedAssets = await assetRepository.listAll();

    expect(retrievedAssets).toHaveLength(2);
  });
});
