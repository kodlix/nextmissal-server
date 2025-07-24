import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Comment, Prisma } from '@prisma/client';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.create({ data });
  }

  async findAll(
    page: number,
    limit: number,
    postId?: number,
    parentId?: number,
    search?: string,
    sort?: string,
  ): Promise<Comment[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.CommentOrderByWithRelationInput = {};
    if (sort) {
      const [field, order] = sort.split(':');
      orderBy[field] = order;
    }

    const where: Prisma.CommentWhereInput = {
      ...(postId ? { postId } : {}),
      ...(parentId ? { parentId } : { parentId: null }), // Only top-level comments if parentId is not provided
      ...(search
        ? {
            content: { contains: search, mode: 'insensitive' },
          }
        : {}),
    };

    return this.prisma.comment.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        author: { select: { id: true, username: true, profileImage: true } },
        replies: {
          include: {
            author: { select: { id: true, username: true, profileImage: true } },
            replies: true, // Nested replies
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, profileImage: true } },
        replies: {
          include: {
            author: { select: { id: true, username: true, profileImage: true } },
            replies: true, // Nested replies
          },
        },
      },
    });
  }

  async update(id: number, data: Prisma.CommentUpdateInput): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Comment> {
    return this.prisma.comment.delete({ where: { id } });
  }

  async likeComment(commentId: number, userId: bigint): Promise<void> {
    await this.prisma.$transaction(async prisma => {
      await prisma.commentLike.create({
        data: {
          commentId,
          userId,
        },
      });

      await prisma.comment.update({
        where: { id: commentId },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      });
    });
  }

  async unlikeComment(commentId: number, userId: bigint): Promise<void> {
    await this.prisma.$transaction(async prisma => {
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            commentId,
            userId,
          },
        },
      });

      await prisma.comment.update({
        where: { id: commentId },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      });
    });
  }
}
