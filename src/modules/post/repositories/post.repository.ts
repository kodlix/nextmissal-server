import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({ data });
  }

  async findAll(page: number, limit: number, search?: string, sort?: string): Promise<Post[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    const orderBy: Prisma.PostOrderByWithRelationInput = {};
    if (sort) {
      const [field, order] = sort.split(':');
      orderBy[field] = order;
    }

    const where: Prisma.PostWhereInput = {
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.post.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        comments: {
          where: { parentId: null }, // Only top-level comments
          include: {
            author: { select: { id: true, username: true, profileImage: true } },
            replies: {
              include: {
                author: { select: { id: true, username: true, profileImage: true } },
                replies: {
                  include: {
                    author: { select: { id: true, username: true, profileImage: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        comments: {
          where: { parentId: null }, // Only top-level comments
          include: {
            author: { select: { id: true, username: true, profileImage: true } },
            replies: {
              include: {
                author: { select: { id: true, username: true, profileImage: true } },
                replies: {
                  include: {
                    author: { select: { id: true, username: true, profileImage: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, data: Prisma.PostUpdateInput): Promise<Post> {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Post> {
    return this.prisma.post.delete({ where: { id } });
  }
}
