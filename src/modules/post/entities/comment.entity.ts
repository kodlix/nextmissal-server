import { AggregateRoot } from '@nestjs/cqrs';
import { Comment } from '@prisma/client';

export class CommentEntity extends AggregateRoot implements Comment {
  id: number;
  authorId: bigint;
  postId: number;
  parentId: number | null;
  content: string;
  likesCount: number;
  createdAt: Date;

  constructor(properties: Partial<CommentEntity>) {
    super();
    Object.assign(this, properties);
  }

  get props(): Comment {
    return {
      id: this.id,
      authorId: this.authorId,
      postId: this.postId,
      parentId: this.parentId,
      content: this.content,
      likesCount: this.likesCount,
      createdAt: this.createdAt,
    };
  }
}
