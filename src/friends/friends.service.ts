import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friends } from './friends.entity';
import { FriendRequests } from './friendRequests.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Friends)
        private readonly friendsRepository: Repository<Friends>,
        @InjectRepository(FriendRequests)
        private readonly friendRequestsRepository: Repository<FriendRequests>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async sendFriendRequest(senderId: number, receiverId: number) {
        return this.friendRequestsRepository.save({
            requester: await this.userRepository.findOneBy({ id: senderId }),
            receiver: await this.userRepository.findOneBy({ id: receiverId }),
            status: 'pending',
            CreatedAt: new Date()
        })
    }

    async getFriendRequests(senderId: number) {
        return this.friendRequestsRepository.find({
            where: { requester: { id: senderId } },
            relations: ['receiver', 'requester']
        })
    }

    async acceptFriendRequest(receiverId: number, requestId: number) {
        const request = await this.friendRequestsRepository.findOneBy({ id: requestId })
        if (request) {
            await this.friendsRepository.save({
                requester: request.requester,
                receiver: request.receiver
            })
            await this.friendRequestsRepository.delete({ id: requestId })
        }

        return "friend request accepted"

    }

}
