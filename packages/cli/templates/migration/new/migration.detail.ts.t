---
to: src/server/migrations/<%= ts %>.<%= h.changeCase.dot(name) %>.ts
---
import { MigrationInterface, QueryRunner } from 'typeorm';

export class <%= h.changeCase.pascal(name) %><%= ts %> implements MigrationInterface {
  name = '<%= h.changeCase.pascal(name) %><%= ts %>';

  public async up(queryRunner: QueryRunner): Promise<void> {
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
