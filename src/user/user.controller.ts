import { Controller, Post, Body, Get, Param, NotFoundException, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiTags, ApiOperation, ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @ApiOperation({ summary: 'Create user' })
    @ApiOkResponse({ description: 'User created', type: User })
    @Post()


    async createUser(@Body()
    userData: { username: string, password: string, email: string }): Promise<User> {
        const newUser = await this.userService.createUser(userData.username, userData.email);
        return newUser;
    }
    @ApiOperation({ summary: 'Get user by id' })
    @ApiOkResponse({ description: 'User found', type: User })
    @ApiBadRequestResponse({ description: 'User not found' })
    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        const user = await this.userService.findUserById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    @ApiOperation({ summary: 'Get user by username' })
    @ApiOkResponse({ description: 'User found', type: User })
    @ApiBadRequestResponse({ description: 'User not found' })
    @Get(":username")
    async getUserByUsername(@Param('username') username: string): Promise<User> {
        const user = await this.userService.findUserByUsername(username);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }



    @Delete(":id")
    async deletUser(@Query('id', ParseIntPipe) id: number): Promise<void> {
        await this.userService.deleteUser(id);


    }

}
