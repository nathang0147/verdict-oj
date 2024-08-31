import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1724852744657 implements MigrationInterface {
    name = ' $npmConfigName1724852744657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "accountLocked"`);
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "enable"`);
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "role" "public"."_user_role_enum" NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "role" _user_role_enum NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "enable" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "accountLocked" boolean NOT NULL`);
    }

}
