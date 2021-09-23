import {
  Connection, createConnection, QueryRunner, getRepository, Repository,
} from 'typeorm';

import config from '@test-setup/typeorm-setup';
import { AssetModel, ASSET_TABLE_NAME } from '@external/datasource/relational/models/asset-model';
import { AssetRepository } from '@external/datasource/relational/repositories/asset-repository';

describe('Relational - Asset Repository', () => {
  let connection: Connection;
  let assetRepositoryUtilTest: Repository<AssetModel>;
  let queryRunner: QueryRunner;
  let asset: any;
  let assetRepository: AssetRepository;

  beforeEach(async () => {
    connection = await createConnection(config);
    queryRunner = connection.createQueryRunner();
    assetRepositoryUtilTest = getRepository(AssetModel);

    await queryRunner.query(`delete from ${ASSET_TABLE_NAME}`);
    asset = {
      code: 'TEST11',
      social: 'Teste',
      logo: '',
      category: 'stock',
    };
    asset = await assetRepositoryUtilTest.save(asset);

    assetRepository = new AssetRepository();
  });

  afterEach(async () => {
    try {
      await queryRunner.query(`delete from ${ASSET_TABLE_NAME}`);
      await connection.close();
    // eslint-disable-next-line no-empty
    } catch (error) {}
  });

  it('Should retrieve the asset when the asset code exist in the database', async () => {
    const retrievedAsset = await assetRepository.findByCode(asset.code);

    expect(retrievedAsset).toEqual({
      ...asset,
    });
  });

  it('Should retrieve the asset when the asset code exist in the database', async () => {
    const retrievedAsset = await assetRepository.findByCode('TEST4');

    expect(retrievedAsset).toBeNull();
  });
});
