import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1724842207818 implements MigrationInterface {
    name = ' $npmConfigName1724842207818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "rank"`);
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "steak"`);
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "role" "public"."_user_role_enum" NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "role" _user_role_enum NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "steak" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "rank" integer NOT NULL`);
    }

}
