import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1690961257974 implements MigrationInterface {
  name = 'Init1690961257974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "category" (
        "id" BIGSERIAL NOT NULL,
        "name" character varying(256) NOT NULL,
        "parentId" uuid,
        "parents" uuid array,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_23c05c292c439d77b0de816b50" ON "category" ("name")
      `);
    await queryRunner.query(`
      CREATE INDEX "IDX_d5456fd7e4c4866fec8ada1fa1" ON "category" ("parentId")
      `);
    await queryRunner.query(`
      CREATE TABLE "category_attribute" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "categoryId" bigint NOT NULL,
        "attributeId" bigint NOT NULL,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_e71950e2873d76c1fdb37b75b1b" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_f4f2de964c49011f9c7830913a" ON "category_attribute" ("categoryId", "attributeId")
      `);
    await queryRunner.query(`
      CREATE TABLE "attribute" (
        "id" BIGSERIAL NOT NULL,
        "name" character varying(256) NOT NULL,
        "type" character varying(64) NOT NULL,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_350fb4f7eb87e4c7d35c97a982" ON "attribute" ("name")
      `);
    await queryRunner.query(`
      CREATE TABLE "asset_attribute" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "assetId" uuid NOT NULL,
        "attributeId" bigint NOT NULL,
        "metadata" jsonb,
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "valueDate" TIMESTAMP WITH TIME ZONE,
        "valueInt" bigint,
        "valueDecimal" numeric(12, 4),
        "valueText" text,
        "valueVarchar" character varying(256),
        CONSTRAINT "PK_be7ea6150ce31f063a128f02ab1" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE TABLE "store" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "name" text NOT NULL,
        "type" text NOT NULL,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE INDEX "IDX_3f82dbf41ae837b8aa0a27d29c" ON "store" ("userId")
      `);
    await queryRunner.query(`
      CREATE TABLE "unit" (
        "id" BIGSERIAL NOT NULL,
        "name" character varying(256) NOT NULL,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_5618100486bb99d78de022e582" ON "unit" ("name")
      `);
    await queryRunner.query(`
      CREATE TABLE "asset" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "storeId" uuid NOT NULL,
        "unitCount" double precision NOT NULL DEFAULT '1',
        "unitId" bigint,
        CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE INDEX "IDX_e469bb1b58d7ae4d9527d35ca0" ON "asset" ("userId")
      `);
    await queryRunner.query(`
      ALTER TABLE "category_attribute"
      ADD CONSTRAINT "FK_6ae9fd1960af2eb3b290036c1c8" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
      ALTER TABLE "category_attribute"
      ADD CONSTRAINT "FK_02d2d1bd2127e4d54302549fefd" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
      ALTER TABLE "asset_attribute"
      ADD CONSTRAINT "FK_653e8a89fae66b121b75736f8e8" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
      ALTER TABLE "asset_attribute"
      ADD CONSTRAINT "FK_8b114857c428382c666c411f76b" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
      ALTER TABLE "asset"
      ADD CONSTRAINT "FK_d83c8e0865e2b3405ab34efbb8b" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
      ALTER TABLE "asset"
      ADD CONSTRAINT "FK_ac31ca43467d1081617c21dda67" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "asset" DROP CONSTRAINT "FK_ac31ca43467d1081617c21dda67"
      `);
    await queryRunner.query(`
      ALTER TABLE "asset" DROP CONSTRAINT "FK_d83c8e0865e2b3405ab34efbb8b"
      `);
    await queryRunner.query(`
      ALTER TABLE "asset_attribute" DROP CONSTRAINT "FK_8b114857c428382c666c411f76b"
      `);
    await queryRunner.query(`
      ALTER TABLE "asset_attribute" DROP CONSTRAINT "FK_653e8a89fae66b121b75736f8e8"
      `);
    await queryRunner.query(`
      ALTER TABLE "category_attribute" DROP CONSTRAINT "FK_02d2d1bd2127e4d54302549fefd"
      `);
    await queryRunner.query(`
      ALTER TABLE "category_attribute" DROP CONSTRAINT "FK_6ae9fd1960af2eb3b290036c1c8"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_e469bb1b58d7ae4d9527d35ca0"
      `);
    await queryRunner.query(`
      DROP TABLE "asset"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_5618100486bb99d78de022e582"
      `);
    await queryRunner.query(`
      DROP TABLE "unit"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_3f82dbf41ae837b8aa0a27d29c"
      `);
    await queryRunner.query(`
      DROP TABLE "store"
      `);
    await queryRunner.query(`
      DROP TABLE "asset_attribute"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_350fb4f7eb87e4c7d35c97a982"
      `);
    await queryRunner.query(`
      DROP TABLE "attribute"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_f4f2de964c49011f9c7830913a"
      `);
    await queryRunner.query(`
      DROP TABLE "category_attribute"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_d5456fd7e4c4866fec8ada1fa1"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_23c05c292c439d77b0de816b50"
      `);
    await queryRunner.query(`
      DROP TABLE "category"
      `);
  }
}
