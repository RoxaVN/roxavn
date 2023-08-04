import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitModuleUtils1691112506538 implements MigrationInterface {
  name = 'InitModuleUtils1691112506538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "setting" (
        "id" SERIAL NOT NULL,
        "module" character varying NOT NULL,
        "name" character varying NOT NULL,
        "type" character varying NOT NULL,
        "metadata" jsonb NOT NULL,
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_7716df862d864580e97a072565" ON "setting" ("module", "name")
      `);
    await queryRunner.query(`
      CREATE TABLE "translation" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "key" character varying(256) NOT NULL,
        "lang" character varying(16) NOT NULL,
        "content" text NOT NULL,
        "metadata" jsonb,
        "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_7aef875e43ab80d34a0cdd39c70" PRIMARY KEY ("id")
      )
      `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_15fe4a3b2ffc6adb98e897e681" ON "translation" ("key", "lang")
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "public"."IDX_15fe4a3b2ffc6adb98e897e681"
      `);
    await queryRunner.query(`
      DROP TABLE "translation"
      `);
    await queryRunner.query(`
      DROP INDEX "public"."IDX_7716df862d864580e97a072565"
      `);
    await queryRunner.query(`
      DROP TABLE "setting"
      `);
  }
}
