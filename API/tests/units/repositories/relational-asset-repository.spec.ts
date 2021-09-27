import {
  Connection, createConnection,
} from 'typeorm';

import config from '@test-setup/typeorm-setup';
import { AssetRepository } from '@external/datasource/relational/repositories/asset-repository';
import { PostgresMockDataSetup } from '@test-setup/postgres-mock-data';

describe('Relational - Asset Repository', () => {
  let connection: Connection;
  let setup: PostgresMockDataSetup;
  let assetRepository: AssetRepository;
  let asset: any;

  beforeAll(async () => {
    connection = await createConnection(config);
    setup = new PostgresMockDataSetup(connection);

    const assets = await setup.load();
    [asset] = assets;
  });

  beforeEach(async () => {
    assetRepository = new AssetRepository();
  });

  afterAll(async () => {
    try {
      await setup.clear();
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
