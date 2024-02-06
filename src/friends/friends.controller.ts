import { Controller, Get, Param, Post, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('friends')
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService) { }

    @Get('/all')
    @UseGuards(AuthGuard('jwt'))
    async getFriends(@Req() req: Request) {
        const user = req.user
        return user['id']
    }

    @Get('friend-requests')
    @UseGuards(AuthGuard('jwt'))
    async getFriendRequests(@Req() req: Request) {
        const user = req.user
        return this.friendsService.getFriendRequests(user['id'])
    }

    @Post('/add/:id')
    @UseGuards(AuthGuard('jwt'))
    async addFriend(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {

        const user = req.user
        return this.friendsService.sendFriendRequest(user['id'], id)
    }

    @Post('/accept/:requsetId')
    @UseGuards(AuthGuard('jwt'))
    async acceptFriendRequest(@Req() req: Request, @Param('requsetId', ParseIntPipe) requsetId: number) {

        const user = req.user
        return this.friendsService.acceptFriendRequest(user['id'], requsetId)
    }



}
