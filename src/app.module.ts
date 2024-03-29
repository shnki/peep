import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from './user/user.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "db/data-source";
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [TypeOrmModule.forRoot(
    dataSourceOptions
  ), UserModule, AuthModule, PostModule, FriendsModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule { }
