import { User } from "src/user/user.entity";
import { Post } from "./post.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    content: string

    @ManyToOne(() => User, user => user.comments)
    user: User

    @ManyToOne(() => Post, post => post.comments)
    post: Post
}