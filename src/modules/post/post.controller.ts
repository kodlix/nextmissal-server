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
import { PostDto } from './dtos/post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { CreateCommentCommand } from './commands/create-comment.command';
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
}
