import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFxqlEntry1732053407370 implements MigrationInterface {
    name = 'AddFxqlEntry1732053407370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fxql_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_date" TIMESTAMP WITH TIME ZONE DEFAULT now(), "modified_date" TIMESTAMP WITH TIME ZONE DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "source_currency" character varying NOT NULL, "destination_currency" character varying NOT NULL, "buy_price" double precision NOT NULL, "sell_price" double precision NOT NULL, "cap_amount" integer NOT NULL, CONSTRAINT "PK_8a85115aade09a93c184c12b842" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "fxql_entries"`);
    }

}
