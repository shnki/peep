import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "src/user/user.entity";

@Entity()
export class FriendRequests {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User)
    requester: User;

    @ManyToOne(() => User)
    receiver: User

    @Column({ default: 'pending' })
    status: 'pending' | 'accepted' | 'declined'

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date


}