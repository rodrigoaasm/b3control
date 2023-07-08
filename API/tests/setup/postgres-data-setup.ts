/* eslint-disable no-empty */
import {
  Connection,
  ConnectionOptions, createConnection, getRepository, QueryRunner, Repository,
} from 'typeorm';
import * as dotenv from 'dotenv';

import { AssetModel, ASSET_TABLE_NAME } from '@external/datasource/relational/models/asset-model';
import { OperationModel, OPERATION_TABLE_NAME } from '@external/datasource/relational/models/operation-model';
import { AssetQuoteModel, ASSET_QUOTE_TABLE_NAME } from '@external/datasource/relational/models/asset-quote-model';
import { DividendPaymentModel, DIVIDEND_PAYMENT_TABLE_NAME } from '@external/datasource/relational/models/dividend-payment-model';
import { UserModel, USER_TABLE_NAME } from '@external/datasource/relational/models/user-model';
import { UserCurrentPositionModel, USER_CURRENT_POSITION_TABLE_NAME } from '@external/datasource/relational/models/user-current-position-model';

import entities from '@external/datasource/relational/models/index';
import { v4 as uuid } from 'uuid';
import { ICryptHandlerAdapter } from '@domain-ports/adapters/crypt-handler-adapter-interface';
import CryptAdapter from '@external/adapters/bcrypt-adapter';

dotenv.config();

export class PostgresDataSetup {
  private connection: Connection;

  private queryRunner: QueryRunner;

  private userRepositoryTest: Repository<UserModel>;

  private assetRepositoryTest: Repository<AssetModel>;

  private operationRepositoryTest: Repository<OperationModel>;

  private assetQuoteRepositoryTest: Repository<AssetQuoteModel>;

  private dividendPaymentRepositoryTest: Repository<DividendPaymentModel>;

  private userCurrentPositionRepositoryTest: Repository<UserCurrentPositionModel>;

  private cryptAdapter: ICryptHandlerAdapter;

  public registeredAssets: Map<string, AssetModel>;

  public registeredUsers: Array<UserModel>;

