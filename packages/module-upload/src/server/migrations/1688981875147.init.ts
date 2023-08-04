import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitModuleUpload1688981875147 implements MigrationInterface {
  name = 'InitModuleUpload1688981875147';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "file" (
        "id" character varying(64) NOT NULL,
        "name" text NOT NULL,
        "size" bigint NOT NULL,
        "eTag" text NOT NULL,
        "mime" text NOT NULL,
        "url" text NOT NULL,
        "userId" uuid NOT NULL,
        "parentId" uuid,
        "fileStorageId" uuid NOT NULL,
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE INDEX "IDX_b2d8e683f020f61115edea206b" ON "file" ("userId")
      `);
    await queryRunner.query(`
      CREATE INDEX "IDX_a6b3b927fe2ad2bda57fc63f6b" ON "file" ("parentId")
      `);
    await queryRunner.query(`
      CREATE TABLE "file_storage" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "name" text NOT NULL,
        "handler" text NOT NULL,
        "type" text NOT NULL,
        "currentSize" bigint NOT NULL DEFAULT '0',
        "maxSize" bigint NOT NULL DEFAULT '0',
        "maxFileSize" bigint NOT NULL DEFAULT '0',
        "metadata" jsonb,
        "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_2834b5398654dd125afabfd0dc2" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE INDEX "IDX_be337628fd06ceed3eb942de75" ON "file_storage" ("userId")
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_147caecbe2b5dbd0f0fc7e7ca8" ON "file_storage" ("userId", "name")
      `);
    await queryRunner.query(`
      ALTER TABLE "file"
      ADD CONSTRAINT "FK_161b409213b06d68b4930a8175b" FOREIGN KEY ("fileStorageId") REFERENCES "file_storage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "file" DROP CONSTRAINT "FK_161b409213b06d68b4930a8175b"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_147caecbe2b5dbd0f0fc7e7ca8"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_be337628fd06ceed3eb942de75"
      `);
    await queryRunner.query(`
      DROP TABLE "file_storage"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_a6b3b927fe2ad2bda57fc63f6b"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_b2d8e683f020f61115edea206b"
      `);
    await queryRunner.query(`
      DROP TABLE "file"
      `);
  }
}
