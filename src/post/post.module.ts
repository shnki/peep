import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Like } from './entities/like.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Like, Comment]),
    UserModule,
    TypeOrmModule.forFeature([User])

  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule { }
