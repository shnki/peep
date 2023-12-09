import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

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

    @Column()
    isActive: boolean;

    @Column()
    hash: string

    @Column()
    hashRt: string

}
