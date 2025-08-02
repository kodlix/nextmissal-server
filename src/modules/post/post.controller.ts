import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreatePostCommand } from './commands/create-post.command';
import { UpdatePostCommand } from './commands/update-post.command';
import { DeletePostCommand } from './commands/delete-post.command';
import { GetPostByIdQuery } from './queries/get-post-by-id.query';
import { GetPostsQuery } from './queries/get-posts.query';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { PostDto } from './dtos/post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { CreateCommentCommand } from './commands/create-comment.command';
import { UpdateCommentCommand } from './commands/update-comment.command';
import { DeleteCommentCommand } from './commands/delete-comment.command';
import { LikeCommentCommand } from './commands/like-comment.command';
import { UnlikeCommentCommand } from './commands/unlike-comment.command';
import { LikePostCommand } from './commands/like-post.command';
import { UnlikePostCommand } from './commands/unlike-post.command';
import { CommentDto } from './dtos/comment.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: PostDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: { id: bigint },
  ): Promise<PostDto> {
    const post = await this.commandBus.execute(new CreatePostCommand(createPostDto, user.id));

    return post.props;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiParam({ name: 'id', description: 'The ID of the post to update', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
    type: PostDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto): Promise<PostDto> {
    const post = await this.commandBus.execute(new UpdatePostCommand(id, updatePostDto));

    return post.props;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'The ID of the post to delete', type: Number })
  @ApiResponse({ status: 204, description: 'The post has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async delete(@Param('id') id: number): Promise<void> {
    await this.commandBus.execute(new DeletePostCommand(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the post to retrieve', type: Number })
  @ApiResponse({ status: 200, description: 'The post details.', type: PostDto })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async getById(@Param('id') id: number): Promise<PostDto> {
    const post = await this.queryBus.execute(new GetPostByIdQuery(id));

    return post.props;
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and search' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for post title or content',
    example: 'My post',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort order (e.g., createdAt:desc)',
    example: 'createdAt:desc',
  })
  @ApiResponse({ status: 200, description: 'A list of posts.', type: [PostDto] })
  async getAll(@Query() getPostsDto: GetPostsDto): Promise<PostDto[]> {
    const posts = await this.queryBus.execute(new GetPostsQuery(getPostsDto));

    return posts.map(post => post.props);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Like a post' })
  @ApiParam({ name: 'id', description: 'The ID of the post to like' })
  @ApiResponse({ status: 204, description: 'The post has been successfully liked.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async likePost(@Param('id') postId: number, @CurrentUser() user: { id: bigint }): Promise<void> {
    await this.commandBus.execute(new LikePostCommand(postId, user.id));
  }

  @Delete(':id/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiParam({ name: 'id', description: 'The ID of the post to unlike' })
  @ApiResponse({ status: 204, description: 'The post has been successfully unliked.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async unlikePost(
    @Param('id') postId: number,
    @CurrentUser() user: { id: bigint },
  ): Promise<void> {
    await this.commandBus.execute(new UnlikePostCommand(postId, user.id));
  }

  @Post(':postId/comments')
  @ApiOperation({ summary: 'Create a new comment for a post' })
  @ApiParam({ name: 'postId', description: 'The ID of the post to comment on', type: Number })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: CommentDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createComment(
    @Param('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: { id: bigint },
  ): Promise<CommentDto> {
    createCommentDto.postId = postId;
    const comment = await this.commandBus.execute(
      new CreateCommentCommand(createCommentDto, user.id),
    );

    return comment.props;
  }

  @Patch(':postId/comments/:commentId')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'postId', description: 'The ID of the post' })
  @ApiParam({ name: 'commentId', description: 'The ID of the comment to update' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully updated.',
    type: CommentDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: { id: bigint },
  ): Promise<CommentDto> {
    updateCommentDto.userId = user.id;
    const comment = await this.commandBus.execute(
      new UpdateCommentCommand(commentId, updateCommentDto),
    );

    return comment.props;
  }

  @Delete(':postId/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'postId', description: 'The ID of the post' })
  @ApiParam({ name: 'commentId', description: 'The ID of the comment to delete' })
  @ApiResponse({ status: 204, description: 'The comment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async deleteComment(
    @Param('commentId') commentId: number,
    @CurrentUser() user: { id: bigint },
  ): Promise<void> {
    await this.commandBus.execute(new DeleteCommentCommand(user.id, commentId));
  }

  @Post(':postId/comments/:commentId/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Like a comment' })
  @ApiParam({ name: 'postId', description: 'The ID of the post' })
  @ApiParam({ name: 'commentId', description: 'The ID of the comment to like' })
  @ApiResponse({ status: 204, description: 'The comment has been successfully liked.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async likeComment(
    @Param('commentId') commentId: number,
    @CurrentUser() user: { id: bigint },
  ): Promise<void> {
    await this.commandBus.execute(new LikeCommentCommand(commentId, user.id));
  }

  @Delete(':postId/comments/:commentId/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unlike a comment' })
  @ApiParam({ name: 'postId', description: 'The ID of the post' })
  @ApiParam({ name: 'commentId', description: 'The ID of the comment to unlike' })
  @ApiResponse({ status: 204, description: 'The comment has been successfully unliked.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async unlikeComment(
    @Param('commentId') commentId: number,
    @CurrentUser() user: { id: bigint },
  ): Promise<void> {
    await this.commandBus.execute(new UnlikeCommentCommand(commentId, user.id));
  }
}
