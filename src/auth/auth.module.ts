import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { rtStrategy, atStrategy } from 'src/stratregy';
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [AuthService, rtStrategy, atStrategy],
    exports: [AuthService],
})
export class AuthModule { }
