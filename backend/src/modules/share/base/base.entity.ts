import {
    PrimaryGeneratedColumn,
    Column,
    DeleteDateColumn,
    BaseEntity as TypeORMBaseEntity,
} from 'typeorm';
import { Expose, Transform } from 'class-transformer';

export abstract class BaseEntity extends TypeORMBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    @Transform(({ value }) => value?.toString(), { toClassOnly: true })
    id?: string;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;
}
