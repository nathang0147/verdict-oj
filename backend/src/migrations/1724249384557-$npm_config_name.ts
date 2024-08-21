import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1724249384557 implements MigrationInterface {
    name = ' $npmConfigName1724249384557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."_user_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "rank" integer NOT NULL, "steak" integer NOT NULL, "accountLocked" boolean NOT NULL, "enable" boolean NOT NULL, "role" "public"."_user_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_6f484592228a724d0ae83ca3a53" UNIQUE ("email"), CONSTRAINT "PK_284f4d1aef6ebd3cde53038af46" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_problem" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "description" character varying NOT NULL, "input" character varying NOT NULL, "output" character varying NOT NULL, "level" integer NOT NULL, "runtimeLimit" integer NOT NULL, "memoryLimit" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f27eb7c52bb70c88e1a0827dfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "t_testcase" ("id" SERIAL NOT NULL, "problemId" integer NOT NULL, "input" character varying NOT NULL, "output" character varying NOT NULL, "expiredAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "problemIdId" uuid, CONSTRAINT "PK_92378d58738ca4e80bf296b4851" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."t_submission_language_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TYPE "public"."t_submission_status_enum" AS ENUM('-1', '0', '1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`CREATE TABLE "t_submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deletedAt" TIMESTAMP, "userId" integer NOT NULL, "problemId" integer NOT NULL, "code" character varying NOT NULL, "language" "public"."t_submission_language_enum" NOT NULL, "status" "public"."t_submission_status_enum" NOT NULL, "error" character varying, "runtime" integer, "memory" integer, "input" character varying NOT NULL, "output" character varying NOT NULL, "expectedOutput" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userIdId" uuid, "problemIdId" uuid, CONSTRAINT "PK_7403ac85d6eeef2f0b3353e33e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "t_testcase" ADD CONSTRAINT "FK_e8c7c4d9ba811a2a4a82c5c2c61" FOREIGN KEY ("problemIdId") REFERENCES "t_problem"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD CONSTRAINT "FK_abe2f3666ac2a2a9a365e3c9b2d" FOREIGN KEY ("userIdId") REFERENCES "_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "t_submission" ADD CONSTRAINT "FK_95d94f9dd353b7e08d26e7b0f79" FOREIGN KEY ("problemIdId") REFERENCES "t_problem"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "t_submission" DROP CONSTRAINT "FK_95d94f9dd353b7e08d26e7b0f79"`);
        await queryRunner.query(`ALTER TABLE "t_submission" DROP CONSTRAINT "FK_abe2f3666ac2a2a9a365e3c9b2d"`);
        await queryRunner.query(`ALTER TABLE "t_testcase" DROP CONSTRAINT "FK_e8c7c4d9ba811a2a4a82c5c2c61"`);
        await queryRunner.query(`DROP TABLE "t_submission"`);
        await queryRunner.query(`DROP TYPE "public"."t_submission_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."t_submission_language_enum"`);
        await queryRunner.query(`DROP TABLE "t_testcase"`);
        await queryRunner.query(`DROP TABLE "t_problem"`);
        await queryRunner.query(`DROP TABLE "_user"`);
        await queryRunner.query(`DROP TYPE "public"."_user_role_enum"`);
    }

}
