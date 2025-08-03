import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { PostController } from './post.controller';
import { PostRepository } from './repositories/post.repository';
import { CreatePostHandler } from './commands/create-post.command';
import { UpdatePostHandler } from './commands/update-post.command';
import { DeletePostHandler } from './commands/delete-post.command';
import { GetPostByIdHandler } from './queries/get-post-by-id.query';
import { GetPostsHandler } from './queries/get-posts.query';
import { CommentRepository } from './repositories/comment.repository';
import { CreateCommentHandler } from './commands/create-comment.command';
import { UpdateCommentHandler } from './commands/update-comment.command';
import { DeleteCommentHandler } from './commands/delete-comment.command';
import { GetCommentByIdHandler } from './queries/get-comment-by-id.query';
import { GetCommentsHandler } from './queries/get-comments.query';
import { LikePostHandler } from './commands/like-post.command';
import { UnlikePostHandler } from './commands/unlike-post.command';
import { LikeCommentHandler } from './commands/like-comment.command';
import { UnlikeCommentHandler } from './commands/unlike-comment.command';
import { PostViewedEventHandler } from './events/post-viewed.event-handler';

const commandHandlers = [
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
  CreateCommentHandler,
  UpdateCommentHandler,
  DeleteCommentHandler,
  LikePostHandler,
  UnlikePostHandler,
  LikeCommentHandler,
  UnlikeCommentHandler,
];
const queryHandlers = [
  GetPostByIdHandler,
  GetPostsHandler,
  GetCommentByIdHandler,
  GetCommentsHandler,
];
const eventHandlers = [PostViewedEventHandler];

@Module({
  imports: [CqrsModule],
  controllers: [PostController],
  providers: [
    PrismaService,
    PostRepository,
    CommentRepository,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
  ],
})
export class PostModule {}
