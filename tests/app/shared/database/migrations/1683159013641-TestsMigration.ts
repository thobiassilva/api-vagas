import { MigrationInterface, QueryRunner } from "typeorm";

export class TestsMigration1683159013641 implements MigrationInterface {
    name = 'TestsMigration1683159013641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuario" ("id" varchar PRIMARY KEY NOT NULL, "nome" varchar NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "tipo" varchar CHECK( "tipo" IN ('A','R','C') ) NOT NULL, "nome_empresa" varchar, "dthr_cadastro" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_6ccff37176a6978449a99c82e10" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "vaga" ("id" varchar PRIMARY KEY NOT NULL, "descricao" varchar NOT NULL, "nome_empresa" varchar NOT NULL, "dt_limite" datetime NOT NULL, "ind_ativo" boolean NOT NULL DEFAULT (1), "max_candidatos" integer, "id_recrutador" varchar NOT NULL, "dthr_cadastro" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "candidatura" ("id" varchar PRIMARY KEY NOT NULL, "dt_cadastro" datetime NOT NULL DEFAULT (datetime('now')), "ind_sucesso" boolean NOT NULL DEFAULT (0), "id_candidato" varchar NOT NULL, "id_vaga" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_vaga" ("id" varchar PRIMARY KEY NOT NULL, "descricao" varchar NOT NULL, "nome_empresa" varchar NOT NULL, "dt_limite" datetime NOT NULL, "ind_ativo" boolean NOT NULL DEFAULT (1), "max_candidatos" integer, "id_recrutador" varchar NOT NULL, "dthr_cadastro" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_f0d9366b1d9aa1f307cfdfdac6b" FOREIGN KEY ("id_recrutador") REFERENCES "usuario" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_vaga"("id", "descricao", "nome_empresa", "dt_limite", "ind_ativo", "max_candidatos", "id_recrutador", "dthr_cadastro") SELECT "id", "descricao", "nome_empresa", "dt_limite", "ind_ativo", "max_candidatos", "id_recrutador", "dthr_cadastro" FROM "vaga"`);
        await queryRunner.query(`DROP TABLE "vaga"`);
        await queryRunner.query(`ALTER TABLE "temporary_vaga" RENAME TO "vaga"`);
        await queryRunner.query(`CREATE TABLE "temporary_candidatura" ("id" varchar PRIMARY KEY NOT NULL, "dt_cadastro" datetime NOT NULL DEFAULT (datetime('now')), "ind_sucesso" boolean NOT NULL DEFAULT (0), "id_candidato" varchar NOT NULL, "id_vaga" varchar NOT NULL, CONSTRAINT "FK_db83601857842a7e02b444ecfaa" FOREIGN KEY ("id_candidato") REFERENCES "usuario" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4c44c1d870db92366bea2f0569f" FOREIGN KEY ("id_vaga") REFERENCES "vaga" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_candidatura"("id", "dt_cadastro", "ind_sucesso", "id_candidato", "id_vaga") SELECT "id", "dt_cadastro", "ind_sucesso", "id_candidato", "id_vaga" FROM "candidatura"`);
        await queryRunner.query(`DROP TABLE "candidatura"`);
        await queryRunner.query(`ALTER TABLE "temporary_candidatura" RENAME TO "candidatura"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidatura" RENAME TO "temporary_candidatura"`);
        await queryRunner.query(`CREATE TABLE "candidatura" ("id" varchar PRIMARY KEY NOT NULL, "dt_cadastro" datetime NOT NULL DEFAULT (datetime('now')), "ind_sucesso" boolean NOT NULL DEFAULT (0), "id_candidato" varchar NOT NULL, "id_vaga" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "candidatura"("id", "dt_cadastro", "ind_sucesso", "id_candidato", "id_vaga") SELECT "id", "dt_cadastro", "ind_sucesso", "id_candidato", "id_vaga" FROM "temporary_candidatura"`);
        await queryRunner.query(`DROP TABLE "temporary_candidatura"`);
        await queryRunner.query(`ALTER TABLE "vaga" RENAME TO "temporary_vaga"`);
        await queryRunner.query(`CREATE TABLE "vaga" ("id" varchar PRIMARY KEY NOT NULL, "descricao" varchar NOT NULL, "nome_empresa" varchar NOT NULL, "dt_limite" datetime NOT NULL, "ind_ativo" boolean NOT NULL DEFAULT (1), "max_candidatos" integer, "id_recrutador" varchar NOT NULL, "dthr_cadastro" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "vaga"("id", "descricao", "nome_empresa", "dt_limite", "ind_ativo", "max_candidatos", "id_recrutador", "dthr_cadastro") SELECT "id", "descricao", "nome_empresa", "dt_limite", "ind_ativo", "max_candidatos", "id_recrutador", "dthr_cadastro" FROM "temporary_vaga"`);
        await queryRunner.query(`DROP TABLE "temporary_vaga"`);
        await queryRunner.query(`DROP TABLE "candidatura"`);
        await queryRunner.query(`DROP TABLE "vaga"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
    }

}
