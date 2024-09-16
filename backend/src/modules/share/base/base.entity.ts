import {
    DeleteDateColumn,
    BaseEntity as TypeORMBaseEntity, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity extends TypeORMBaseEntity {

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt?: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;
}
