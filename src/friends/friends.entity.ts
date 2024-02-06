import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "src/user/user.entity";

@Entity()
export class Friends {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.friends)
    user: User;


}