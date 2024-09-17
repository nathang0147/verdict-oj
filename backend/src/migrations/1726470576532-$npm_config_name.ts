import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1726470576532 implements MigrationInterface {
    name = ' $npmConfigName1726470576532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP COLUMN "problemId"`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP COLUMN "tagId"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_8acd5cf26ebd158416f477de799"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP CONSTRAINT "FK_e8c7c4d9ba811a2a4a82c5c2c61"`);
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP CONSTRAINT "PK_92378d58738ca4e80bf296b4851"`);
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD CONSTRAINT "PK_92378d58738ca4e80bf296b4851" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP COLUMN "problemId"`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD "problemId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP COLUMN "problemIdId"`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD "problemIdId" integer`);
        await queryRunner.query(`ALTER TABLE "t_submission" DROP CONSTRAINT "FK_95d94f9dd353b7e08d26e7b0f79"`);
        await queryRunner.query(`ALTER TABLE "t_problem" DROP CONSTRAINT "PK_4f27eb7c52bb70c88e1a0827dfd"`);
        await queryRunner.query(`ALTER TABLE "t_problem" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "t_problem" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_problem" ADD CONSTRAINT "PK_4f27eb7c52bb70c88e1a0827dfd" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "role" "public"."_user_role_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "t_submission" DROP CONSTRAINT "PK_7403ac85d6eeef2f0b3353e33e0"`);
        await queryRunner.query(`ALTER TABLE "t_submission" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD CONSTRAINT "PK_7403ac85d6eeef2f0b3353e33e0" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "t_submission" DROP COLUMN "problemId"`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD "problemId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_submission" DROP COLUMN "problemIdId"`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD "problemIdId" integer`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP CONSTRAINT "FK_4e63242a27cd8fae449dc5eee28"`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP CONSTRAINT "PK_231ea89561f63298444b4733a63" CASCADE`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD CONSTRAINT "PK_231ea89561f63298444b4733a63" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP COLUMN "problemIdId"`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD "problemIdId" integer`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP COLUMN "tagIdId"`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD "tagIdId" integer`);
        await queryRunner.query(`ALTER TABLE "t_tag" DROP CONSTRAINT "PK_063bd786ad48798c90870e7c455"`);
        await queryRunner.query(`ALTER TABLE "t_tag" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "t_tag" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_tag" ADD CONSTRAINT "PK_063bd786ad48798c90870e7c455" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD CONSTRAINT "FK_e8c7c4d9ba811a2a4a82c5c2c61" FOREIGN KEY ("problemIdId") REFERENCES "t_problem"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD CONSTRAINT "FK_95d94f9dd353b7e08d26e7b0f79" FOREIGN KEY ("problemIdId") REFERENCES "t_problem"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD CONSTRAINT "FK_4e63242a27cd8fae449dc5eee28" FOREIGN KEY ("problemIdId") REFERENCES "t_problem_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD CONSTRAINT "FK_a01ec91a844887d8bf674a1d1a2" FOREIGN KEY ("tagIdId") REFERENCES "t_problem_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP CONSTRAINT "FK_a01ec91a844887d8bf674a1d1a2"`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP CONSTRAINT "FK_4e63242a27cd8fae449dc5eee28"`);
        await queryRunner.query(`ALTER TABLE "t_submission" DROP CONSTRAINT "FK_95d94f9dd353b7e08d26e7b0f79"`);
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP CONSTRAINT "FK_e8c7c4d9ba811a2a4a82c5c2c61"`);
        await queryRunner.query(`ALTER TABLE "t_tag" DROP CONSTRAINT "PK_063bd786ad48798c90870e7c455"`);
        await queryRunner.query(`ALTER TABLE "t_tag" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "t_tag" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "t_tag" ADD CONSTRAINT "PK_063bd786ad48798c90870e7c455" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP COLUMN "tagIdId"`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD "tagIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP COLUMN "problemIdId"`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD "problemIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP CONSTRAINT "PK_231ea89561f63298444b4733a63"`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD CONSTRAINT "PK_231ea89561f63298444b4733a63" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD CONSTRAINT "FK_4e63242a27cd8fae449dc5eee28" FOREIGN KEY ("problemIdId") REFERENCES "t_problem_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_submission" DROP COLUMN "problemIdId"`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD "problemIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "t_submission" DROP COLUMN "problemId"`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD "problemId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_submission" DROP CONSTRAINT "PK_7403ac85d6eeef2f0b3353e33e0"`);
        await queryRunner.query(`ALTER TABLE "t_submission" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD CONSTRAINT "PK_7403ac85d6eeef2f0b3353e33e0" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "_user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "_user" ADD "role" _user_role_enum NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "t_problem" DROP CONSTRAINT "PK_4f27eb7c52bb70c88e1a0827dfd"`);
        await queryRunner.query(`ALTER TABLE "t_problem" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "t_problem" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "t_problem" ADD CONSTRAINT "PK_4f27eb7c52bb70c88e1a0827dfd" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD CONSTRAINT "FK_95d94f9dd353b7e08d26e7b0f79" FOREIGN KEY ("problemIdId") REFERENCES "t_problem"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP COLUMN "problemIdId"`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD "problemIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP COLUMN "problemId"`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD "problemId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP CONSTRAINT "PK_92378d58738ca4e80bf296b4851"`);
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD CONSTRAINT "PK_92378d58738ca4e80bf296b4851" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD CONSTRAINT "FK_e8c7c4d9ba811a2a4a82c5c2c61" FOREIGN KEY ("problemIdId") REFERENCES "t_problem"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "PK_8acd5cf26ebd158416f477de799"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD "tagId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "t_problem_tag" ADD "problemId" character varying NOT NULL`);
    }

}