  constructor() {
    this.registeredAssets = new Map();
    this.cryptAdapter = new CryptAdapter();
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

  public getQueryRunner(): QueryRunner {
    return this.queryRunner;
  }

  public async up(): Promise<void> {
    this.userRepositoryTest = getRepository(UserModel);
    this.assetRepositoryTest = getRepository(AssetModel);
    this.operationRepositoryTest = getRepository(OperationModel);
    this.assetQuoteRepositoryTest = getRepository(AssetQuoteModel);
    this.dividendPaymentRepositoryTest = getRepository(DividendPaymentModel);
    this.userCurrentPositionRepositoryTest = getRepository(UserCurrentPositionModel);

    try {
      await this.down();
    } catch (error) {
    }
    const users = await this.users();
    this.registeredUsers = await this.userRepositoryTest.save(users);
    const listRegisteredAssets = await this.assetRepositoryTest.save(this.assets());
    listRegisteredAssets.forEach((asset) => {
      this.registeredAssets.set(asset.code, asset);
    });

    await this.operationRepositoryTest.save(this.operations());
    await this.userCurrentPositionRepositoryTest.save(this.currentPositions());
    await this.assetQuoteRepositoryTest.save(this.assetQuotes());
    await this.dividendPaymentRepositoryTest.save(this.dividendPayments());
  }

  public async down(): Promise<void> {
    await this.queryRunner.query(`delete from ${OPERATION_TABLE_NAME}`);
    await this.queryRunner.query(`delete from ${USER_CURRENT_POSITION_TABLE_NAME}`);
    await this.queryRunner.query(`delete from ${DIVIDEND_PAYMENT_TABLE_NAME}`);
    await this.queryRunner.query(`delete from "${USER_TABLE_NAME}"`);
    await this.queryRunner.query(`delete from ${ASSET_QUOTE_TABLE_NAME}`);
    await this.queryRunner.query(`delete from ${ASSET_TABLE_NAME}`);
  }

  public async finish(): Promise<void> {
    await this.connection.close();
  }

  // eslint-disable-next-line class-methods-use-this
  private async users(): Promise<Array<UserModel>> {
    return [
      {
        id: uuid(),
        name: 'user1',
        password: await this.cryptAdapter.generateHash('test123*'),
        createdAt: new Date('2020-01-01T13:00:00.000Z'),
        updatedAt: new Date('2020-01-01T13:00:00.000Z'),
      },
      {
        id: uuid(),
        name: 'user2',
        password: await this.cryptAdapter.generateHash('test123*'),
        createdAt: new Date('2020-01-01T13:00:00.000Z'),
        updatedAt: new Date('2020-01-01T13:00:00.000Z'),
      },
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  private assets(): Array<Omit<AssetModel, 'id'>> {
    return [
      {
        code: 'TEST13',
        social: 'Teste',
        logo: '',
        category: 'FII',
      },
      {
        code: 'TEST12',
        social: 'Teste',
        logo: '',
        category: 'FII',
      },
      {
        code: 'TEST11',
        social: 'Teste',
        logo: '',
        category: 'FII',
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
        price: 10.00,
        value: 800,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST11'),
        createdAt: new Date('2020-02-02T13:00:00.000Z'),
        quantity: -40,
        type: 'sale',
        price: 15.00,
        value: 600,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST11'),
        createdAt: new Date('2020-03-02T13:00:00.000Z'),
        quantity: -40,
        type: 'sale',
        price: 15.00,
        value: 600,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST4'),
        createdAt: new Date('2020-02-01T13:00:00.000Z'),
        quantity: 100,
        type: 'buy',
        price: 10.00,
        value: 1000,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST4'),
        createdAt: new Date('2020-03-02T13:00:00.000Z'),
        quantity: -40,
        type: 'sale',
        price: 15.00,
        value: 600,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        createdAt: new Date('2020-01-02T13:00:00.000Z'),
        quantity: 40,
        type: 'buy',
        price: 15.00,
        value: 600,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        createdAt: new Date('2020-02-02T13:00:00.000Z'),
        quantity: 40,
        type: 'buy',
        price: 15.00,
        value: 600,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        createdAt: new Date('2020-03-02T13:00:00.000Z'),
        quantity: -40,
        type: 'sale',
        price: 15.00,
        value: 600,
        user: this.registeredUsers[0],
      },
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  private currentPositions(): Array<Omit<UserCurrentPositionModel, 'id'>> {
    return [
      {
        asset: this.registeredAssets.get('TEST11'),
        user: this.registeredUsers[0],
        quantity: 0,
        createdAt: new Date('2020-01-01T13:00:00.000Z'),
        updatedAt: new Date('2020-03-02T13:00:00.000Z'),
      },
      {
        asset: this.registeredAssets.get('TEST4'),
        user: this.registeredUsers[0],
        quantity: 60,
        createdAt: new Date('2020-02-01T13:00:00.000Z'),
        updatedAt: new Date('2020-03-02T13:00:00.000Z'),
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        user: this.registeredUsers[0],
        quantity: 40,
        createdAt: new Date('2020-01-02T13:00:00.000Z'),
        updatedAt: new Date('2020-03-02T13:00:00.000Z'),
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

  private dividendPayments(): Array<Omit<DividendPaymentModel, 'id'>> {
    return [
      {
        asset: this.registeredAssets.get('TEST3'),
        createdAt: new Date('2021-01-12T15:00:00.000Z'),
        value: 5.00,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST11'),
        createdAt: new Date('2021-01-17T15:00:00.000Z'),
        value: 7.00,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST11'),
        createdAt: new Date('2021-02-17T15:00:00.000Z'),
        value: 7.00,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        createdAt: new Date('2021-03-12T15:00:00.000Z'),
        value: 5.00,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST11'),
        createdAt: new Date('2021-03-17T15:00:00.000Z'),
        value: 7.00,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST3'),
        createdAt: new Date(),
        value: 10,
        user: this.registeredUsers[0],
      },
      {
        asset: this.registeredAssets.get('TEST11'),
        createdAt: new Date(),
        value: 12,
        user: this.registeredUsers[0],
      },
    ];
  }
}

export default PostgresDataSetup;
