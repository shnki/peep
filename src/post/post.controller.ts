import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, ParseIntPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { PostWithUserInfoDto } from './dtos/PostWithUserInfo.dto';



@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const { method, url, headers, user } = req;
    console.log(`Request Method: ${method}`);
    console.log(`Request URL: ${url}`);
    console.log(`Request Headers: ${JSON.stringify(headers)}`);

    if (user) {
      console.log(`User ID: ${user['id']}`);
    }

    return await this.postService.create(createPostDto, req.user['id']);
  }

  @Post(':postId/like')
  @UseGuards(AuthGuard('jwt'))
  async likePost(@Param('postId') postId: number, @Req() req: Request) {
    const userId = req.user['id'];
    const likedPost = await this.postService.likePost(postId, userId)
    return likedPost;
  }


  @Post(':postId/comment')
  @UseGuards(AuthGuard('jwt'))
  async commentPost(@Param('postId') postId: number, @Body('comment') comment: string, @Req() req: Request, @Res() response: Response) {
    const userId = req.user['id'];
    const commentedPost = await this.postService.commentPost(postId, comment, userId, response)
    return commentedPost;
  }

  @Get('/user/:userId')
  @UseGuards(AuthGuard('jwt'))
  findUserPostsWithComment(@Param('userId', ParseIntPipe) id: number, @Req() req: Request) {
    const requestingUserId = req.user['id'];
    return this.postService.findAllOfOneUser(requestingUserId, id);

  }

  @Get('/all/:page/:limit')
  @UseGuards(AuthGuard('jwt'))
  findAll(@Param('page', ParseIntPipe) page: number, @Param('limit', ParseIntPipe) limit: number, @Req() req: Request) {
    const userId = req.user['id'];
    return this.postService.findAll(userId, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostWithUserInfoDto | null> {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
