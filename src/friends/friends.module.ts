import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from './friends.entity';
import { FriendRequests } from './friendRequests.entity';
import { User } from 'src/user/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Friends, FriendRequests, User])],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule { }
