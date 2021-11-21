/* eslint-disable no-empty */
import {
  Connection,
  ConnectionOptions, createConnection, getRepository, QueryRunner, Repository,
} from 'typeorm';
import * as dotenv from 'dotenv';

import { AssetModel, ASSET_TABLE_NAME } from '@external/datasource/relational/models/asset-model';
import { OperationModel, OPERATION_TABLE_NAME } from '@external/datasource/relational/models/operation-model';
import { AssetQuoteModel, ASSET_QUOTE_TABLE_NAME } from '@external/datasource/relational/models/asset-quote-model';
import { DIVIDEND_PAYMENT_TABLE_NAME } from '@external/datasource/relational/models/dividend-payment-model';

import entities from '@external/datasource/relational/models';

dotenv.config();

export class PostgresDataSetup {
  private connection: Connection;

  private queryRunner: QueryRunner;

  private assetRepositoryTest: Repository<AssetModel>;

  private operationRepositoryTest: Repository<OperationModel>;

  private assetQuoteRepositoryTest: Repository<AssetQuoteModel>;

  private registeredAssets: Map<string, AssetModel>;

  constructor() {
    this.registeredAssets = new Map();
  }

  public async init() {
    const connectionOptions : ConnectionOptions = {
      name: 'default',
      type: 'postgres',
      host: process.env.DB_TEST_HOST,
      port: Number(process.env.DB_TEST_PORT),
      username: process.env.DB_TEST_USER,
      password: process.env.DB_TEST_PASSWORD,
      database: process.env.DB_TEST_NAME,
      entities,
    };
    this.connection = await createConnection(connectionOptions);
    this.queryRunner = this.connection.createQueryRunner();
  }

  public getConnection(): Connection {
    return this.connection;
  }

  public async up(): Promise<void> {
    this.assetRepositoryTest = getRepository(AssetModel);
    this.operationRepositoryTest = getRepository(OperationModel);
    this.assetQuoteRepositoryTest = getRepository(AssetQuoteModel);
    try {
      await this.down();
    } catch (error) {
    }

    const listRegisteredAssets = await this.assetRepositoryTest.save(this.assets());
    listRegisteredAssets.forEach((asset) => {
      this.registeredAssets.set(asset.code, asset);
    });

    await this.operationRepositoryTest.save(this.operations());
    await this.assetQuoteRepositoryTest.save(this.assetQuotes());
  }

  public async down(): Promise<void> {
    await this.queryRunner.query(`delete from ${DIVIDEND_PAYMENT_TABLE_NAME}`);
    await this.queryRunner.query(`delete from ${ASSET_QUOTE_TABLE_NAME}`);
    await this.queryRunner.query(`delete from ${OPERATION_TABLE_NAME}`);
    await this.queryRunner.query(`delete from ${ASSET_TABLE_NAME}`);
  }

  public async finish(): Promise<void> {
    await this.connection.close();
  }

  // eslint-disable-next-line class-methods-use-this
  private assets(): Array<Omit<AssetModel, 'id'>> {
    return [
      {
        code: 'TEST11',
        social: 'Teste',
        logo: '',
        category: 'general',
      },
      {
        code: 'TEST4',
        social: 'Teste',
        logo: '',
        category: 'stock',
      },
      {
        code: 'TEST3',
        social: 'Teste',
        logo: '',
        category: 'stock',
      },
    ];
  }

  private operations(): Array<Omit<OperationModel, 'id'>> {
    return [
      {
        asset: this.registeredAssets.get('TEST11'),
        createdAt: new Date('2020-01-01T13:00:00.000Z'),
        quantity: 80,
        type: 'buy',
        value: 10.00,
      },
      {
        asset: this.registeredAssets.get('TEST11'),
        createdAt: new Date('2020-02-02T13:00:00.000Z'),
        quantity: -40,
        type: 'sale',
        value: 15.00,
      },
      {
        asset: this.registeredAssets.get('TEST11'),
        createdAt: new Date('2020-03-02T13:00:00.000Z'),
        quantity: -40,
        type: 'sale',
        value: 15.00,
      },
      {
        asset: this.registeredAssets.get('TEST4'),
        createdAt: new Date('2020-02-01T13:00:00.000Z'),
        quantity: 100,
        type: 'buy',
        value: 10.00,
      },
      {
        asset: this.registeredAssets.get('TEST4'),
        createdAt: new Date('2020-03-02T13:00:00.000Z'),
        quantity: -40,
        type: 'sale',
        value: 15.00,
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        createdAt: new Date('2020-01-02T13:00:00.000Z'),
        quantity: 40,
        type: 'buy',
        value: 15.00,
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        createdAt: new Date('2020-02-02T13:00:00.000Z'),
        quantity: 40,
        type: 'buy',
        value: 15.00,
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        createdAt: new Date('2020-03-02T13:00:00.000Z'),
        quantity: -40,
        type: 'sale',
        value: 15.00,
      },
    ];
  }

  private assetQuotes(): Array<Omit<AssetQuoteModel, 'id'>> {
    return [
      {
        asset: this.registeredAssets.get('TEST11'),
        date: new Date('2020-01-31T17:00:00.000Z'),
        price: 12.00,
      },
      {
        asset: this.registeredAssets.get('TEST11'),
        date: new Date('2020-02-28T17:00:00.000Z'),
        price: 16.00,
      },
      {
        asset: this.registeredAssets.get('TEST11'),
        date: new Date('2020-03-30T17:00:00.000Z'),
        price: 15.00,
      },
      {
        asset: this.registeredAssets.get('TEST4'),
        date: new Date('2020-01-31T17:00:00.000Z'),
        price: 11.00,
      },
      {
        asset: this.registeredAssets.get('TEST4'),
        date: new Date('2020-02-28T17:00:00.000Z'),
        price: 14.00,
      },
      {
        asset: this.registeredAssets.get('TEST4'),
        date: new Date('2020-03-30T17:00:00.000Z'),
        price: 12.00,
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        date: new Date('2020-01-31T17:00:00.000Z'),
        price: 12.00,
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        date: new Date('2020-02-28T17:00:00.000Z'),
        price: 10.00,
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        date: new Date('2020-03-30T17:00:00.000Z'),
        price: 8.00,
      },
    ];
  }
}

export default PostgresDataSetup;
