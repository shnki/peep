import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createUser(username: string, email: string): Promise<User> {
        const user = this.userRepository.create({ username, email, createdAt: new Date() });
        return this.userRepository.save(user);
    }

    async findUserByUsername(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { username } });
    }
    async findUserById(id: number): Promise<User | undefined> {
        const parsedId = parseInt(id.toString());
        return this.userRepository.findOne({ where: { id: parsedId }, select: ['id', 'username', 'email'] });
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id)
    }

}
