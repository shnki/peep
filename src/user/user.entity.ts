import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({
        nullable: true
    })
    updatedAt: Date;
    @Column({
        unique: true,
    })
    email: string;

    @Column({
        default: true
    })
    isActive: boolean;

    @Column()
    hash: string

    @Column({
        nullable: true,
    })
    hashRt: string

}
