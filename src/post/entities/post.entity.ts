import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, } from "typeorm";
import { User } from "../../user/user.entity";
import { Like } from "./like.entity";
import { Comment } from "./comment.entity";
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    title: string;

    @Column()
    content: string;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
        nullable: true
    })
    createdAt: Date;

    @Column({ default: 0 })
    likesCount: number;

    @OneToMany(() => Comment, comment => comment.post, { onDelete: 'CASCADE' })
    comments: Comment[];

    @ManyToOne(() => User, user => user.posts)
    user: User;

    @OneToMany(() => Like, like => like.post, { onDelete: 'CASCADE' })
    likes: Like[];


}