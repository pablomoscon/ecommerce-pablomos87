import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdministrator1731661655318 implements MigrationInterface {
    name = 'AddAdministrator1731661655318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_administrator_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "administrator" "public"."user_administrator_enum" NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "administrator"`);
        await queryRunner.query(`DROP TYPE "public"."user_administrator_enum"`);
    }

}
