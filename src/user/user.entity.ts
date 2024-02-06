import {
    Entity, Column, PrimaryGeneratedColumn, OneToMany,
} from 'typeorm';

import { Like } from '../post/entities/like.entity';
import { Post } from '../post/entities/post.entity';
import { Comment } from 'src/post/entities/comment.entity';
import { Friends } from 'src/friends/friends.entity';

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

    @OneToMany(() => Post, (post) => post.user, { onDelete: 'CASCADE' })
    posts: Post[]

    @OneToMany(() => Like, like => like.user, { onDelete: 'CASCADE' })
    likes: Like[];

    @OneToMany(() => Comment, comment => comment.user, { onDelete: 'CASCADE' })
    comments: Comment[]

    @OneToMany(() => Friends, friends => friends.user, { onDelete: 'CASCADE' })
    friends: Friends[]

}
