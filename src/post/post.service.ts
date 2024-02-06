import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Like } from './entities/like.entity';
import { User } from 'src/user/user.entity';
import { NotFoundError } from 'rxjs';
import { Comment } from './entities/comment.entity';
import { PostWithUserInfoDto } from './dtos/PostWithUserInfo.dto';
import { PostDTO } from './dtos/post.dto';
import { Response } from 'express';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

  ) { }
  async create(createPostDto: CreatePostDto, userId: number) {
    console.log(`createPostDto: ${JSON.stringify(createPostDto)}`);
    try {
      const user = new User();
      user.id = userId;

      const post = await this.postRepository.create({
        ...createPostDto,
        user,
      });

      const createdPost = await this.postRepository.save(post);
      console.log(`Post created: ${JSON.stringify(createdPost)}`);
      return createdPost;
    } catch (error) {
      console.log(`Error creating post: ${error.message}`);
      throw error;
    }
  }

  async likePost(postId: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['likes'],
    });

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!post || !user) {
      throw new NotFoundError('Post or user not found');
    }

    console.log(`Post: ${JSON.stringify(post)}`);
    console.log(`User: ${JSON.stringify(user)}`);


    const existingLike = await this.likeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    console.log(`Checklike: ${JSON.stringify(existingLike)}`);

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      return post;
    }
    const like = await this.likeRepository.create({
      post,
      user,
    })
    await this.likeRepository.save(like);
    return post;
  }

  async commentPost(postId: number, comment: string, userId: number, response: Response) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['comments'],
      });

      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      if (!post || !user) {
        throw new NotFoundError('Post or user not found');
      }
      const result = await this.commentRepository.create({
        content: comment,
        post,
        user,
      })

      const createdComment = await this.commentRepository.save(result);
      if (createdComment) {
        response.status(201).send({
          "id": createdComment.id,
          "content": createdComment.content,
          "user": {
            "id": createdComment.user.id,
            "username": createdComment.user.username
          }
        });
      } else {
        throw new Error('Failed to create comment');
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }


  }

  async findAllOfOneUser(requestingUserId: number, targetUserId: number): Promise<PostDTO[]> {
    const likedPosts = await this.likeRepository
      .createQueryBuilder('like')
      .innerJoinAndSelect('like.post', 'post')
      .where('like.userId = :userId', { userId: requestingUserId })
      .getMany();

    const postsWithComments = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .where('user.id = :userId', { userId: targetUserId })
      .orderBy('post.createdAt', 'DESC')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.likesCount',
        'post.createdAt',
        'user.id',
        'user.username',
        'user.createdAt',
        'comments.id',
        'comments.content',
        'commentUser.id',
        'commentUser.username',
        'commentUser.createdAt',
      ])
      .getMany();

    return postsWithComments.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      likesCount: post.likesCount,
      createdAt: post.createdAt,
      user: {
        id: post.user.id,
        username: post.user.username,
        createdAt: post.user.createdAt,
      },
      isLikedPost: likedPosts.some((likedPost) => likedPost.post.id === post.id),
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        user: {
          id: comment.user.id,
          username: comment.user.username,
          createdAt: comment.user.createdAt,
        },
      })),
    }));
  }


  async findAll(userId: number, page: number, limit: number = 10): Promise<PostDTO[]> {
    const offset = (page - 1) * limit;
    const likedPosts = await this.likeRepository
      .createQueryBuilder('like')
      .innerJoinAndSelect('like.post', 'post')
      .where('like.userId = :userId', { userId })
      .getMany();

    const postsWithComments = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .orderBy('post.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.likesCount',
        'post.createdAt',
        'user.id',
        'user.username',
        'user.createdAt',
        'comments.id',
        'comments.content',
        'commentUser.id',
        'commentUser.username',
        'commentUser.createdAt',
      ])
      .getMany();


    return postsWithComments.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      likesCount: post.likesCount,
      createdAt: post.createdAt,
      user: {
        id: post.user.id,
        username: post.user.username,
        createdAt: post.user.createdAt,
      },
      isLikedPost: likedPosts.filter((likedPost) => likedPost.post.id === post.id).length > 0,
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        user: {
          id: comment.user.id,
          username: comment.user.username,
          createdAt: comment.user.createdAt,
        },
      }))
    }))

  }

  async findOne(postId: number): Promise<PostWithUserInfoDto> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.id = :id', { id: postId })
      .getOne();

    if (!post) {
      throw new NotFoundError('Post not found');
    }
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      likesCount: post.likesCount,
      user: {
        id: post.user.id,
        username: post.user.username,
        createdAt: post.user.createdAt,
        updatedAt: post.user.updatedAt,
        email: post.user.email,
        isActive: post.user.isActive,
      },
    }
  }
  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
