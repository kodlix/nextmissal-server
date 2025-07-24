import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
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

const commandHandlers = [
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
  CreateCommentHandler,
  UpdateCommentHandler,
  DeleteCommentHandler,
];
const queryHandlers = [
  GetPostByIdHandler,
  GetPostsHandler,
  GetCommentByIdHandler,
  GetCommentsHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [PostController],
  providers: [
    PrismaService,
    PostRepository,
    CommentRepository,
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class PostModule {}
