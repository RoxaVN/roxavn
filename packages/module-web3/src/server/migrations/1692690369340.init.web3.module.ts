import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitWeb3Module1692690369340 implements MigrationInterface {
  name = 'InitWeb3Module1692690369340';

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
      CREATE TABLE "web3_event" (
        "id" text NOT NULL,
        "event" text NOT NULL,
        "contractAddress" text NOT NULL,
        "networkId" bigint NOT NULL,
        "blockNumber" bigint NOT NULL,
        "crawlerId" bigint NOT NULL,
        "blockHash" text NOT NULL,
        "transactionIndex" bigint,
        "logIndex" bigint,
        "signature" text NOT NULL,
        "data" jsonb NOT NULL,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a39ee42b7ad72c0e83367a8cdb1" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE INDEX "IDX_01080391475c464da688df6dd9" ON "web3_event" ("blockNumber")
      `);
    await queryRunner.query(`
      CREATE TABLE "web3_event_crawler" (
        "id" BIGSERIAL NOT NULL,
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
      CREATE TABLE "web3_event_consumer" (
        "id" BIGSERIAL NOT NULL,
        "name" text NOT NULL,
        "lastConsumeBlockNumber" bigint NOT NULL,
        "crawlerId" bigint NOT NULL,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_27991885576683e9b7864cc63ed" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_57169e1260ee06495a2c15e1d5" ON "web3_event_consumer" ("name", "crawlerId")
      `);
    await queryRunner.query(`
      ALTER TABLE "web3_event"
      ADD CONSTRAINT "FK_3db51baa37ae8baf7652df6cuniquee63" FOREIGN KEY ("crawlerId") REFERENCES "web3_event_crawler"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
      ALTER TABLE "web3_event_crawler"
      ADD CONSTRAINT "FK_9d076044fedca39e0c1ec0e0bad" FOREIGN KEY ("contractId") REFERENCES "web3_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
      ALTER TABLE "web3_event_consumer"
      ADD CONSTRAINT "FK_dbbf89380f38958830fbf03a2fd" FOREIGN KEY ("crawlerId") REFERENCES "web3_event_crawler"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "web3_event_consumer" DROP CONSTRAINT "FK_dbbf89380f38958830fbf03a2fd"
      `);
    await queryRunner.query(`
      ALTER TABLE "web3_event_crawler" DROP CONSTRAINT "FK_9d076044fedca39e0c1ec0e0bad"
      `);
    await queryRunner.query(`
      ALTER TABLE "web3_event" DROP CONSTRAINT "FK_3db51baa37ae8baf7652df6ce63"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_57169e1260ee06495a2c15e1d5"
      `);
    await queryRunner.query(`
      DROP TABLE "web3_event_consumer"
      `);
    await queryRunner.query(`
      DROP TABLE "web3_provider"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_7f043e634f74c11a61b624f389"
      `);
    await queryRunner.query(`
      DROP TABLE "web3_event_crawler"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_01080391475c464da688df6dd9"
      `);
    await queryRunner.query(`
      DROP TABLE "web3_event"
      `);
    await queryRunner.query(`
      DROP TABLE "web3_contract"
      `);
  }
}
