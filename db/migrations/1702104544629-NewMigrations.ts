import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrations1702104544629 implements MigrationInterface {
    name = 'NewMigrations1702104544629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isActive" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "hash" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "hashRt" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hashRt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hash"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
    }

}
