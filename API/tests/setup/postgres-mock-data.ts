import { Connection, getRepository, QueryRunner } from 'typeorm';
import { AssetModel, ASSET_TABLE_NAME } from '@external/datasource/relational/models/asset-model';
import { OPERATION_TABLE_NAME } from '@external/datasource/relational/models/operation-model';

export class PostgresMockDataSetup {
  public queryRunner: QueryRunner;

  constructor(private connection: Connection) {
    this.queryRunner = this.connection.createQueryRunner();
  }

  public async load(): Promise<Array<AssetModel>> {
    const assetRepositoryUtilTest = getRepository(AssetModel);

    await this.queryRunner.query(`delete from ${OPERATION_TABLE_NAME}`);
    await this.queryRunner.query(`delete from ${ASSET_TABLE_NAME}`);
    const assets = [
      {
        code: 'TEST11',
        social: 'Teste',
        logo: '',
        category: 'stock',
      },
    ];
    const fakeAssets = await assetRepositoryUtilTest.save(assets);

    return fakeAssets;
  }

  public async clear() {
    try {
      await this.queryRunner.query(`delete from ${OPERATION_TABLE_NAME}`);
      await this.queryRunner.query(`delete from ${ASSET_TABLE_NAME}`);
    // eslint-disable-next-line no-empty
    } catch (error) {}
  }
}

export default {
  PostgresMockDataSetup,
};
