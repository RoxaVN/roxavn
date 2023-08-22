import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitModuleWeb1692666205382 implements MigrationInterface {
  name = 'InitModuleWeb1692666205382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "web3_contract" (
        "id" BIGSERIAL NOT NULL,
        "address" text NOT NULL,
        "abi" jsonb NOT NULL,
        "networkId" bigint NOT NULL,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ae0b609621cb4be74ae2ba8071a" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE TABLE "web3_event_crawler" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "event" text NOT NULL,
        "contractId" bigint NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "lastCrawlBlockNumber" bigint NOT NULL,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_b2f221984d402825bdca2bb6787" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_7f043e634f74c11a61b624f389" ON "web3_event_crawler" ("event", "contractId")
      `);
    await queryRunner.query(`
      CREATE TABLE "web3_event" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "event" text NOT NULL,
        "contractAddress" text NOT NULL,
        "networkId" bigint NOT NULL,
        "blockNumber" bigint NOT NULL,
        "blockHash" text NOT NULL,
        "transactionHash" text NOT NULL,
        "transactionIndex" bigint,
        "logIndex" bigint,
        "signature" text NOT NULL,
        "data" jsonb NOT NULL,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a39ee42b7ad72c0e83367a8cdb1" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_559a8c8bf2e86dc996c68a7b9e" ON "web3_event" ("transactionHash")
      `);
    await queryRunner.query(`
      CREATE TABLE "web3_provider" (
        "id" BIGSERIAL NOT NULL,
        "networkId" bigint NOT NULL,
        "url" text NOT NULL,
        "delayBlockCount" integer NOT NULL DEFAULT '10',
        "blockRangePerCrawl" integer NOT NULL DEFAULT '5000',
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_303653d9f293b37b233938f71b1" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      ALTER TABLE "web3_event_crawler"
      ADD CONSTRAINT "FK_9d076044fedca39e0c1ec0e0bad" FOREIGN KEY ("contractId") REFERENCES "web3_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "web3_event_crawler" DROP CONSTRAINT "FK_9d076044fedca39e0c1ec0e0bad"
      `);
    await queryRunner.query(`
      DROP TABLE "web3_provider"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_559a8c8bf2e86dc996c68a7b9e"
      `);
    await queryRunner.query(`
      DROP TABLE "web3_event"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_7f043e634f74c11a61b624f389"
      `);
    await queryRunner.query(`
      DROP TABLE "web3_event_crawler"
      `);
    await queryRunner.query(`
      DROP TABLE "web3_contract"
      `);
  }
}
