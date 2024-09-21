import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1726890391938 implements MigrationInterface {
    name = ' $npmConfigName1726890391938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP COLUMN "expiredAt"`);
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "role" "public"."_user_role_enum" NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "role" _user_role_enum NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD "expiredAt" TIMESTAMP NOT NULL`);
    }

}
