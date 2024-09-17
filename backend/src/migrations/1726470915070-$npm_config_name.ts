import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1726470915070 implements MigrationInterface {
    name = ' $npmConfigName1726470915070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "role" "public"."_user_role_enum" NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "role" _user_role_enum NOT NULL DEFAULT 'user'`);
    }

}
