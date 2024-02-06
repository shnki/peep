import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { authDto } from 'src/dtos/authDto';
import { User } from '../user/user.entity';
import { Tokens } from 'src/types';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }


    hashData(data: string) {
        return bcrypt.hash(data, 10)
    }

    async upadateRtHash(userId: any, rt: string) {
        const hash = await this.hashData(rt);
        await this.userRepository.update(userId, {
            hashRt: hash
        })
    }

    async getTokens(userId: number, email: string): Promise<Tokens> {
        const jwtPayload = {
            id: userId,
            email: email,
        };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: "at-secret",
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: "rt-secret",
                expiresIn: '7d',
            }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }



    async signInLocal(dto: authDto) {
        const user = await this.userRepository.findOne({
            where: {
                username: dto.email
            }
        })
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.hash);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const tokens = await this.getTokens(user.id, user.email);
        await this.upadateRtHash(user.id, tokens.refresh_token);
        return tokens
    }
    async signUpLocal(dto: authDto): Promise<Tokens> {
        const hash = await this.hashData(dto.password);

        const newUser = this.userRepository.create({
            username: dto.email,
            email: dto.email,
            hash,
        });

        try {
            const savedUser = await this.userRepository.save(newUser);
            const tokens = await this.getTokens(savedUser.id, savedUser.email);
            console.log(savedUser.id)
            await this.upadateRtHash(savedUser.id, tokens.refresh_token);
            return tokens;

        } catch (error) {
            throw error;
        }
    }

    async logout(id: number): Promise<boolean> {
        this.userRepository.createQueryBuilder().update(User)
            .set({
                hashRt: null
            })
            .where({
                id: id
            })
            .andWhere('hashRt IS NOT NULL')
            .execute()
        return true
    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new Error('User not found');
        }

        const isRtMatch = await bcrypt.compare(rt, user.hashRt);
        if (!isRtMatch) {
            throw new Error('Invalid refresh token');
        }
        const tokens = await this.getTokens(user.id, user.email);
        await this.upadateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

}
