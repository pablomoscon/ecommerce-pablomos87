import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1730794531000 implements MigrationInterface {
    name = 'Initial1730794531000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "productId" uuid, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "description" character varying(255) NOT NULL, "price" numeric(10,2) NOT NULL, "stock" integer, "imgUrl" character varying NOT NULL DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWz9tftw9qculFH1gxieWkxL6rbRk_hrXTSg&s', CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(50) NOT NULL, "phone" character varying(50) NOT NULL, "country" character varying(50), "address" text, "city" character varying(50), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "userId" uuid, "orderDetailsId" uuid, CONSTRAINT "REL_ab56c88c3f324df235b657e9f6" UNIQUE ("orderDetailsId"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric(10,2) NOT NULL, CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_order_details_order_detail" ("productId" uuid NOT NULL, "orderDetailId" uuid NOT NULL, CONSTRAINT "PK_d8bbde5b3949a4cb4b4216fc75e" PRIMARY KEY ("productId", "orderDetailId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f9e45d7e9aa0a0cd272c5f6639" ON "product_order_details_order_detail" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b8db4b713c36dd5a834edc9128" ON "product_order_details_order_detail" ("orderDetailId") `);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_5f4035564515762e47d19334f23" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_ab56c88c3f324df235b657e9f62" FOREIGN KEY ("orderDetailsId") REFERENCES "order_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_order_details_order_detail" ADD CONSTRAINT "FK_f9e45d7e9aa0a0cd272c5f6639b" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_order_details_order_detail" ADD CONSTRAINT "FK_b8db4b713c36dd5a834edc9128d" FOREIGN KEY ("orderDetailId") REFERENCES "order_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_order_details_order_detail" DROP CONSTRAINT "FK_b8db4b713c36dd5a834edc9128d"`);
        await queryRunner.query(`ALTER TABLE "product_order_details_order_detail" DROP CONSTRAINT "FK_f9e45d7e9aa0a0cd272c5f6639b"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_ab56c88c3f324df235b657e9f62"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_5f4035564515762e47d19334f23"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8db4b713c36dd5a834edc9128"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f9e45d7e9aa0a0cd272c5f6639"`);
        await queryRunner.query(`DROP TABLE "product_order_details_order_detail"`);
        await queryRunner.query(`DROP TABLE "order_detail"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
