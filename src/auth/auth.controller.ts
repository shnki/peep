import { Controller, UseGuards } from '@nestjs/common';
import { Body, Post, HttpCode, Req } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { authDto } from 'src/dtos/authDto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('/local/signin')
    async signInLocal(@Body() dto: authDto) {
        return await this.authService.signInLocal(dto);
    }

    @Post('/local/signup')
    async signUpLocal(@Body() dto: authDto) {
        return await this.authService.signUpLocal(dto);
    }
    @UseGuards(AuthGuard('jwt'))
    @Post('/local/logout')
    @HttpCode(200)
    logout(@Req() req: Request) {
        console.log(req.user);
        return this.authService.logout(req.user['id']);
    }


    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('/local/refresh')
    refreshTokens(@Req() req: Request) {
        return this.authService.refreshTokens(req.user['id'], req.user['refreshToken']);
    }
}
