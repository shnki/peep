import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { authDto } from 'src/dtos/authDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('/local/signin')
    signInLocal() {
        this.authService.signInLocal();
    }

    @Post('/local/signup')
    async signUpLocal(@Body() dto: authDto) {
        return await this.authService.signUpLocal(dto);
    }

    @Post('/logout')
    logout() {
        this.authService.logout();
    }

    @Post('/refresh')
    refreshTokens() {
        this.authService.refreshTokens();
    }
}
