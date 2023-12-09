import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('/local/signin')
    signInLocal() {
        this.authService.signInLocal();
    }

    @Post('/local/signup')
    signUpLocal() {
        this.authService.signUpLocal();
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
